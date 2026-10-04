import {
    XrayApiClient,
} from "./xray-api.client.js";

const client =
    new XrayApiClient();

const stats =
    await client.queryStats("");

console.log(
    JSON.stringify(
        stats,
        null,
        2,
    ),
);