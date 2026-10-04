import {
    XrayApiClient,
} from "./api/xray-api.client.js";

import {
    XrayTrafficService,
} from "./xray-traffic.service.js";


const xrayApiClient =
    new XrayApiClient();


const trafficService =
    new XrayTrafficService(
        xrayApiClient,
    );


const snapshot =
    await trafficService.getSnapshot();


console.log(
    JSON.stringify(
        snapshot,
        null,
        2,
    ),
);