// import * as React from "react";
// mui
import { Box } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";

// assets
import prototypes from "./assets/prototypes_v2.json";

import ProtoTypeCard from "./PrototypeCard";

export default function ProtoPediaList() {
  const items = prototypes.prototypes
    .sort((a, b) => a.id - b.id)
    .map((p) => {
      return <ProtoTypeCard prototype={p} />;
    });

  return (
    <Box>
      {/* https://custom-icon-badges.demolab.com/badge/num_stackchans-46-blue.svg?logo=paintbrush&logoColor=white */}

      <Box
        component="img"
        sx={{
          // height: { xs: 24, sm: 24 },
          objectFit: "cover",
          // bgcolor: "primary.main",
          "&:hover": {
            opacity: 0.8,
          },
        }}
        alt="Badge"
        src={`https://custom-icon-badges.demolab.com/badge/stackchans-${items.length}-blue.svg?logo=people&logoColor=gray&style=social`}
        key={"counter"}
      />
      <Grid container spacing={2}>
        {items.map((item, idx) => (
          <Grid xs={12} sm={6} md={4} key={idx}>
            {item}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
