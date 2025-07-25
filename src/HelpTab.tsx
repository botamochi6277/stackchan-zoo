// import * as React from "react";
// mui
import { Card, CardContent, Typography, Box, Link } from "@mui/material";

const HelpTab = () => {
  return (
    <Box>
      <Card>
        <CardContent>
          <Typography variant="h5" component="div">
            Help
          </Typography>
          <Typography variant="body2">
            This page fetches stack-chan works from{" "}
            <Link
              href={"https://protopediav2.docs.apiary.io/#"}
              target="_blank"
              rel="noopener"
            >
              ProtoPedia API v2
            </Link>
            . These works are created with stack-chan material and published
            under CC BY 4.0 license.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default HelpTab;
