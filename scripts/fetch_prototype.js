// node  --loader ts-node/esm scripts/fetch_prototype.ts
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import yargs from 'yargs';
import { hideBin } from "yargs/helpers";

const args = yargs(hideBin(process.argv))
  .command("* <material_id> <api_key>", "fetch prototype data from ProtoPedia")
  .positional("material_id", {
    describe: "material_id to extract. stack-chan is 833",
    type: "string",
    demandOption: true,
  })
  .positional("api_key", {
    describe: "api_key to fetch prototype data",
    type: "string",
    demandOption: true,
  })
  .option("output", {
    alias: "o",
    default: "src/assets/prototypes.json",
    type: "string"
  })
  .option("img_dir", {
    default: "public/prototypes",
    type: "string"
  })
  .parseSync()

const parseResponse = (data/* : PrototypeRawData[]*/) => {
  if (data.length == 0) {
    return;
  }

  // unique prototype_ids
  const prototype_ids = data.map(d => d.id);
  const prototype_uniq_ids = Array.from(new Set(prototype_ids));
  console.log(`#prototypes ${prototype_uniq_ids.length} (${prototype_ids.length})`);
  const idx = prototype_uniq_ids.map((id) => prototype_ids.findIndex(i => i == id));

  return idx.map(i => data[i]);// prototypes
}

const parseProjectData = (data0 /* : PrototypeRawData*/) => {
  if (!data0) {
    return;
  }
  const images_ref = [
    data0?.image1, data0?.image2, data0?.image3, data0?.image4, data0?.image5
  ]
  // material list with removing overlap values
  // const mat = data.map(d => d.materialNm).filter((elem, index, self) => self.indexOf(elem) === index);
  const images = images_ref.filter((im) => im); // remove null



  const proto/*: PrototypeData*/ = {
    name: data0.prototypeNm,
    developing_status: data0.status,
    images: images,
    summary: data0.summary,
    developer: data0.userNm,
    team: data0.teamNm,
    materials: data0.materialNm,
    tags: data0.tags?.split('|'),
    prototype_id: data0.id
  }
  // console.log(proto);
  return proto;
}

const downloadFile = (url, path) => {
  axios.get(url, { responseType: "arraybuffer" })
    .then((res) => {
      fs.writeFileSync(path, Buffer.from(res.data), 'binary');
    }).catch((error) => {
      console.warning(error);
    })
}

const fetchMaterials = async (token/*: string*/, prototype_id/*: number*/) => {

  const url = `https://protopedia.net/api/prototypes.json?token=${token}&prototypeId=${prototype_id}`;
  const res = await axios.get(url);

  return res.data.map(d => d.materialNm).filter((elem, index, self) => self.indexOf(elem) === index);

}

const fetchProjectData = async (
  token/*: string*/, material_id/*: string*/, output, img_dir) => {
  // input validation
  const token_ref = token.match(/[a-f0-9]{32}/g);
  if (!token_ref) {
    console.error('token must be 32 letters');
    console.error(`your token is ${token}`)
    return;
  }

  if (!fs.existsSync(img_dir)) {
    fs.mkdirSync(img_dir);
  }

  const url = `https://protopedia.net/api/prototypes.json?token=${token}&materialId=${material_id}`
  const res = await axios.get(url);
  // console.debug(res);
  // protopedia APIの変な挙動
  // materialで絞り込むと，materialNmには検索で使ったmaterialの名前しか入っていない．
  // ほんとにデータベースの構造どうなってるんだろ？
  const data = parseResponse(res.data);
  if (!data) {
    return;
  }
  // re-fetch materials
  const tmp = data.map(d => parseProjectData(d));
  const prototypes = await Promise.all(tmp.map(async (p) => {
    return { ...p, materials: await fetchMaterials(token, p.prototype_id) }
  }));
  // dump to json
  const datetime = Date();
  const s = JSON.stringify({ datetime, prototypes });
  fs.writeFileSync(output, s);

  // download feature images
  prototypes.map((p) => {
    const img = p?.images[0];
    const img_path = path.join(img_dir, path.basename(img));
    downloadFile(img, img_path);
  })
}

fetchProjectData(args.api_key, args.material_id, args.output, args.img_dir);

