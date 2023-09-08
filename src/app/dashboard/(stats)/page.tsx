"use client";

import { AreaChart, BarChart, Metric, Text } from "@tremor/react";
import { useMemo, useState } from "react";
import { P, match } from "ts-pattern";
import { columns, modelColors } from "./columns";
import { DataTable } from "~/app/dashboard/(stats)/data-table";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Skeleton } from "~/components/ui/skeleton";
import { RequestsDataJson } from "~/server/api/routers/stats";
import { api } from "~/trpc/client";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
import { Badge } from "~/components/ui/badge";

const models = ["gpt-3.5-turbo", "gpt-4"];

type Interval = Parameters<
  typeof api.stats.getModelRequests.useQuery
>[0]["interval"];

/** Based on the interval, construct a more "optimized" x axis, including filling in the blanks */
function formatXAxis(
  mode: Interval,
  data: RequestsDataJson["data"],
  models: string[]
) {
  const bins = match(mode)
    .with("1h", () => {
      // construct a new array with every 5 minute interval in the last hour
      const now = new Date();
      const hourAgo = new Date(now.getTime() - 1000 * 60 * 60);
      const timeBuckets = [];
      for (let i = hourAgo; i <= now; i.setMinutes(i.getMinutes() + 5)) {
        // Round the minutes to the nearest 5
        const minutes = Math.round(i.getMinutes() / 5) * 5;
        i.setMinutes(minutes);
        timeBuckets.push({
          datetime: new Date(i),
          label: i.toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
          }),
        });
      }
      return timeBuckets;
    })
    .with("24h", () => {
      // construct a new array with every hour interval in the last 24 hours
      const now = new Date();
      const dayAgo = new Date(now.getTime() - 1000 * 60 * 60 * 24);
      const timeBuckets = [];
      for (let i = dayAgo; i <= now; i.setHours(i.getHours() + 1)) {
        // Round the minutes to the nearest 5
        i.setMinutes(0);
        timeBuckets.push({
          datetime: new Date(i),
          label: i.toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
          }),
        });
      }
      return timeBuckets;
    })
    .with(P.union("7d", "30d", "90d"), () => {
      const numDays = mode === "90d" ? 90 : mode === "7d" ? 7 : 30;
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 1000 * 60 * 60 * 24 * numDays);
      const timeBuckets = [];
      for (let i = weekAgo; i <= now; i.setDate(i.getDate() + 1)) {
        timeBuckets.push({
          datetime: new Date(i),
          label: i.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
        });
      }
      return timeBuckets;
    })
    .otherwise(() => [])
    .map((bucket) => {
      const newBucket: Record<string, number> = models.reduce(
        (acc, model) => ({ ...acc, [model]: 0 }),
        {}
      );
      return { ...newBucket, ...bucket } as Record<string, any>;
    });

  console.log("Bins", bins);

  /** For each data point, find the closest bin and update the model values */
  // For each data point, find the closest bin and update the model values
  data.forEach((dataPoint) => {
    // Convert the timebucket of the data point to a Date object
    const dataPointTime = new Date(dataPoint.timebucket);

    // Initialize the closest bin and the smallest difference
    let closestBin: any = null;
    let closestBinIndex = -1;
    let smallestDiff = Infinity;

    // Iterate over all bins
    bins.forEach((bin, index) => {
      // Calculate the absolute difference between the bin's datetime and the data point's time
      const diff = Math.abs(bin.datetime.getTime() - dataPointTime.getTime());

      console.log("Comparing: ", bin.datetime, dataPointTime);

      // If this difference is smaller than the smallest difference we've seen so far
      if (diff < smallestDiff) {
        // Update the smallest difference and the closest bin
        smallestDiff = diff;
        closestBin = bin;
        closestBinIndex = index;
      }
    });

    // For each model, update the corresponding value in the closest bin
    models.forEach((model) => {
      // Skip the 'timebucket' model
      if (model === "timebucket") return;

      // Update the model value in the closest bin
      bins[closestBinIndex]![model] +=
        dataPoint[model as keyof typeof dataPoint];
    });
  });

  console.log("Bins", bins);

  return bins;
}

export default function RequestsByModel() {
  const [interval, setInterval] = useState<Interval>("1h");

  const context = api.useContext();
  const modelRequests = api.stats.getModelRequests.useQuery({
    interval,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });

  const formatted = useMemo(() => {
    if (!modelRequests.data) return [];
    return formatXAxis(interval, modelRequests.data.data, [...models, "total"]);
  }, [modelRequests.data, interval]);

  const table = api.stats.getRequestsRaw.useQuery({});

  return (
    <div className="grid w-full min-w-[700px] gap-2">
      <div className="flex flex-row justify-between">
        <Button variant="ghost" disabled>
          <Plus className="mr-2 h-4 w-4" /> Add Filter
          <Badge className="ml-2">Coming Soon</Badge>
        </Button>

        <Select
          value={interval}
          onValueChange={(e) => {
            setInterval(e as typeof interval);
            context.stats.getModelRequests.reset({
              timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
              interval,
            });
          }}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder={interval} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1h">Last hour</SelectItem>
            <SelectItem value="24h">Last 24 hours</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 3 months</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Card className="w-full min-w-0">
        <CardHeader>
          <div className="flex flex-row justify-between">
            <div>
              <Text>Requests</Text>
              <Metric>
                {modelRequests.data
                  ? modelRequests.data.data
                      .map((x) => x.total)
                      .reduce((a, b) => a + b, 0)
                  : null}
              </Metric>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {modelRequests.data ? (
            <BarChart
              allowDecimals={false}
              data={formatted}
              stack={true}
              index="label"
              categories={models}
              colors={Object.values(modelColors) as any}
            />
          ) : (
            <Skeleton className="h-32 w-full rounded-md" />
          )}
        </CardContent>
      </Card>

      {table.data ? <DataTable columns={columns} data={table.data} /> : null}
    </div>
  );
}
