const auth = require("./../auth.json");
var https = require("https");
var rlh = require("./requestLimitHelper");
const requestHelper = rlh.RequestHelper.instance;

exports.getMatchList = async function(accountId) {
  let options = {
    hostname: "la1.api.riotgames.com",
    path: encodeURI(`/lol/match/v4/matchlists/by-account/${accountId}`),
    method: "GET",
    headers: {
      "X-Riot-Token": auth.riotToken
    }
  };
  return new Promise(function(resolve, reject) {
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

exports.getCurrentGameInfo = async function(summonerId) {
  let options = {
    hostname: "la1.api.riotgames.com",
    path: encodeURI(`/lol/spectator/v4/active-games/by-summoner/${summonerId}`),
    method: "GET",
    headers: {
      "X-Riot-Token": auth.riotToken
    }
  };
  return new Promise(function(resolve, reject) {
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
