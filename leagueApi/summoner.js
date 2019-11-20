const auth = require("./../auth.json");
var https = require("https");

exports.getSummonerInfoByName = async function(name) {
  let options = {
    hostname: "la1.api.riotgames.com",
    path: `/lol/summoner/v4/summoners/by-name/${escape(name)}`,
    method: "GET",
    headers: {
      "X-Riot-Token": auth.riotToken
    }
  };
  console.log("Get Summoner By Name ws called:", options);
  return new Promise(async function(resolve, reject) {
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
          console.log("received", newData);
          resolve(newData);
        });
      })
      .on("error", err => {
        reject();
        console.log("Error: " + err.message);
      });
  });
};

exports.getSummonerInfoById = async function(summonerId) {
  let options = {
    hostname: "la1.api.riotgames.com",
    path: `/lol/summoner/v4/summoners/${escape(summonerId)}`,
    method: "GET",
    headers: {
      "X-Riot-Token": auth.riotToken
    }
  };
  console.log("Get Summoner By Name ws called:", options);
  return new Promise(async function(resolve, reject) {
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
          console.log("received", newData);
          resolve(newData);
        });
      })
      .on("error", err => {
        reject();
        console.log("Error: " + err.message);
      });
  });
};
