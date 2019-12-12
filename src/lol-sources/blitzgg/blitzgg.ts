const url = 'https://app.mobalytics.gg/profile/lan/i%20zirael%20i';
import * as cheerio from 'cheerio';

async function getBlitzGGRawData(url: string) {
	const content = cheerio.load(url);
	return content('#blitz-app');//TODO
}


async function main() {
	const rawData = await getBlitzGGRawData(url);
	console.log(rawData);
}

main();