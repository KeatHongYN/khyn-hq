/* eslint-disable no-restricted-syntax */
import React, { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { useToast } from "@/components/shared/Toast/use-toast";
import {
  BLK_COORDINATES,
  SECTOR_A_COORDINATES,
  SECTOR_B_COORDINATES,
  SECTOR_C_COORDINATES,
  SECTOR_D_COORDINATES,
  TABLE_COLUMN_ACTIONS
} from "@/lib/data";
import { Button } from "../shared/Button";
import { ToastAction } from "@/components/shared/Toast";
import { DataTable } from "@/components/shared/Table/DataTable";
import { Separator } from "@/components/shared/Separator";

const Home = () => {
  const { toast } = useToast();
  const supabaseClient = useSupabaseClient();
  const [dbHDBData, setDbHDBData] = useState([]);
  const [actions, setActions] = useState([]);
  const [loadingActions, setLoadingActions] = useState(true);
  const [mapState, setMapState] = useState(0); // 0 = hdb blocks, 1 = sectors overlay, 2 heatmap overlay
  // const blockCoordinates = Object.keys(BLK_COORDINATES).map(
  //   (blk) => BLK_COORDINATES[blk]
  // );
  const aggBlksCompletion = () => {
    const completed = [];
    const uncompleted = [];
    return [completed, uncompleted];
  };

  const fetchDbHDBData = async () => {
    const { data, error } = await supabaseClient
      .from("hdb_blocks_cck")
      .select();
    if (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        action: <ToastAction altText="Try again">Try again</ToastAction>
      });
      return;
    }
    setDbHDBData(data);
  };

  const fetchActionsData = async () => {
    const { data, error } = await supabaseClient
      .from("actions")
      .select()
      .order("created_at", { ascending: false })
      .limit(10);
    if (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        action: <ToastAction altText="Try again">Try again</ToastAction>
      });
      return;
    }
    setActions(
      data.map((oneAction) => ({
        ...oneAction,
        user: oneAction.username,
        timestamp: dayjs(oneAction.created_at).format("hh:mm:ss A DD MMM YYYY")
      }))
    );
    setLoadingActions(false);
  };

  // REALTIME SUBSCRIPTION
  supabaseClient
    .channel("hdb_blocks_cck")
    .on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "hdb_blocks_cck" },
      (payload) => {
        setDbHDBData((curr) =>
          curr.map((oneBlock) => {
            console.log("ramn here");
            if (oneBlock.block === payload.new.block) {
              return payload.new;
            }
            return oneBlock;
          })
        );
      }
    )
    .subscribe();

  supabaseClient
    .channel("actions")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "actions" },
      (payload) => {
        console.log(payload);
        setActions((curr) => {
          // Create a copy of the current state
          const updatedActions = [...curr];

          // Remove the last action
          if (updatedActions.length >= 10) {
            updatedActions.pop();
          }

          // Add the new action at the start
          updatedActions.unshift({
            ...payload.new,
            user: payload.new.username,
            timestamp: dayjs(payload.new.created_at).format(
              "hh:mm:ss A DD MMM YYYY"
            )
          });

          return updatedActions;
        });
      }
    )
    .subscribe();

  useEffect(() => {
    fetchDbHDBData();
    fetchActionsData();
  }, []);

  useEffect(() => {
    aggBlksCompletion(dbHDBData);
  }, [dbHDBData]);

  const Map = useMemo(
    () =>
      dynamic(() => import("@/components/shared/Map"), {
        // eslint-disable-next-line react/no-unstable-nested-components
        loading: () => <p>A map is loading</p>,
        ssr: false
      }),
    []
  );
  const Polygon = dynamic(
    () => import("react-leaflet").then((mod) => mod.Polygon),
    { ssr: false }
  );
  const Tooltip = dynamic(
    () => import("react-leaflet").then((mod) => mod.Tooltip),
    { ssr: false }
  );

  const handleClickMapState = (newMapState) => {
    setMapState(newMapState);
  };

  const generateHDBCompletedPolygons = () =>
    dbHDBData.map((oneBlock, index) => (
      <Polygon
        positions={BLK_COORDINATES[oneBlock.block]}
        color={oneBlock.completed ? "#22c55e" : "#ef4444"}
        pathOptions={{
          weight: "1.5"
        }}
        key={`polygon-hdb-${index}`}
      >
        <Tooltip direction="bottom" offset={[0, 20]} opacity={1}>
          Blk {oneBlock.block} <br />
          {oneBlock.completed ? "Completed" : "Not completed"}
        </Tooltip>
      </Polygon>
    ));

  const renderLatestActions = () => {
    if (loadingActions) {
      return <Loader2 className="h-6 w-6 animate-spin" />;
    }
    if (actions.length === 0) {
      return <p className="font-sm">No data available.</p>;
    }
    return <DataTable columns={TABLE_COLUMN_ACTIONS} data={actions} />;
  };

  return (
    <MainLayout>
      <div className="m-auto flex-1 h-full w-full max-w-screen-xl justify-between items-center px-6 sm:px-16 mb-16">
        <span className="flex justify-between items-center mt-6">
          <h1 className="text-xl font-bold">GoGreen 2024</h1>
          <span className="flex gap-x-2 items-center">
            <Image
              style={{ objectFit: "contain" }}
              src="/assets/up.png"
              alt="system status"
              width={15}
              height={15}
            />
            <p className="text-slate-500 text-xs font-medium">Live Data</p>
          </span>
        </span>
        <div className="flex space-x-4">
          <Map
            className="w-full h-[700px] mt-8 z-10"
            position={[1.3785, 103.7403]}
            zoom={16}
          >
            {mapState === 0 ? (
              generateHDBCompletedPolygons()
            ) : (
              <>
                <Polygon positions={SECTOR_A_COORDINATES} color="yellow">
                  <Tooltip direction="bottom" offset={[0, 20]} opacity={1}>
                    Sector White (A)
                  </Tooltip>
                </Polygon>
                <Polygon positions={SECTOR_B_COORDINATES} color="red">
                  <Tooltip direction="bottom" offset={[0, 20]} opacity={1}>
                    Sector Red (B)
                  </Tooltip>
                </Polygon>
                <Polygon positions={SECTOR_C_COORDINATES} color="blue">
                  <Tooltip direction="bottom" offset={[0, 20]} opacity={1}>
                    Sector Blue (C)
                  </Tooltip>
                </Polygon>
                <Polygon positions={SECTOR_D_COORDINATES} color="green">
                  <Tooltip direction="bottom" offset={[0, 20]} opacity={1}>
                    Sector Green (D)
                  </Tooltip>
                </Polygon>
              </>
            )}
          </Map>
        </div>

        <div className="mt-4 space-x-4">
          <Button onClick={() => handleClickMapState(0)}>
            Show hdb blocks
          </Button>
          <Button onClick={() => handleClickMapState(1)}>Show sectors</Button>
        </div>
        <Separator className="my-8" />
        <div>
          <h2 className="font-bold text-lg mb-4">Latest 10 Actions</h2>
          {renderLatestActions()}
        </div>
      </div>
    </MainLayout>
  );
};

export default Home;
