// import * as React from "react";
// mui
import { Card, CardContent, Typography, Box } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import { BarChart } from "@mui/x-charts/BarChart";

const TrendChartCard = (props: { prototypes: PrototypeV2Data[] }) => {
  const createdYears = props.prototypes.map((obj) => {
    const date = new Date(obj.createDate);
    return date.getFullYear();
  });

  //   count year https://qiita.com/saka212/items/408bb17dddefc09004c8
  //   const count = createdYears.reduce(function (prev, current) {
  //     prev[current] = (prev[current] || 0) + 1;
  //     return prev;
  //   }, {});

  const minYear = Math.min(...createdYears);
  const maxYear = Math.max(...createdYears);

  const years = Array.from(
    { length: maxYear - minYear + 1 },
    (_, idx) => minYear + idx
  );
  const counts = years.map((year) => {
    return createdYears.filter((y) => y === year).length;
  });
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
              tickLabelInterval: (y, _) => years.includes(y),
            },
          ]}
          yAxis={[{ label: "#created" }]}
          series={[
            {
              curve: "linear",
              data: counts,
            },
          ]}
          //   width={500}
          height={200}
        />
      </CardContent>
    </Card>
  );
};

const MaterialsCard = (props: {
  prototypes: PrototypeV2Data[];
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
  // num. of materials
  const allMaterials = props.prototypes.reduce((prev, next) => {
    if (!getter(next)) {
      return prev;
    }

    return prev.concat(getter(next) ?? []);
  }, [] as string[]);

  const uniqueMaterials = Array.from(new Set(allMaterials));
  const minCounts = props.minCounts ?? 10;

  const materialCount = uniqueMaterials.map(
    (mat) => allMaterials.filter((m) => m === mat).length
  );

  const tmpItems = uniqueMaterials.map((mat, idx) => {
    return {
      name: mat,
      counts: materialCount[idx],
    };
  });

  const plotItems = tmpItems
    .filter((item) => item.counts >= minCounts)
    .sort((a, b) => b.counts - a.counts);

  return (
    <Card>
      <CardContent>
        <Typography component="div" variant="h6">
          {`${props.target[0].toUpperCase()}${props.target.slice(1)}s`}
        </Typography>
        <BarChart
          //   width={500}
          height={300}
          series={[
            {
              data: plotItems.map((item) => item.counts),
              label: `#${props.target}s`,
            },
          ]}
          yAxis={[
            {
              data: plotItems.map((item) => item.name),
              scaleType: "band",
            },
          ]}
          layout="horizontal"
          margin={{ left: 120 }}
          grid={{ vertical: true }}
        />
      </CardContent>
    </Card>
  );
};

const StatsTab = (props: { prototypes: PrototypeV2Data[] }) => {
  return (
    <Box>
      <TrendChartCard prototypes={props.prototypes} />
      <MaterialsCard
        prototypes={props.prototypes}
        target="material"
        minCounts={5}
      />

      <MaterialsCard prototypes={props.prototypes} target="tag" minCounts={5} />
    </Box>
  );
};

export default StatsTab;
