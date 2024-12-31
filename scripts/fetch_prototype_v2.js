// node  --loader ts-node/esm scripts/fetch_prototype.ts
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import yargs from 'yargs';
import { hideBin } from "yargs/helpers";

const args = yargs(hideBin(process.argv))
  .command("* <materialName> <api_key>", "fetch prototype data from ProtoPedia")
  .positional("materialName", {
    describe: "materialName to extract. For example, stack-chan is ｽﾀｯｸﾁｬﾝ. ",
    type: "string",
    demandOption: true,
  })
  .positional("api_key", {
    describe: "bearer token to fetch prototype data",
    type: "string",
    demandOption: true,
  })
  .option("output", {
    alias: "o",
    default: "src/assets/prototypes_v2.json",
    type: "string"
  })
  .option("img_dir", {
    default: "public/prototypes",
    type: "string"
  })
  .parseSync()

const dumpRawPrototypesFromResponseData = (data) => {
  if (!data.results) {
    return;
  }

  if (!data.results.length) {
    return;
  }
  // at v2 api, duplicated ids problem is solved. 

  return data.results; // raw prototypes
}

const dumpPrototypeFromRawData = (rawData /* : PrototypeV2RawData*/) => {
  if (!rawData) {
    return;
  }

  // NOTE: image urls are not in V2 data

  const proto/*: PrototypeV2Data*/ = {
    name: rawData.prototypeNm,
    developingStatus: rawData.status,
    mainImage: rawData.mainUrl, // string(url)
    summary: rawData.summary,
    developers: rawData.users?.split('|'),
    team: rawData.teamNm,
    materials: rawData.materials?.split('|'),
    tags: rawData.tags?.split('|'),
    prototypeId: rawData.id, // number
    updateDate: rawData.updateDate, // string
    createDate: rawData.createDate, // string
    awards: rawData.awards?.split('|'),
    events: rawData.events?.split('|'),// NOTE: who can register these???
    viewCount: rawData.viewCount,
    goodCount: rawData.goodCount,
  }

  // ## Example of API
  // {
  //   "updateDate": "2023-07-25 23:55:19.0",
  //   "releaseFlg": 2,
  //   "systemDescription": "#### 【言語】\r\n* Kotlin\r\n<div style=\"height: 10px;\"><div>\r\n\r\n#### 【使用フレームワーク】\r\n* Spring Boot\r\n* Spring Security \r\n* Thymeleaf \r\n* Spring MVC\r\n* Doma2\r\n<div style=\"height: 10px;\"><div>\r\n\r\n#### 【データベース】\r\n* MariaDB",
  //   "uuid": "79fb28c3-4a4c-4bd4-a490-b72127e9ecf7",
  //   "licenseType": 1,
  //   "updateId": 254,
  //   "teamNm": "つくる、たのしむ、ひろがる人たち",
  //   "videoUrl": "https://www.youtube.com/embed/QarQU6NkTBI",
  //   "goodCount": 33,
  //   "relatedLink": "https://protopedia.gitbook.io/helpcenter/",
  //   "id": 1946,
  //   "prototypeNm": "ProtoPedia 2.5",
  //   "freeComment": "<!-- .slide: data-background=\"#000000\" -->\r\n![ProtoPedia2.0](https://protopedia.net/pic/a4de61db-0005-428f-aa85-6b7810510bc3.png)\r\n\r\n---\r\n\r\n<!-- .slide: data-background=\"#000000\" -->\r\n2018年6月21日に<br>\r\nHacklogからProtoPediaに移行して早２年、<br>\r\nProtoPediaが消えてしまうのではないかと。\r\n\r\n<p>\r\n<img src=\"https://blue-islands.github.io/free-data/protopedia_2_0/news023_14.jpg\" alt=\"ProtoPedia 1.0\" width=\"500\">\r\n</p>\r\n\r\n---\r\n\r\n<!-- .slide: data-background=\"#000000\" -->\r\n自分の作品の記録を消したくない。<br>\r\nそんな想いで、タイムラインで見せる<br>\r\nポートフォリオのサービス「[CHROCO](https://protopedia.net/prototype/1393)」を作った。\r\n\r\n<p>\r\n<img src=\"https://blue-islands.github.io/free-data/protopedia_2_0/chroco.png\" alt=\"CHROCO\" width=\"600\">\r\n</p>\r\n\r\n---\r\n\r\n<!-- .slide: data-background=\"#000000\" -->\r\nだけど、個人賞でもらった<br>\r\n「一緒にProtoPedia作ろうよ」賞<br>\r\n<p>\r\n<img src=\"https://protopedia.net/pic/ca247a5b-597a-4db3-a652-b17925076c35.jpg\" alt=\"一緒にProtoPedia作ろうよ\" width=\"600\">\r\n</p>\r\n\r\n---\r\n\r\n<!-- .slide: data-background=\"#000000\" -->\r\nこの個人賞をきっかけに、<br>\r\nProtoPediaに命を吹き込む作業がはじまった。。。\r\n\r\n---\r\n\r\n\r\n<!-- .slide: data-background=\"#006400\" -->\r\n### ProtoPediaでできること\r\n\r\n1. つくったモノ（コト）を登録（記録）できる\r\n2. ポートフォリオができる\r\n3. 作品にリアクションがもらえる\r\n4. 多様な技術の使い方やアイデアに触れられる\r\n5. ハッカソンやコンテストなどで活用できる\r\n\r\n---\r\n\r\n<!-- .slide: data-background=\"#006400\" -->\r\n### 1. つくったモノ（コト）を登録（記録）できる\r\n\r\n→ 作品を説明する際に利用できる<br>\r\n→ 自分が過去につくった作品と似た作品が将来バズったら◯年前につくったと自慢できる<br>\r\n→ コンテスト応募が楽になる<br>\r\n→ 自分の備忘録として\r\n\r\n---\r\n\r\n<!-- .slide: data-background=\"#006400\" -->\r\n### 2. ポートフォリオができる\r\n\r\n→ 自己紹介で使える（名刺にQRコードを印刷している人も！？）<br>\r\n→ Wantedly、LinkdinなどのビジネスSNSの登録素材として利用\r\n\r\n---\r\n\r\n<!-- .slide: data-background=\"#006400\" -->\r\n### 3. 作品にリアクションがもらえる\r\n\r\n→ 知らない人にもみてもらえるかも？！（コメントやいいねというリアクション機能があります）<br>\r\n→ 同じジャンルに興味を持っている人と繋がれるかも？！\r\n\r\n---\r\n\r\n<!-- .slide: data-background=\"#006400\" -->\r\n### 4. 多様な技術の使い方やアイデアに触れられる\r\n\r\n→ 注目している技術の使い方の勉強になる<br>\r\n→ アイデアの刺激になる\r\n\r\nhttps://protopedia.net/material/\r\n\r\n---\r\n\r\n<!-- .slide: data-background=\"#006400\" -->\r\n### 5. ハッカソンやコンテストなどで活用できる\r\n\r\n→ イベントでつくられた作品を記録に残せます\r\n\r\nhttps://protopedia.net/event/1\r\n\r\n---\r\n\r\n<!--",
  //   "viewCount": 1643,
  //   "officialLink": "https://protopedia.net/",
  //   "events": "ProtoPediaの時間：紹介作品①（第1回〜50回まで）@protopedia-time50|ヒーローズ・リーグ オンライン2020@hl2020",
  //   "createDate": "2020-10-10 14:41:22.0",
  //   "thanksFlg": 1,
  //   "summary": "ProtoPediaは、ITクリエイターが作品を記録・公開し、自己表現を楽しむプラットフォーム。作品が増え、視聴者が増えることで、創作の楽しさが増します。",
  //   "releaseDate": "2020-10-10 14:41:22.0",
  //   "relatedLink3": "",
  //   "relatedLink4": "",
  //   "users": "ばんの@tomoki_banno|ひで@blue_islands|成沢彩音@shirahamaayane|鈴木まなみ@rin2tree",
  //   "tags": "イベント盛り上げたい",
  //   "relatedLink2": "",
  //   "commentCount": 8,
  //   "revision": 0,
  //   "relatedLink5": "",
  //   "materials": "アマゾン ウェブ サービス（AWS）",
  //   "awards": "MA賞 by 一般社団法人MA",
  //   "createId": 254,
  //   "slideMode": 1,
  //   "mainUrl": "https://protopedia.net/pic/a4de61db-0005-428f-aa85-6b7810510bc3.png",
  //   "status": 2
  // }
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
  token/*: string*/, materialName/*: string*/, output, img_dir) => {
  // input validation
  const token_ref = token.match(/[a-f0-9]{32}/g);
  if (!token_ref) {
    console.error('token must be 32 letters');
    console.error(`your token is ${token}`)
    return;
  }

  if (!fs.existsSync(img_dir)) {
    console.info(`making ${img_dir}`)
    fs.mkdirSync(img_dir);
  }

  const url = `https://protopedia.net/v2/api/prototype/list?materialNm=${materialName}`
  const res = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });

  const rawPrototypes = dumpRawPrototypesFromResponseData(res.data);

  // NOTE: v2 api solves poor material fetching

  const prototypes = rawPrototypes.map(obj => dumpPrototypeFromRawData(obj));

  // dump to json
  const datetime = Date();
  const s = JSON.stringify({ datetime, prototypes });
  fs.writeFileSync(output, s);
  console.info(`Prototype data is in ${output}`)
  // download feature images
  prototypes.map((p) => {
    const img = p?.mainImage;
    const img_path = path.join(img_dir, path.basename(img));
    downloadFile(img, img_path);
  })
}

fetchProjectData(args.api_key, args.materialName, args.output, args.img_dir);

