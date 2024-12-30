// import * as React from 'react';

// mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import CardMedia from '@mui/material/CardMedia';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Carousel from 'react-material-ui-carousel';
import Button from '@mui/material/Button';
// icons
import LinkIcon from '@mui/icons-material/Link';

// assets
import prototypes from "./assets/prototypes.json";

const ProtoTypeCard = (props: {
  name: string,
  prototype_id: number,
  img: string,
  summary: string
}) => {

  return (
    <Card sx={{ display: 'flex' }} key={props.prototype_id}>
      <CardMedia
        component="img"
        sx={{ height: 240, maxWidth: 600 }}
        image={props.img}
        alt="Live from space album cover"
      />
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flex: '1 0 auto' }}>
          <Typography component="div" variant="h5">
            {props.name}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" component="div">
            {props.summary}
          </Typography>
        </CardContent>
        {/* https://stackoverflow.com/questions/75052470/align-mui-card-action-to-the-top-right */}
        <CardActions
          sx={{
            alignSelf: "stretch",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "flex-start",
            // 👇 Edit padding to further adjust position
            p: 1,
          }}
        >
          <Button
            component={Link}
            href={`https://protopedia.net/prototype/${props.prototype_id}`}
            target="_blank"
            rel="noopener"
            startIcon={<LinkIcon />}
          >
            ProtoPedia Page
          </Button>
        </CardActions>
      </Box>
    </Card>
  );
}

const ProtoPediaCarousel = () => {

  const items = prototypes.prototypes.map(
    p => {
      const ss = p.images[0].split("/");
      const img_path = `./prototypes/${ss[ss.length - 1]}`;
      return (<ProtoTypeCard
        name={p.name} prototype_id={p.prototype_id}
        img={img_path} summary={p.summary} key={p.prototype_id}
      />)
    }
  )
  return (
    <>
      <Carousel
        interval={5000}>
        {items}
      </Carousel>
    </>
  )
}


export default ProtoPediaCarousel;