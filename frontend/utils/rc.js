import SDK from "ringcentral";

var sdk = new SDK({
    server: SDK.server.production + ':443', //FIXME Port???
    appKey: 'htPeaGLLSsy4ssTPpjCdtg',
    appSecret: 'Bqty5oVsT621yWpLcWatCwfSZB9NOsTwCZynfsZHoSOg'
});

var platform = sdk.platform();

// Exports

export {platform, sdk};