const baseUrl = 'https://u.gg/lol/champions';
const request = require('axios');
import * as cheerio from 'cheerio';

export async function getImportantInfo(character: string) {
  let url = `${baseUrl}/${character}/build`;
  return new Promise(resolve => {
    request.get(url).then(async (response: any) => {
      const content = await cheerio.load(response.data);
      let perks: Object[] = [];
      let mainPaths: Object[] = [];

      let appHtml = content('#content');
      let avatar: any = appHtml.find(`img.champion-image`);
      let allPaths = appHtml.find(`.primary-perk>img`);
      let allPerks = appHtml.find(`.perk-active>img`);

      allPaths.map(({}, pathImg) => {
        mainPaths.push(pathImg.attribs);
      });

      allPerks.map(({}, perkImg) => {
        perks.push(perkImg.attribs);
      });

      resolve({ perks: perks, paths: mainPaths, avatar: avatar[0].attribs });
    });
  });
}
