import {
  Container,
  CssBaseline,
  Stack,
  ThemeProvider,
  createTheme,
  type Theme,
} from "@mui/material";
import * as React from "react";

// custom

import MyAppBar from "./MyAppBar";
import MyTabs from "./MyTabs";
import ProtoPediaList from "./ProtoPediaList";
import TeamHeader from "./TeamHeader";
import StatsTab from "./StatsTab";
import NetworkTab from "./NetworkTab";
import HelpTab from "./HelpTab";
// assets
import profile from "./assets/profile.json";
import my_theme from "./theme";
import protopediaData from "./assets/prototypes_v2.json";

// icons
import { QuestionMark as QuestionMarkIcon } from "@mui/icons-material";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import CollectionsIcon from "@mui/icons-material/Collections";
import HubIcon from "@mui/icons-material/Hub";
import TagIcon from "@mui/icons-material/Tag";

// ProtoPedia tag / material for stack-chan (ｽﾀｯｸﾁｬﾝ)
const STACKCHAN_TAG = "ｽﾀｯｸﾁｬﾝ";
const STACKCHAN_MATERIAL = "ｽﾀｯｸﾁｬﾝ";

// works with the stack-chan material
const isStackchanWork = (p: PrototypeV2Data) =>
  !!p.materials?.includes(STACKCHAN_MATERIAL);
// works tagged as stack-chan but without the stack-chan material
const isStackchanRelatedWork = (p: PrototypeV2Data) =>
  !!p.tags?.includes(STACKCHAN_TAG) && !isStackchanWork(p);

function App() {
  const [theme, setTheme] = React.useState(
    createTheme({
      ...my_theme,
      palette: {
        mode: "dark",
      },
    }),
  );
  const toggleTheme = (theme: Theme) => {
    if (theme.palette.mode === "dark") {
      setTheme(createTheme({ ...my_theme, palette: { mode: "light" } }));
    } else {
      setTheme(createTheme({ ...my_theme, palette: { mode: "dark" } }));
    }
  };

  // try to create youtube channel top page
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Stack spacing={1}>
          <MyAppBar
            name={profile.team_name}
            theme={theme}
            onToggleTheme={() => toggleTheme(theme)}
            avatarUrl={profile.avatar_image}
          />
          {/* Banner/Header Image */}
          {/* https://jp.cyberlink.com/blog/photoeditor/1755/best-photo-software-to-make-youtube-banners#:~:text=YouTube%20ヘッダー・バナーサイズと作成時の注意点,-ヘッダー・バナー作成&text=以下の図のよう,のサイズで作ります%E3%80%82 */}
          {/* https://stackoverflow.com/questions/61263669/does-material-ui-have-an-image-component */}
          {/* <Box
            component="img"
            sx={{
              aspectRatio: { xs: 1546 / 423, md: 1855 / 423, lg: 2560 / 423 },
              width: "100%",
              objectFit: "cover",
              borderRadius: 4,
            }}
            alt="Channel Art"
            src={profile.header_image}
          /> */}

          <TeamHeader
            team_name={profile.team_name}
            user_name={profile.user_name}
            avatar_img={profile.avatar_image}
            description={profile.description}
            socials={profile.socials}
            key={"team_header"}
          />

          <MyTabs
            key={"my_tabs"}
            items={[
              // ProtoPediaList for stack-chan materials
              // developer assume these works as "stack-chan" works
              {
                icon: <CollectionsIcon fontSize="small" />,
                label: `${STACKCHAN_MATERIAL} in ProtoPedia`,
                content: (
                  <ProtoPediaList
                    prototypes={protopediaData.prototypes.filter((p) =>
                      p.materials?.includes(STACKCHAN_MATERIAL),
                    )}
                    species="stack-chans"
                  />
                ),
              },
              // Works related to Stackchan
              {
                icon: <TagIcon fontSize="small" />,
                label: `${STACKCHAN_TAG}関連作品`,
                content: (
                  <ProtoPediaList
                    // tagged, but without the stack-chan material
                    prototypes={protopediaData.prototypes.filter(
                      (p) =>
                        p.tags?.includes(STACKCHAN_TAG) &&
                        !p.materials?.includes(STACKCHAN_MATERIAL),
                    )}
                    species="stack-chan-related items"
                  />
                ),
              },
              {
                icon: <QueryStatsIcon fontSize="small" />,
                label: "Stats",
                content: (
                  <StatsTab
                    groups={[
                      {
                        title: "ｽﾀｯｸﾁｬﾝ",
                        prototypes:
                          protopediaData.prototypes.filter(isStackchanWork),
                      },
                      {
                        title: "ｽﾀｯｸﾁｬﾝ関連",
                        prototypes: protopediaData.prototypes.filter(
                          isStackchanRelatedWork,
                        ),
                      },
                    ]}
                  />
                ),
              },
              {
                icon: <HubIcon fontSize="small" />,
                label: "Networks",
                content: (
                  <NetworkTab
                    prototypes={protopediaData.prototypes}
                    palette={theme.palette}
                  />
                ),
              },
              {
                icon: <QuestionMarkIcon fontSize="small" />,
                label: "Help",
                content: <HelpTab />,
              },
            ]}
          />
        </Stack>
      </Container>
    </ThemeProvider>
  );
}

export default App;
