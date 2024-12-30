import {
  AppBar,
  Container,
  Toolbar,
  Typography,
  Avatar,
  Stack,
  Switch,
  Theme,
} from "@mui/material";
// icons
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

const MyAppBar = (props: {
  theme: Theme;
  onToggleTheme?: any; // (event: ChangeEvent<HTMLInputElement>, checked: boolean) => void)
  name: string;
}) => {
  return (
    <AppBar position="static" color="primary" enableColorOnDark>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* <ArchitectureIcon sx={{ display: { md: 'flex' }, mr: 1 }} /> */}
          <Avatar
            alt="avatar"
            src="https://avatars.githubusercontent.com/u/14128408?v=4"
            sx={{ display: { md: "flex" }, mr: 1 }}
          />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", sm: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            {props.name}
          </Typography>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}
          ></Typography>

          {/* <Link color="inherit" href='https://github.com/botamochi6277' target='_blank' rel="noopener">
            <GitHubIcon />
          </Link> */}

          <Stack direction="row" spacing={0.5} alignItems="center">
            <LightModeIcon />
            <Switch
              checked={props.theme.palette.mode === "dark"}
              onChange={props.onToggleTheme}
              color="secondary"
            />
            <DarkModeIcon />
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default MyAppBar;
