
// ProtoPedia
type PrototypeRawData = {
  image1: string,
  image2: string,
  image3: string,
  image4: string,
  image5: string,
  prototypeNm: string,
  status: number,
  summary: string,
  userNm: string,
  teamNm: string,
  materialNm: string,
  tags: string,
  id: number,
  viewCount: number,
  goodCount: number,
}

type PrototypeData = {
  name: string,
  summary: string,
  developing_status: number,
  images: string[],
  developer: string,
  team: string,
  tags: string[],
  materials: string[],
  prototype_id: number,
}