// import * as React from "react";
// mui
import { Card, CardContent, Typography, Box } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import { BarChart } from "@mui/x-charts/BarChart";

type Group = { title: string; prototypes: PrototypeV2Data[] };

const TrendChartCard = (props: { groups: Group[] }) => {
  const createdYears = props.groups.map((group) =>
    group.prototypes.map((obj) => new Date(obj.createDate).getFullYear())
  );

  //   count year https://qiita.com/saka212/items/408bb17dddefc09004c8
  const allYears = createdYears.flat();
  const minYear = Math.min(...allYears);
  const maxYear = Math.max(...allYears);

  const years = Array.from(
    { length: maxYear - minYear + 1 },
    (_, idx) => minYear + idx
  );
  return (
    <Card>
      <CardContent>
        <Typography component="div" variant="h6">
          Trends
        </Typography>
        <LineChart
          xAxis={[
            {
              data: years,
              label: "years",
              height: 50,
              valueFormatter: (y: number) => String(y),
              tickLabelInterval: (y) => years.includes(y),
            },
          ]}
          yAxis={[{ label: "#created", width: 60 }]}
          series={props.groups.map((group, idx) => ({
            curve: "linear",
            label: group.title,
            data: years.map(
              (year) => createdYears[idx].filter((y) => y === year).length
            ),
          }))}
          //   width={500}
          height={200}
        />
      </CardContent>
    </Card>
  );
};

const MaterialsCard = (props: {
  groups: Group[];
  target: "material" | "tag";
  minCounts?: number;
}) => {
  const getter = (p: PrototypeV2Data) => {
    if (props.target === "material") {
      return p.materials;
    } else {
      // tags
      return p.tags;
    }
  };
  const minCounts = props.minCounts ?? 10;

  // name -> counts of each group
  const counts = new Map<string, number[]>();
  props.groups.forEach((group, idx) => {
    group.prototypes.forEach((p) => {
      (getter(p) ?? []).forEach((name) => {
        const c = counts.get(name) ?? props.groups.map(() => 0);
        c[idx] += 1;
        counts.set(name, c);
      });
    });
  });

  // show an item when any group reaches minCounts
  const plotItems = Array.from(counts.entries())
    .filter(([, c]) => c.some((n) => n >= minCounts))
    .sort(
      ([, a], [, b]) => b.reduce((x, y) => x + y, 0) - a.reduce((x, y) => x + y, 0)
    );

  return (
    <Card>
      <CardContent>
        <Typography component="div" variant="h6">
          {`${props.target[0].toUpperCase()}${props.target.slice(1)}s`}
        </Typography>
        <BarChart
          //   width={500}
          height={300}
          series={props.groups.map((group, idx) => ({
            data: plotItems.map(([, c]) => c[idx]),
            label: group.title,
          }))}
          xAxis={[{ height: 40 }]}
          yAxis={[
            {
              data: plotItems.map(([name]) => name),
              scaleType: "band",
              width: 160,
            },
          ]}
          layout="horizontal"
          grid={{ vertical: true }}
        />
      </CardContent>
    </Card>
  );
};

const StatsTab = (props: { groups: Group[] }) => {
  return (
    <Box>
      <TrendChartCard groups={props.groups} />
      <MaterialsCard groups={props.groups} target="material" minCounts={5} />
      <MaterialsCard groups={props.groups} target="tag" minCounts={5} />
    </Box>
  );
};

export default StatsTab;
