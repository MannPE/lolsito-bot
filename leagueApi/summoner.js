const auth = require("./../auth.json");
var https = require("https");
var rlh = require("./requestLimitHelper");
const requestHelper = rlh.RequestHelper.instance;

exports.getSummonerInfoByName = async function(name) {
  let options = {
    hostname: "la1.api.riotgames.com",
    path: encodeURI(`/lol/summoner/v4/summoners/by-name/${name}`),
    method: "GET",
    headers: {
      "X-Riot-Token": auth.riotToken
    }
  };
  console.log("Get Summoner By Name ws called:", options);
  return new Promise(async function(resolve, reject) {
    if (!requestHelper.requestIsAllowed(options)) {
      reject({ apiLimit: "true" });
      return;
    } else {
      https
        .get(options, resp => {
          let data = "";

          // A chunk of data has been recieved.
          resp.on("data", chunk => {
            data += chunk;
          });

          // The whole response has been received. Print out the result.
          resp.on("end", () => {
            let newData = JSON.parse(data);
            resolve(newData);
          });
        })
        .on("error", err => {
          reject();
          console.log("Error: " + err.message);
        });
    }
  });
};

exports.getSummonerInfoById = async function(summonerId) {
  let options = {
    hostname: "la1.api.riotgames.com",
    path: encodeURI(`/lol/summoner/v4/summoners/${summonerId}`),
    method: "GET",
    headers: {
      "X-Riot-Token": auth.riotToken
    }
  };
  console.log("Get Summoner By Name ws called:", options);
  return new Promise(async function(resolve, reject) {
    if (!requestHelper.requestIsAllowed(options)) {
      reject({ apiLimit: "true" });
      return;
    } else {
      https
        .get(options, resp => {
          let data = "";

          resp.on("data", chunk => {
            data += chunk;
          });

          resp.on("end", () => {
            let newData = JSON.parse(data);
            resolve(newData);
          });
        })
        .on("error", err => {
          reject();
          console.log("Error: " + err.message);
        });
    }
  });
};
