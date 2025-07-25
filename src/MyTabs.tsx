import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab } from "@mui/material";
import * as React from "react";

{
  /* https://mui.com/material-ui/react-tabs/ */
}
interface TabPropItem {
  icon?: JSX.Element;
  label?: string;
  content?: JSX.Element;
}
export default function MyTabs(props: { items?: TabPropItem[] }) {
  const [tab_id, setTabId] = React.useState("0");

  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    setTabId(newValue);
  };
  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={tab_id}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            {props.items?.map((item, idx) => (
              <Tab
                icon={item.icon}
                label={item.label}
                key={`tab-${item.label}`}
                value={`${idx}`}
                iconPosition="start"
              />
            ))}
          </TabList>
        </Box>
        {props.items?.map((item, idx) => (
          <TabPanel value={`${idx}`} key={`tab-${item.label}-panel`}>
            {item.content}
          </TabPanel>
        ))}
      </TabContext>
    </Box>
  );
}
