import * as React from "react";
// mui
import {
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Link,
  Typography,
  Box,
  Stack,
  Collapse,
  IconButton,
  Chip,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";

// icons
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

// assets
import prototypes from "./assets/prototypes.json";

const ProtoTypeCard = (props: {
  name: string;
  prototype_id: number;
  img: string;
  summary: string;
  materials?: string[];
}) => {
  // https://stackoverflow.com/questions/57818778/how-to-make-material-ui-cardactions-always-stick-to-the-bottom-of-parent
  // https://stackoverflow.com/questions/55824260/same-height-cards-in-material-ui

  const ChipsBox = () => {
    const [open, setOpen] = React.useState(false);
    if (!props.materials) {
      return;
    }
    const mats = props.materials.filter((m) => m !== "ｽﾀｯｸﾁｬﾝ");
    const n = open ? mats.length : 2;
    return (
      <Box>
        {mats.slice(0, n).map((m) => (
          <Chip
            label={m}
            key={`${props.prototype_id}-${m}`}
            size="small"
            sx={{ margin: 0.5 }}
          />
        ))}
        {open ? (
          <Chip
            icon={<ChevronLeftIcon />}
            size="small"
            variant="outlined"
            label="hide"
            color="secondary"
            onClick={() => setOpen(false)}
          />
        ) : mats.length > 2 ? (
          <Chip
            icon={<MoreHorizIcon />}
            size="small"
            variant="outlined"
            label="more"
            color="secondary"
            onClick={() => setOpen(true)}
          />
        ) : null}
      </Box>
    );
  };

  return (
    <Card
      sx={{ flexDirection: "column", height: "100%" }}
      key={props.prototype_id}
    >
      <CardActionArea
        component={Link}
        href={`https://protopedia.net/prototype/${props.prototype_id}`}
        target="_blank"
        rel="noopener"
      >
        <CardMedia
          component="img"
          sx={{ height: { xs: 160, sm: 240 }, maxWidth: 800 }}
          image={props.img}
          alt="Live from space album cover"
        />
      </CardActionArea>
      <CardContent>
        <Typography component="div" variant="h5">
          {props.name}
        </Typography>
        <ChipsBox />
        <Typography
          variant="subtitle1"
          color="text.secondary"
          component="div"
          sx={{
            display: { xs: "none", sm: "flex" },
            justifyContent: "space-between",
          }}
        >
          {props.summary}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default function ProtoPediaList() {
  const items = prototypes.prototypes
    .sort((a, b) => a.prototype_id - b.prototype_id)
    .map((p) => {
      const ss = p.images[0].split("/");
      const img_path = `./prototypes/${ss[ss.length - 1]}`;
      return (
        <ProtoTypeCard
          name={p.name}
          prototype_id={p.prototype_id}
          img={img_path}
          summary={p.summary}
          materials={p.materials}
          key={p.prototype_id}
        />
      );
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
