// header like youtube channel
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Link,
  Stack,
  Typography
} from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2';


interface Social {
  name: string,
  link: string,
  badge: string
}

export default function TeamHeader(
  props: { team_name: string, user_name: string, avatar_img: string, description: string, socials: Social[] }) {

  // https://m3.material.io/components/chips/guidelines
  return (
    <Card >
      <Grid container spacing={2}>
        <Grid xs={0} sm={4}
          sx={{
            display: { xs: "none", sm: "flex" },
            justifyContent: "center",
            alignItems: "center"
          }}>
          <Box
            component="img"
            sx={{
              aspectRatio: 1,
              width: { xs: 140, sm: 200 },
              objectFit: "cover",
              borderRadius: "50%"
            }}
            alt="Avatar"
            src={props.avatar_img}
          />
        </Grid>
        <Grid xs={12} sm={8}>
          <CardContent>
            <Typography component="div" variant="h3">
              {props.team_name}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" component="div">
              {props.user_name}
            </Typography>
            {/* badges */}
            <Typography>
              {props.description}
            </Typography>
          </CardContent>

          <CardActions>

            <Stack direction={"row"} spacing={1} useFlexGap flexWrap="wrap">
              {props.socials.map(item => (
                <Link
                  component="a"
                  href={item.link}
                  target="_blank"
                  rel="noopener"
                  key={`social-${item.name}`}
                >
                  <Box
                    component="img"
                    sx={{
                      // height: { xs: 24, sm: 24 },
                      objectFit: "cover",
                      bgcolor: 'primary.main',
                      '&:hover': {
                        opacity: 0.8,
                      },
                    }}
                    alt="Badge"
                    src={item.badge}
                    key={item.name}
                  />
                </Link>

              ))}
            </Stack>
          </CardActions>
        </Grid>
      </Grid>
    </Card>
  );
}