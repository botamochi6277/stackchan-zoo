import * as React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Palette,
  TextField,
  MenuItem,
  Slider,
  Switch,
  FormControlLabel,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";

type LayoutName = "random" | "circle" | "concentric" | "grid" | "cose";
type TargetName = "material" | "event" | "tag" | "developer";

import CytoscapeComponent from "react-cytoscapejs";

const getter = (p: PrototypeV2Data, target: TargetName) => {
  switch (target) {
    case "event":
      return p.events;
    case "tag":
      return p.tags;
    case "developer":
      return p.developers;

    default:
      return p.materials;
  }
};

// Works are linked directly when they share items (materials, tags, ...).
// The more items two works share, the thicker the edge is.
const WorkNetwork = (props: {
  prototypes: PrototypeV2Data[];
  palette: Palette;
}) => {
  const [target, setTarget] = React.useState<TargetName>("material");
  const [layout, setLayout] = React.useState<LayoutName>("cose");
  // hide edges between works sharing fewer items than this
  const [minShared, setMinShared] = React.useState(1);
  // ignore items attached to most of the works (e.g. the stack-chan tag itself)
  const [hideHubs, setHideHubs] = React.useState(true);

  // item name -> works having the item
  const itemWorks = new Map<string, number[]>();
  props.prototypes.forEach((p) => {
    new Set(getter(p, target) ?? []).forEach((item) => {
      itemWorks.set(item, [...(itemWorks.get(item) ?? []), p.id]);
    });
  });

  // work pair -> shared items
  const hubThreshold = props.prototypes.length / 2;
  const pairs = new Map<string, { a: number; b: number; items: string[] }>();
  itemWorks.forEach((ids, item) => {
    if (hideHubs && ids.length > hubThreshold) return;
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        const key = `${ids[i]}-${ids[j]}`;
        const pair = pairs.get(key) ?? { a: ids[i], b: ids[j], items: [] };
        pair.items.push(item);
        pairs.set(key, pair);
      }
    }
  });

  const edges = Array.from(pairs.values())
    .filter((pair) => pair.items.length >= minShared)
    .map((pair) => ({
      data: {
        source: String(pair.a),
        target: String(pair.b),
        shared: pair.items.length,
        label: pair.items.map((s) => s.split("@")[0]).join(", "),
      },
    }));

  // works without any link carry no relationship information
  const degree = new Map<string, number>();
  edges.forEach((e) => {
    degree.set(e.data.source, (degree.get(e.data.source) ?? 0) + 1);
    degree.set(e.data.target, (degree.get(e.data.target) ?? 0) + 1);
  });
  const nodes = props.prototypes
    .filter((p) => degree.has(String(p.id)))
    .map((p) => {
      const ss = p.mainImage?.split("/");
      return {
        data: {
          id: String(p.id),
          name: p.name,
          img: ss ? `./prototypes/${ss[ss.length - 1]}` : undefined,
          // well-connected works are larger
          size: 30 + Math.min((degree.get(String(p.id)) ?? 0) * 2, 40),
        },
      };
    });

  const elements: cytoscape.ElementDefinition[] = [...nodes, ...edges];

  // highlight the hovered node and its neighbors, fade the others
  const cyRef = React.useRef<cytoscape.Core | null>(null);
  const attachHover = (cy: cytoscape.Core) => {
    cy.on("mouseover", "node, edge", (ev) => {
      const target = ev.target;
      cy.elements().addClass("faded");
      (target.isNode() ? target.closedNeighborhood() : target.connectedNodes().union(target))
        .removeClass("faded")
        .addClass("highlighted");
    });
    cy.on("mouseout", "node, edge", () => {
      cy.elements().removeClass("faded highlighted");
    });
  };

  const stylesheet = [
    {
      selector: "node",
      css: {
        width: "data(size)",
        height: "data(size)",
        "background-color": props.palette.primary.main,
      },
    },
    {
      selector: "node[img]",
      css: {
        "background-image": "data(img)",
        "background-fit": "cover",
      },
    },
    {
      selector: "edge",
      css: {
        width: "mapData(shared, 1, 5, 1, 6)",
        "line-color": "#888",
        opacity: 0.6,
      },
    },
    {
      selector: "node.highlighted",
      css: {
        content: "data(name)",
        "font-size": 10,
        "text-valign": "top",
        "text-wrap": "ellipsis",
        "text-max-width": "120px",
        color: props.palette.text.primary,
        "border-width": 2,
        "border-color": props.palette.primary.main,
      },
    },
    {
      // show shared items on the hovered edge
      selector: "edge.highlighted",
      css: {
        content: "data(label)",
        "font-size": 9,
        "text-wrap": "ellipsis",
        "text-max-width": "160px",
        color: props.palette.text.primary,
        "line-color": props.palette.primary.main,
        opacity: 1,
      },
    },
    {
      selector: ".faded",
      css: { opacity: 0.08 },
    },
  ] as cytoscape.Stylesheet[];

  return (
    <Card>
      <CardContent>
        <ToggleButtonGroup
          exclusive
          size="small"
          value={target}
          onChange={(_, v) => v && setTarget(v as TargetName)}
        >
          {["material", "tag", "developer", "event"].map((s) => (
            <ToggleButton key={`target-${s}`} value={s}>
              {s}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
        <Typography variant="body2" sx={{ my: 1 }}>
          {`Works are linked when they share ${target}s. Thicker edge = more shared. ${nodes.length} works, ${edges.length} links.`}
        </Typography>
        <Box sx={{ border: 2, borderColor: "secondary" }}>
          <CytoscapeComponent
            // remount so that the graph and its layout are rebuilt from scratch
            key={`${target}-${minShared}-${hideHubs}-${layout}`}
            elements={elements}
            style={{ height: "600px" }}
            stylesheet={stylesheet}
            layout={{ name: layout }}
            cy={(cy) => {
              if (cyRef.current !== cy) {
                cyRef.current = cy;
                attachHover(cy);
              }
            }}
          />
        </Box>
      </CardContent>
      <CardActions sx={{ flexWrap: "wrap", gap: 2, px: 2 }}>
        <TextField
          id="filled-select-layout"
          select
          label="Layout"
          variant="outlined"
          size="small"
          value={layout}
          onChange={(ev) => setLayout(ev.target.value as LayoutName)}
        >
          {["random", "circle", "concentric", "grid", "cose"].map((s) => (
            <MenuItem key={`layout-select-${s}`} value={s}>
              {s}
            </MenuItem>
          ))}
        </TextField>
        <Box sx={{ width: 200 }}>
          <Typography variant="caption">
            {`Min. shared ${target}s: ${minShared}`}
          </Typography>
          <Slider
            size="small"
            min={1}
            max={5}
            step={1}
            value={minShared}
            onChange={(_, v) => setMinShared(v as number)}
          />
        </Box>
        <FormControlLabel
          label="Ignore common items"
          control={
            <Switch
              checked={hideHubs}
              onChange={(ev) => setHideHubs(ev.target.checked)}
            />
          }
        />
      </CardActions>
    </Card>
  );

  // NOTE compound: grouping with parents
};

const NetworkTab = (props: {
  prototypes: PrototypeV2Data[];
  palette: Palette;
}) => {
  return (
    <Box>
      <WorkNetwork prototypes={props.prototypes} palette={props.palette} />
    </Box>
  );
};

export default NetworkTab;
