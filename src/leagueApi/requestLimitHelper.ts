const pykeLib = require('pyke');
const auth = require('./../auth.json');
import { Pyke } from 'pyke';
import { OutgoingHttpHeaders } from 'http';

module.exports.RequestHelper = class RequestHelper {
  apiLimitTimeFrame = 12000; // 2 minutes in ms
  apiRequestCountLimit = 100; // 100 requests per 2 minutes
  static __instance: RequestHelper;
  pyke: Pyke = new pykeLib.Pyke(auth.riotToken);

  lastRequests: Map<number, OutgoingHttpHeaders> = new Map();

  static get instance() {
    if (!RequestHelper.__instance) {
      RequestHelper.__instance = new RequestHelper();
    }
    return RequestHelper.__instance;
  }

  requestIsAllowed(headers: OutgoingHttpHeaders) {
    let timeStamp = Date.now();
    let recentRequests = this.requestsMadeInLastTimeFrame(timeStamp, this.apiLimitTimeFrame);
    this.removeOldRequests();
    console.log(
      `CurrentRequestCount =  ${Object.keys(this.lastRequests).length}/${this.apiRequestCountLimit}`
    );
    if (Object.keys(recentRequests).length >= this.apiRequestCountLimit - 1) {
      console.log('Reached limit of requests available');
      return false;
    } else {
      this.lastRequests.set(timeStamp, headers);
      return true;
    }
  }

  requestsMadeInLastTimeFrame(timestamp: number, difference: number) {
    let recentRequests = Array.from(this.lastRequests.keys()).filter(
      requestTimestamp => requestTimestamp > timestamp - difference
    );
    return recentRequests;
  }

  removeOldRequests() {
    let olderRequests: number[] = Array.from(this.lastRequests.keys()).filter(
      requestTimestamp => requestTimestamp <= Date.now() - this.apiLimitTimeFrame
    );
    olderRequests.forEach(key => this.lastRequests.delete(key));
  }

  getLeagueClient(): Pyke {
    return this.pyke;
  }
};
