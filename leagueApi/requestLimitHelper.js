module.exports.RequestHelper = class RequestHelper {
  apiLimitTimeFrame = 12000; // 2 minutes in ms
  apiRequestCountLimit = 100; // 100 requests per 2 minutes
  static __instance;
  lastRequests = {};

  static get instance() {
    if (!RequestHelper.__instance) {
      RequestHelper.__instance = new RequestHelper();
    }
    return RequestHelper.__instance;
  }

  requestIsAllowed(headers) {
    let timeStamp = Date.now();
    let recentRequests = this.requestsMadeInLastTimeFrame(
      timeStamp,
      this.apiLimitTimeFrame
    );
    console.log(
      `CurrentRequestCount =  ${Object.keys(this.lastRequests).length}/${
        this.apiRequestCountLimit
      }`
    );
    if (Object.keys(recentRequests).length >= this.apiRequestCountLimit - 1) {
      console.log("Reached limit of requests available");
      removeOldRequests();
      return false;
    } else {
      this.lastRequests[timeStamp] = headers;
      return true;
    }
  }

  requestsMadeInLastTimeFrame(timestamp, difference) {
    let recentRequests = Object.keys(this.lastRequests).filter(
      requestTimestamp => requestTimestamp > timestamp - difference
    );
    return recentRequests;
  }

  removeOldRequests() {
    let olderRequests = Object.keys(this.lastRequests).filter(
      requestTimestamp =>
        requestTimestamp <= Date.now() - this.apiLimitTimeFrame
    );
    olderRequests.forEach(key => delete this.lastRequests[key]);
  }
};
