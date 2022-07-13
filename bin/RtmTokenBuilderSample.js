// 导入certificate
const { appCertificate } = require('../.agoraconfig.js');

const RtmTokenBuilder = require('./RtmTokenBuilder').RtmTokenBuilder;
const RtmRole = require('./RtmTokenBuilder').Role;
const Priviledges = require('./AccessToken').priviledges;
const appID  = "d0f75f9c230446a1bff5353aa382b427";

const accountList = [
    'test_123',
    'test_345',
    'test_456',
    'test_789',
];

const expirationTimeInSeconds = 3600 * 24;
const currentTimestamp = Math.floor(Date.now() / 1000)

const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds

for(let index in accountList) {
    const token = RtmTokenBuilder.buildToken(appID, appCertificate, accountList[index], RtmRole, privilegeExpiredTs);

    console.log("Rtm Token: ", {
        account: accountList[index],
        token,
    });
}