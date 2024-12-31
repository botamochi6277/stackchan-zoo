import { Box } from "@mui/material";

const CountBadge = (props: { name: string; count: number; logo: string }) => {
  return (
    <Box
      component="img"
      sx={{
        objectFit: "cover",
      }}
      alt={`${props.name} count badge`}
      src={`https://custom-icon-badges.demolab.com/badge/${props.name}-${props.count}-0798A2.svg?logo=${props.logo}&logoColor=white&style=flat`}
      key={`${props.name} counter`}
    />
  );
};

export default CountBadge;
