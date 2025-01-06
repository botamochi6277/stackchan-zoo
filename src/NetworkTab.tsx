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
} from "@mui/material";

type LayoutName = "random" | "circle" | "concentric" | "grid" | "cose";

import CytoscapeComponent from "react-cytoscapejs";
const MyNetwork = (props: {
  prototypes: PrototypeV2Data[];
  target: "material" | "event";
  palette: Palette;
}) => {
  const [layout, setLayout] = React.useState<LayoutName>("cose");
  const getter = (p: PrototypeV2Data) => {
    if (props.target === "material") {
      return p.materials;
    } else {
      // events
      return p.events;
    }
  };
  const allMaterials = props.prototypes.reduce((prev, next) => {
    if (!getter(next)) {
      return prev;
    }

    return prev.concat(getter(next) ?? []);
  }, [] as string[]);
  const uniqueMaterials = Array.from(new Set(allMaterials));
  const materialNodes = uniqueMaterials.map((mat) => {
    return { data: { id: mat, name: mat.split("@")[0] }, classes: "material" };
  });
  const nodes = props.prototypes.map((prototype) => {
    return {
      data: { id: prototype.id, name: prototype.name },
      classes: "prototype",
      // position: { x: idx * 20, y: idx * 5 },
    };
  }) as any[];

  const edges = props.prototypes.reduce((prev, next) => {
    const tmp = getter(next);
    if (!tmp) {
      return prev;
    }

    const tmpEdges = tmp.map((p) => {
      return {
        data: { source: p, target: next.id },
      };
    });

    return prev.concat(tmpEdges);
  }, [] as any[]);

  const elements = nodes.concat(materialNodes).concat(edges);

  // https://github.com/cytoscape/cytoscape.js/tree/master/documentation/demos/images-breadthfirst-layout
  const nodeStyle = props.prototypes.map((prototype) => {
    const ss = prototype.mainImage?.split("/");
    const img_path = ss ? `./prototypes/${ss[ss.length - 1]}` : null;
    return {
      selector: `#${prototype.id}`,
      css: {
        backgroundImage: img_path,
        backgroundFit: "cover",
        height: 80,
        width: 80,
      },
    };
  });

  const stylesheet = [
    {
      selector: ".material",
      css: {
        content: "data(name)",
        "text-valign": "center",
        color: "white",
        "text-outline-width": 2,
        "text-outline-color": "#888",
        "background-color": "#888",
      },
    },
    {
      selector: ".prototype:active",
      css: {
        "background-color": props.palette.primary.dark,
        "text-outline-width": 2,
        "text-outline-color": props.palette.primary.dark,
        "outline-width": 2,
        color: "white",
        content: "data(name)",
        "text-valign": "top",
      },
    },
  ].concat(nodeStyle as any[]) as cytoscape.Stylesheet[];
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
            style={{ height: "400px" }}
            stylesheet={stylesheet}
            layout={{ name: layout, padding: 10 }}
          />
        </Box>
      </CardContent>
      <CardActions>
        <TextField
          id="filled-select-layout"
          select
          label="Layout"
          variant="outlined"
          value={layout}
          onChange={(ev) => setLayout(ev.target.value as LayoutName)}
        >
          {["random", "circle", "concentric", "grid", "cose"].map((s) => (
            <MenuItem key={`layout-select-${s}`} value={s}>
              {s}
            </MenuItem>
          ))}
        </TextField>
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
      <MyNetwork
        prototypes={props.prototypes}
        target="event"
        palette={props.palette}
      />
    </Box>
  );
};

export default NetworkTab;
