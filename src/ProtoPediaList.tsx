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
import prototypes from "./assets/prototypes_v2.json";
import CountBadge from "./CountBadge";
import DevelopingStatusBadge from "./DevelopingStatusBadge";

const ChipsBox = (props: { items?: string[] }) => {
  const [open, setOpen] = React.useState(false);
  if (!props.items) {
    return;
  }
  const mats = props.items.filter((m) => m !== "ｽﾀｯｸﾁｬﾝ");
  const n = open ? mats.length : 2;
  return (
    <Box>
      {mats.slice(0, n).map((m) => (
        <Chip label={m} key={`chip-${m}`} size="small" sx={{ margin: 0.5 }} />
      ))}
      {open ? (
        <Chip
          icon={<ChevronLeftIcon />}
          size="small"
          variant="outlined"
          color="secondary"
          onClick={() => setOpen(false)}
        />
      ) : mats.length > 2 ? (
        <Chip
          icon={<MoreHorizIcon />}
          size="small"
          variant="outlined"
          color="secondary"
          onClick={() => setOpen(true)}
        />
      ) : null}
    </Box>
  );
};

const DevelopersTypography = (props: { developers?: string[] }) => {
  if (!props.developers) {
    return;
  }

  const names = props.developers.map((s) => s.split("@")[0]);
  return (
    <Typography
      variant="subtitle1"
      component="div"
      sx={{ color: "text.secondary" }}
    >
      {names.join(", ")}
    </Typography>
  );
};

const ProtoTypeCard = (props: { prototype: PrototypeV2Data }) => {
  // https://stackoverflow.com/questions/57818778/how-to-make-material-ui-cardactions-always-stick-to-the-bottom-of-parent
  // https://stackoverflow.com/questions/55824260/same-height-cards-in-material-ui
  const prototype = props.prototype;
  const ss = prototype.mainImage?.split("/");

  const img_path = ss ? `./prototypes/${ss[ss.length - 1]}` : null;

  return (
    <Card sx={{ flexDirection: "column", height: "100%" }} key={prototype.id}>
      <CardActionArea
        component={Link}
        href={`https://protopedia.net/prototype/${prototype.id}`}
        target="_blank"
        rel="noopener"
      >
        {img_path ? (
          <CardMedia
            component="img"
            sx={{ height: { xs: 160, sm: 240 }, maxWidth: 800 }}
            image={img_path}
            alt="Live from space album cover"
          />
        ) : null}
      </CardActionArea>
      <CardContent>
        <Typography component="div" variant="h6">
          {prototype.name}
        </Typography>

        <DevelopersTypography developers={prototype.developers} />
        <Box sx={{ marginBottom: 1 }}>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <DevelopingStatusBadge status={prototype.developingStatus} />
            <CountBadge name="view" count={prototype.viewCount} logo="eye" />
            <CountBadge
              name="good"
              count={prototype.goodCount}
              logo="thumbsup"
            />
          </Stack>
        </Box>
        <ChipsBox items={prototype.awards} />
        <ChipsBox items={prototype.materials} />
        <Typography
          variant="subtitle1"
          color="text.secondary"
          component="div"
          sx={{
            display: { xs: "none", sm: "flex" },
            justifyContent: "space-between",
          }}
        >
          {prototype.summary}
        </Typography>
      </CardContent>
    </Card>
  );
};

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
