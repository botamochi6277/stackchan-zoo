import * as React from "react";
// mui
import {
  Box,
  IconButton,
  Typography,
  ListItem,
  ListItemText,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";

// icons
import PinIcon from "@mui/icons-material/Pin";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import UpdateIcon from "@mui/icons-material/Update";

// assets
import prototypes from "./assets/prototypes_v2.json";

import ProtoTypeCard from "./PrototypeCard";

const OrderButtons = (props: {
  currentOrder: string;
  items: { order: string; icon: React.ReactElement }[];
  setOrder: (s: string) => void;
}) => {
  const buttons = props.items.map((item) => {
    return (
      <IconButton
        key={`btn-${item.order}`}
        color={item.order === props.currentOrder ? "primary" : "default"}
        onClick={() => {
          props.setOrder(item.order);
        }}
      >
        {item.icon}
      </IconButton>
    );
  });
  return buttons;
};

export default function ProtoPediaList() {
  const [order, setOrder] = React.useState("ids");

  const mySort = (a: PrototypeV2Data, b: PrototypeV2Data, order: string) => {
    switch (order) {
      case "ids":
        return a.id - b.id; // decrease
      case "views":
        return b.viewCount - a.viewCount;
      case "goods":
        return b.goodCount - a.goodCount;
      case "updatedDate":
        return Date.parse(b.updateDate) - Date.parse(a.updateDate);
      default:
        return 1;
    }
  };
  const items = prototypes.prototypes
    .sort((a, b) => mySort(a, b, order))
    .map((p) => {
      return <ProtoTypeCard prototype={p} />;
    });

  return (
    <Box>
      {/* https://custom-icon-badges.demolab.com/badge/num_stackchans-46-blue.svg?logo=paintbrush&logoColor=white */}

      <Box>
        {/* <Box
          component="img"
          sx={{
            objectFit: "cover",
            "&:hover": {
              opacity: 0.8,
            },
          }}
          alt="Badge"
          src={`https://custom-icon-badges.demolab.com/badge/stackchans-${items.length}-blue.svg?logo=people&logoColor=gray&style=social`}
          key={"counter"}
        /> */}
        <Typography>{items.length} stack-chans are in this zoo.</Typography>

        {/* sorting radio-like buttons */}

        <ListItem>
          <ListItemText primary="Sort:" />
          <OrderButtons
            currentOrder={order}
            setOrder={setOrder}
            items={[
              { order: "ids", icon: <PinIcon /> },
              { order: "views", icon: <VisibilityIcon /> },
              { order: "goods", icon: <ThumbUpIcon /> },
              { order: "updatedDate", icon: <UpdateIcon /> },
            ]}
          />
        </ListItem>
      </Box>

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
