// import * as React from "react";
// mui
import { Card, CardContent, Typography, Box } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
// import { BarChart } from "@mui/x-charts/BarChart";

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

// const MaterialsCard = (props: { prototypes: PrototypeV2Data[] }) => {
//   // num. of materials
//   const allMaterials = props.prototypes.reduce((prev, next) => {
//     if (!next.materials) {
//       return prev;
//     }

//     return prev.concat(next.materials);
//   }, [] as string[]);

//   const uniqueMaterials = Array.from(new Set(allMaterials));

//   const materialCount = uniqueMaterials.map(
//     (mat) => allMaterials.filter((m) => m === mat).length
//   );

//   return (
//     <Card>
//       <CardContent>
//         <BarChart
//           width={500}
//           height={300}
//           series={[{ data: materialCount, label: "pv", id: "pvId" }]}
//           xAxis={[{ data: uniqueMaterials, scaleType: "band" }]}
//         />
//       </CardContent>
//     </Card>
//   );
// };

const StatsTab = (props: { prototypes: PrototypeV2Data[] }) => {
  return <Box>{<TrendChartCard prototypes={props.prototypes} />}</Box>;
};

export default StatsTab;
