# Stack-chan Zoo Page (Template of Maker's Works Page )

This is a template to deploy a page of gallery for works.

## Tabs

Works are fetched from ProtoPedia and split into two groups by `src/App.tsx`:

- **stack-chan works**: works with the `ｽﾀｯｸﾁｬﾝ` material
- **stack-chan related works**: works with the `ｽﾀｯｸﾁｬﾝ` tag but without the `ｽﾀｯｸﾁｬﾝ` material

| Tab | Description |
| --- | --- |
| ProtoPedia Works | Cards of the stack-chan works. Sortable by created order, views, likes and updated date. |
| Stack-chan Tag | Cards of the stack-chan related works. |
| Stats | Yearly trend (line) and material / tag counts (bar). Both groups are drawn in the same chart with different colors. |
| Networks | Network of works linked by shared materials, tags, developers or events. A thicker edge means more shared items. Hover a work or an edge to highlight it. |
| Help | Data source and license. |

## Fetching data

`scripts/fetch_prototype_v2.js` fetches works from ProtoPedia API v2 and writes `src/assets/prototypes_v2.json` and the images in `public/prototypes`.

```console
node scripts/fetch_prototype_v2.js <materialName> <api_key> [--tag <tagName>]
```

- Works with the material `materialName` are fetched.
- Works with the tag (`--tag`, default `ｽﾀｯｸﾁｬﾝ`) are also fetched and merged by id. Use `--tag ""` to skip this.

The GitHub Actions workflow (`.github/workflows/pages.yml`) runs it on deploy, using the `PROTOPEDIA_MATERIAL_NAME` variable, the optional `PROTOPEDIA_TAG_NAME` variable (passed as `--tag`, default `ｽﾀｯｸﾁｬﾝ`) and the `PROTOPEDIA_API_KEY` secret.

## Install

```console
git clone https://github.com/botamochi6277/botalab.git your_page
cd your_page
npm install
```

### dev run

```console
npm run dev
```

### build

```console
npm run build
```

## References

- [ProtoPedia API Ver 2.0](https://protopediav2.docs.apiary.io/#)
