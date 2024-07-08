/* eslint-disable no-restricted-syntax */
import React, { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, Pie, PieChart } from "recharts";
import MainLayout from "@/components/layout/MainLayout";
import { useToast } from "@/components/shared/Toast/use-toast";
import {
  BLKS_PER_SECTION_PIE_CHART_CONFIG,
  BLK_COORDINATES,
  DF_GO_GREEN_2024,
  SECTOR_A_COORDINATES,
  SECTOR_BAR_CHART_CONFIG,
  SECTOR_B_COORDINATES,
  SECTOR_C_COORDINATES,
  SECTOR_D_COORDINATES,
  TABLE_COLUMN_ACTIONS
} from "@/lib/data";
import { Button } from "@/components/shared/Button";
import { ToastAction } from "@/components/shared/Toast";
import { DataTable } from "@/components/shared/Table/DataTable";
import { Separator } from "@/components/shared/Separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/shared/Card";
import { Progress } from "@/components/shared/Progress";
import { Skeleton } from "@/components/shared/Skeleton";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/shared/Chart";
import { calculateStatistics } from "@/lib/utils";

const Home = () => {
  const { toast } = useToast();
  const supabaseClient = useSupabaseClient();
  const [dbHDBData, setDbHDBData] = useState([]);
  const [actions, setActions] = useState([]);
  const [loadingActions, setLoadingActions] = useState(true);
  const [loadingDbHDBData, setLoadingDbHDBData] = useState(true);
  const [mapState, setMapState] = useState(0); // 0 = hdb blocks, 1 = sectors overlay, 2 heatmap overlay
  const [overallProgress, setOverallProgress] = useState({
    pct: null,
    completed: null,
    total: null
  });

  const [sectorBarChartData, setSectorBarChartData] = useState([]);
  const [blksPerSectorPieChartData, setBlksPerSectorPieChartData] = useState(
    []
  );
  const aggBlksCompletion = (data) => {
    const completed = [];
    const uncompleted = [];
    const blocksBySector = {};
    Object.keys(DF_GO_GREEN_2024).forEach((key) =>
      DF_GO_GREEN_2024[key].blocks.forEach((oneBlock) => {
        blocksBySector[oneBlock] = key;
      })
    );
    const sectorBarChart = {};
    data.forEach((oneData) => {
      if (oneData.completed) {
        completed.push(oneData.block);
        sectorBarChart[blocksBySector[oneData.block]] = {
          notCompleted:
            sectorBarChart[blocksBySector[oneData.block]]?.notCompleted || 0,
          completed:
            (sectorBarChart[blocksBySector[oneData.block]]?.completed || 0) + 1
        };
      } else {
        uncompleted.push(oneData.block);
        sectorBarChart[blocksBySector[oneData.block]] = {
          ...sectorBarChart[oneData.block],
          notCompleted:
            (sectorBarChart[blocksBySector[oneData.block]]?.notCompleted || 0) +
            1,
          completed:
            sectorBarChart[blocksBySector[oneData.block]]?.completed || 0
        };
      }
    });

    const sectorBarChartOrdered = Object.keys(sectorBarChart)
      .sort()
      .reduce((obj, key) => {
        obj[key] = sectorBarChart[key];
        return obj;
      }, {});

    const sectorBarChartArr = Object.keys(sectorBarChartOrdered).map(
      (oneSector) => ({
        sector: oneSector,
        completed: sectorBarChart[oneSector]?.completed,
        notCompleted: sectorBarChart[oneSector]?.notCompleted
      })
    );

    return [completed, uncompleted, sectorBarChartArr];
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
    setLoadingDbHDBData(false);
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
        timestamp: dayjs(oneAction.created_at).format("hh:mm:ss A DD MMM YYYY"),
        newRow: false
      }))
    );
    setLoadingActions(false);
  };

  useEffect(() => {
    fetchDbHDBData();
    fetchActionsData();

    // REALTIME SUBSCRIPTION
    const channelHdbBlocksCck = supabaseClient
      .channel("hdb_blocks_cck")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "hdb_blocks_cck" },
        (payload) => {
          setDbHDBData((curr) =>
            curr.map((oneBlock) => {
              if (oneBlock.block === payload.new.block) {
                return payload.new;
              }
              return oneBlock;
            })
          );
        }
      )
      .subscribe();

    const channelActions = supabaseClient
      .channel("actions")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "actions" },
        (payload) => {
          setActions((curr) => {
            // Create a copy of the current state
            const updatedActions = [...curr];

            // Remove the last action
            if (updatedActions.length >= 10) {
              updatedActions.pop();
            }

            updatedActions[0].newRow = false;

            // Add the new action at the start
            updatedActions.unshift({
              ...payload.new,
              user: payload.new.username,
              timestamp: dayjs(payload.new.created_at).format(
                "hh:mm:ss A DD MMM YYYY"
              ),
              newRow: true
            });
            return updatedActions;
          });
        }
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(channelHdbBlocksCck);
      supabaseClient.removeChannel(channelActions);
    };
  }, []);

  useEffect(() => {
    const [completed, uncompleted, sectorBarChartArr] =
      aggBlksCompletion(dbHDBData);
    setOverallProgress({
      pct: (completed.length / dbHDBData.length) * 100,
      completed: completed.length,
      total: dbHDBData.length
    });
    setSectorBarChartData(sectorBarChartArr);

    const blksPerSectorArr = Object.keys(DF_GO_GREEN_2024).map((key) => ({
      noBlks: DF_GO_GREEN_2024[key].blocks.length,
      label: key,
      fill: BLKS_PER_SECTION_PIE_CHART_CONFIG[key].color
    }));
    console.log(blksPerSectorArr);
    setBlksPerSectorPieChartData(blksPerSectorArr);
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
        <div className="grid gap-y-4  lg:gap-x-4 md:grid-cols-1 lg:grid-cols-3 mt-8">
          <span className="col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Map View</CardTitle>
                <CardDescription>
                  Powered by OpenStreetMap and Leaflet.js
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Map
                  className="w-full h-[400px] md:h-[700px] z-10 rounded"
                  position={[1.3785, 103.7403]}
                  zoom={16}
                >
                  {mapState === 0 ? (
                    generateHDBCompletedPolygons()
                  ) : (
                    <>
                      <Polygon positions={SECTOR_A_COORDINATES} color="yellow">
                        <Tooltip
                          direction="bottom"
                          offset={[0, 20]}
                          opacity={1}
                        >
                          Sector White (A)
                        </Tooltip>
                      </Polygon>
                      <Polygon positions={SECTOR_B_COORDINATES} color="red">
                        <Tooltip
                          direction="bottom"
                          offset={[0, 20]}
                          opacity={1}
                        >
                          Sector Red (B)
                        </Tooltip>
                      </Polygon>
                      <Polygon positions={SECTOR_C_COORDINATES} color="blue">
                        <Tooltip
                          direction="bottom"
                          offset={[0, 20]}
                          opacity={1}
                        >
                          Sector Blue (C)
                        </Tooltip>
                      </Polygon>
                      <Polygon positions={SECTOR_D_COORDINATES} color="green">
                        <Tooltip
                          direction="bottom"
                          offset={[0, 20]}
                          opacity={1}
                        >
                          Sector Green (D)
                        </Tooltip>
                      </Polygon>
                    </>
                  )}
                </Map>
                <div className="mt-4 space-y-4 sm:space-y-0 sm:space-x-4 flex flex-col sm:flex-row">
                  <Button
                    disabled={mapState === 0}
                    onClick={() => handleClickMapState(0)}
                  >
                    Show hdb blocks
                  </Button>
                  <Button
                    disabled={mapState === 1}
                    onClick={() => handleClickMapState(1)}
                  >
                    Show sectors
                  </Button>
                </div>
              </CardContent>
            </Card>
          </span>

          <span className="col-span-2 md:col-span-1 space-y-4 justify-between flex flex-col w-full h-full">
            <Card className="h-full">
              <CardHeader>
                {loadingDbHDBData ? (
                  <Skeleton className="w-[100px] h-[20px] rounded-full" />
                ) : (
                  <CardTitle className="linear-gradient">
                    {parseInt(overallProgress?.completed || 0, 10)}%
                  </CardTitle>
                )}

                {loadingDbHDBData ? (
                  <Skeleton className="w-[200px] h-[20px] rounded-full" />
                ) : (
                  <CardDescription>
                    Overall Progress ({overallProgress.completed}/
                    {overallProgress.total} blks)
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                {loadingDbHDBData ? (
                  <Skeleton className="w-[300px] h-[20px] rounded-full" />
                ) : (
                  <Progress value={overallProgress?.completed || 0} />
                )}
              </CardContent>
            </Card>
            <Card  className="h-full">
              <CardHeader>
                <CardTitle>Completion by Sector</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={SECTOR_BAR_CHART_CONFIG}>
                  <BarChart accessibilityLayer data={sectorBarChartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="sector"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent />}
                    />
                    <Bar dataKey="completed" fill="#22c55e" radius={4} />
                    <Bar dataKey="notCompleted" fill="#ef4444" radius={4} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
            <Card  className="h-full">
              <CardHeader>
                <CardTitle>Timeline</CardTitle>
                <CardDescription>Blks per sector</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={BLKS_PER_SECTION_PIE_CHART_CONFIG}
                  className="mx-auto aspect-square max-h-[300px]"
                >
                  <PieChart>
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Pie data={blksPerSectorPieChartData} dataKey="noBlks" />
                    <ChartLegend
                      content={<ChartLegendContent nameKey="label" />}
                      className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
                    />
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </span>
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
