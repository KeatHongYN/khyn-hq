/* eslint-disable no-await-in-loop */
/* eslint-disable no-plusplus */
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/shared/Form";
import { useToast } from "@/components/shared/Toast/use-toast";
import { ToastAction } from "@/components/shared/Toast";
import { Button } from "@/components/shared/Button";
import MainLayout from "@/components/layout/MainLayout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/shared/Select";
import { DF_GO_GREEN_2024 } from "@/lib/data";
import { Checkbox } from "@/components/shared/Checkbox";
import { createClient } from "@/lib/supabase/component";

const submitFormSchema = z.object({
  sector: z.string().min(1),
  blocks: z.array(z.string()).optional()
});

const Submit = ({ user }) => {
  const { toast } = useToast();
  const router = useRouter();
  const [dbHDBDataCompleted, setDbHDBDataCompleted] = useState([]);
  const [loading, setLoading] = useState(true);
  const [blockList, setBlockList] = useState([]);
  const supabaseClient = createClient();

  const submitForm = useForm({
    resolver: zodResolver(submitFormSchema),
    defaultValues: {
      sector: "",
      blocks: []
    },
    mode: "onChange"
  });

  const fetchDbHDBDataCompleted = async () => {
    const { data, error } = await supabaseClient
      .from("hdb_blocks_cck")
      .select()
      .eq("completed", true);
    if (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        action: <ToastAction altText="Try again">Try again</ToastAction>
      });
      return;
    }
    setLoading(false);
    setDbHDBDataCompleted(data);
  };

  const sectorList = Object.keys(DF_GO_GREEN_2024).map((key) => ({
    label: DF_GO_GREEN_2024[key].name,
    value: key
  }));
  const onSubmit = async ({ sector, blocks }) => {
    let errorOccured = false;

    const formattedBlocksBySector = DF_GO_GREEN_2024[sector].blocks.map(
      (block) => ({
        block,
        completed: !!blocks.includes(block)
      })
    );

    for (let i = 0; i < formattedBlocksBySector.length; i++) {
      const { error } = await supabaseClient
        .from("hdb_blocks_cck")
        .update({ completed: formattedBlocksBySector[i].completed })
        .eq("block", formattedBlocksBySector[i].block);
      if (error) {
        errorOccured = true;
        break;
      }
    }
    if (errorOccured) {
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "Please try again later!"
      });
      return;
    }

    const { error: errorInsert } = await supabaseClient.from("actions").insert({
      action: `updated block(s) for sector ${sector}`,
      username: user.user_metadata.username
    });

    if (errorInsert) {
      console.error(errorInsert);
    }

    toast({
      title: "Update success",
      description: "Data is updated!"
    });
    router.replace("/");
  };
  // this is needed to tell form to update the isValid for some reason
  const placeholder = submitForm.formState.isValid;

  const onError = (error) => {
    console.log(error);
    toast({
      variant: "destructive",
      title: "Uh oh! Something went wrong.",
      description: "There was a problem with your request.",
      action: <ToastAction altText="Try again">Try again</ToastAction>
    });
  };

  const handleSectorChange = (value) => {
    submitForm.setValue(
      "blocks",
      dbHDBDataCompleted.map((oneHDB) => oneHDB.block)
    );
    setBlockList(DF_GO_GREEN_2024[value].blocks);
  };

  useEffect(() => {
    fetchDbHDBDataCompleted();
  }, []);

  return (
    <MainLayout>
      <div className="m-auto h-full w-full max-w-screen-xl px-6 lg:px-24 flex flex-col justify-between items-center sm:px-16">
        <h1 className="text-xl font-bold mt-2 text-center">
          Submit data for GoGreen 2024
        </h1>
        {loading ? (
          <span className="flex justify-center mt-4">
            <Loader2 className="h-6 w-6 animate-spin" />
          </span>
        ) : (
          <Form {...submitForm}>
            <form
              onSubmit={submitForm.handleSubmit(onSubmit, onError)}
              className="flex flex-col justify-center items-center my-4 w-[220px] sm:w-[300px]"
            >
              <FormField
                control={submitForm.control}
                name="sector"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Sector</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(props) => {
                          field.onChange(props);
                          handleSectorChange(props);
                        }}
                        defaultValue={field.value}
                        disabled={submitForm.formState.isSubmitting}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select sector" />
                        </SelectTrigger>
                        <SelectContent>
                          {sectorList.map((oneSector, index) => (
                            <SelectItem
                              key={`sector-${index}`}
                              value={oneSector.value}
                            >
                              {oneSector.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4 w-full mt-4">
                <FormField
                  control={submitForm.control}
                  name="blocks"
                  render={() => (
                    <FormItem className="w-full">
                      <FormLabel>Blocks</FormLabel>
                      {blockList.map((oneBlock, index) => (
                        <FormField
                          key={`blocks-${index}`}
                          control={submitForm.control}
                          name="blocks"
                          render={({ field }) => (
                            <FormItem className="flex w-full flex-row items-center space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  disabled={submitForm.formState.isSubmitting}
                                  checked={field.value?.includes(oneBlock)}
                                  onCheckedChange={(checked) =>
                                    checked
                                      ? field.onChange([
                                          ...field.value,
                                          oneBlock
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== oneBlock
                                          )
                                        )
                                  }
                                />
                              </FormControl>
                              <FormLabel className="text-xs">
                                BLK {oneBlock}
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                    </FormItem>
                  )}
                />
              </div>

              <Button
                disabled={
                  submitForm.formState.isSubmitting ||
                  !submitForm.formState.isDirty ||
                  !submitForm.formState.isValid
                }
                loading={submitForm.formState.isSubmitting}
                className="w-full mt-52"
                type="submit"
              >
                Submit data
              </Button>
            </form>
          </Form>
        )}
      </div>
    </MainLayout>
  );
};

export default Submit;
