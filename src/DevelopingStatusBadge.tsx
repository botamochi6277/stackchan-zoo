import { Box } from "@mui/material";

const DevelopingStatusBadge = (props: { status: number }) => {
  // （1:アイデア, 2:開発中, 3:完成, 4:供養）
  switch (props.status) {
    case 1:
      return (
        <Box
          component="img"
          sx={{
            objectFit: "cover",
          }}
          alt="Badge"
          src={`https://custom-icon-badges.demolab.com/badge/status-idea-0798A2.svg?logo=light-bulb&logoColor=white&style=flat`}
          key={"status badge"}
        />
      );
      break;
    case 2:
      return (
        <Box
          component="img"
          sx={{
            objectFit: "cover",
          }}
          alt="Badge"
          src={`https://custom-icon-badges.demolab.com/badge/status-developing-0798A2.svg?logo=play&logoColor=white&style=flat`}
          key={"status badge"}
        />
      );
    case 3:
      return (
        <Box
          component="img"
          sx={{
            objectFit: "cover",
          }}
          alt="Badge"
          src={`https://custom-icon-badges.demolab.com/badge/status-completed-0798A2.svg?logo=issue-closed&logoColor=white&style=flat`}
          key={"status badge"}
        />
      );
    case 4:
      return (
        <Box
          component="img"
          sx={{
            objectFit: "cover",
          }}
          alt="Badge"
          src={`https://custom-icon-badges.demolab.com/badge/status-memorial-0798A2.svg?logo=archive&logoColor=white&style=flat`}
          key={"status badge"}
        />
      );

    default:
      return (
        <Box
          component="img"
          sx={{
            objectFit: "cover",
          }}
          alt="Badge"
          src={`https://custom-icon-badges.demolab.com/badge/status-error-0798A2.svg?logo=issue-closed&logoColor=white&style=flat`}
          key={"status badge"}
        />
      );
  }
};

export default DevelopingStatusBadge;
