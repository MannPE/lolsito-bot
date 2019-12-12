const url = 'https://app.mobalytics.gg/profile/lan';
const matchUrl = 'https://app.mobalytics.gg/post-game/lan';
const request = require('axios');
import * as cheerio from 'cheerio';

export async function getMobalyticsProfile(summonerName: string) {
  let fullUrl = `${url}/${summonerName}`;
  console.log(fullUrl);
  return new Promise(resolve => {
    request.get(url).then((response: any) => {
      const content = cheerio.load(response.data);
      // console.log("content:", content.html());
      let matches: any[] = [];
      let appHtml = content('#app-content')
        .find(`div[data-match-id]`)
        .find('a');
      appHtml.map(({}, matchResult) => {
        matches.push(matchResult);
      });
      resolve(matches.map(x => x.attribs.href).filter((y: string) => y.startsWith('/post-game')));
    });
  });
}

export async function getMobalyticsMatch(url: string, name: string, matchId: string) {
  let fullUrl: string = `${matchUrl}/${name}/${matchId}`;
  console.log(url);
  return new Promise(resolve => {
    request.get(fullUrl).then((response: any) => {
      const content = cheerio.load(response.data);
      // console.log("content:", content.html());
      let appHtml = content('#app-content')
        .find(`div[data-match-id]`)
        .html(); //TODO
      resolve(appHtml);
    });
  });
}
