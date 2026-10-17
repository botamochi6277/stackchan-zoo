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
  Stack,
  Slider,
  Switch,
  FormControlLabel,
} from "@mui/material";

type LayoutName = "random" | "circle" | "concentric" | "grid" | "cose";

import CytoscapeComponent from "react-cytoscapejs";
const MaterialNetwork = (props: {
  prototypes: PrototypeV2Data[];
  target: "material" | "event" | "tag" | "developer";
  palette: Palette;
}) => {
  const [layout, setLayout] = React.useState<LayoutName>("cose");
  // hide items linked to fewer works than this
  const [minLinks, setMinLinks] = React.useState(2);
  // hide items linked to most of the works (e.g. the stack-chan tag itself)
  const [hideHubs, setHideHubs] = React.useState(true);
  const getter = (p: PrototypeV2Data) => {
    switch (props.target) {
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

  // item name -> number of linked works
  const linkCounts = new Map<string, number>();
  props.prototypes.forEach((p) => {
    new Set(getter(p) ?? []).forEach((item) => {
      linkCounts.set(item, (linkCounts.get(item) ?? 0) + 1);
    });
  });

  const hubThreshold = props.prototypes.length / 2;
  const visibleItems = new Set(
    Array.from(linkCounts.entries())
      .filter(
        ([, n]) => n >= minLinks && !(hideHubs && n > hubThreshold)
      )
      .map(([item]) => item)
  );

  const itemNodes = Array.from(visibleItems).map((item) => {
    const count = linkCounts.get(item) ?? 1;
    return {
      data: {
        id: item,
        name: item.split("@")[0],
        // node size is proportional to the number of linked works
        size: Math.min(20 + 6 * count, 90),
      },
      classes: "item",
    };
  });

  const edges = props.prototypes.flatMap((p) =>
    Array.from(new Set(getter(p) ?? []))
      .filter((item) => visibleItems.has(item))
      .map((item) => ({ data: { source: item, target: p.id } }))
  );

  // works without any visible link carry no relationship information
  const linkedIds = new Set(edges.map((e) => e.data.target));
  const prototypeNodes = props.prototypes
    .filter((p) => linkedIds.has(p.id))
    .map((p) => {
      const ss = p.mainImage?.split("/");
      return {
        data: {
          id: p.id,
          name: p.name,
          img: ss ? `./prototypes/${ss[ss.length - 1]}` : undefined,
        },
        classes: "prototype",
      };
    }) as any[];

  const elements = prototypeNodes.concat(itemNodes).concat(edges);

  // highlight the hovered node and its neighbors, fade the others
  const cyRef = React.useRef<cytoscape.Core | null>(null);
  const attachHover = (cy: cytoscape.Core) => {
    cy.on("mouseover", "node", (ev) => {
      cy.elements().addClass("faded");
      ev.target
        .closedNeighborhood()
        .removeClass("faded")
        .addClass("highlighted");
    });
    cy.on("mouseout", "node", () => {
      cy.elements().removeClass("faded highlighted");
    });
  };

  // https://github.com/cytoscape/cytoscape.js/tree/master/documentation/demos/images-breadthfirst-layout
  const stylesheet = [
    {
      selector: ".item",
      css: {
        content: "data(name)",
        width: "data(size)",
        height: "data(size)",
        "font-size": 10,
        "text-valign": "bottom",
        "text-margin-y": 2,
        color: props.palette.text.primary,
        "background-color": "#888",
      },
    },
    {
      selector: ".prototype",
      css: {
        width: 50,
        height: 50,
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
        width: 1,
        "line-color": "#888",
      },
    },
    {
      selector: ".prototype.highlighted",
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
      selector: "edge.highlighted",
      css: {
        width: 2,
        "line-color": props.palette.primary.main,
      },
    },
    {
      selector: ".faded",
      css: { opacity: 0.12 },
    },
  ] as cytoscape.Stylesheet[];
  // https://js.cytoscape.org/#layouts

  return (
    <Card>
      <CardContent>
        <Typography component="div" variant="h6">
          {`${props.target[0].toUpperCase()}${props.target.slice(1)}s`}
        </Typography>
        <Box sx={{ border: 2, borderColor: "secondary" }}>
          <CytoscapeComponent
            elements={elements}
            style={{ height: "500px" }}
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
            {`Min. links: ${minLinks}`}
          </Typography>
          <Slider
            size="small"
            min={1}
            max={10}
            step={1}
            value={minLinks}
            onChange={(_, v) => setMinLinks(v as number)}
          />
        </Box>
        <FormControlLabel
          label="Hide common items"
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
      <Stack direction={"column"} spacing={1}>
        {["event", "material", "tag", "developer"].map((s) => (
          <MaterialNetwork
            key={`network-${s}`}
            prototypes={props.prototypes}
            target={s as "material" | "event" | "tag" | "developer"}
            palette={props.palette}
          />
        ))}
      </Stack>
    </Box>
  );
};

export default NetworkTab;
