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
  Chip,
} from "@mui/material";
import CountBadge from "./CountBadge";
import DevelopingStatusBadge from "./DevelopingStatusBadge";

// icons
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import HexagonIcon from "@mui/icons-material/Hexagon";
import TagIcon from "@mui/icons-material/Tag";

const ChipsBox = (props: {
  items?: string[];
  icon?: React.ReactElement;

  color?:
    | "default"
    | "primary"
    | "secondary"
    | "error"
    | "info"
    | "success"
    | "warning";
  breakpoint?: number;
}) => {
  const [open, setOpen] = React.useState(false);
  if (!props.items) {
    return;
  }
  const mats = props.items.filter((m) => m !== "ｽﾀｯｸﾁｬﾝ"); // remove ｽﾀｯｸﾁｬﾝ material
  const breakpoint = props.breakpoint ?? 2;
  const n = open ? mats.length : breakpoint;

  return (
    <Box>
      {mats.slice(0, n).map((m) => (
        <Chip
          icon={props.icon}
          label={m}
          key={`chip-${m}`}
          size="small"
          color={props.color}
          sx={{ margin: 0.5, fontSize: 11 }}
        />
      ))}
      {open ? (
        <Chip
          icon={<ChevronLeftIcon />}
          size="small"
          variant="outlined"
          color="secondary"
          onClick={() => setOpen(false)}
        />
      ) : mats.length > breakpoint ? (
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
      //   sx={{ color: "text.secondary" }}
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

        <ChipsBox
          items={prototype.awards}
          icon={<WorkspacePremiumIcon />}
          color="primary"
          breakpoint={1}
        />
        <ChipsBox items={prototype.materials} icon={<HexagonIcon />} />
        <ChipsBox items={prototype.tags} icon={<TagIcon />} />
      </CardContent>
    </Card>
  );
};

export default ProtoTypeCard;
