"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnv = void 0;
require("dotenv/config");
const getEnv = () => {
    const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_API_TOKEN, GOOGLE_ACCESS_TOKEN, GOOGLE_REFRESH_TOKEN, GOOGLE_CALENDAR_ID, } = process.env;
    if (!GOOGLE_CLIENT_ID) {
        throw Error('Please set the environment variable GOOGLE_CLIENT_ID.');
    }
    if (!GOOGLE_CLIENT_SECRET) {
        throw Error('Please set the environment variable GOOGLE_CLIENT_SECRET.');
    }
    if (!GOOGLE_API_TOKEN) {
        throw Error('Please set the environment variable GOOGLE_API_TOKEN.');
    }
    if (!GOOGLE_ACCESS_TOKEN) {
        throw Error('Please set the environment variable GOOGLE_ACCESS_TOKEN.');
    }
    if (!GOOGLE_REFRESH_TOKEN) {
        throw Error('Please set the environment variable GOOGLE_REFRESH_TOKEN.');
    }
    if (!GOOGLE_CALENDAR_ID) {
        throw Error('Please set the environment variable GOOGLE_CALENDAR_ID.');
    }
    return {
        googleClientID: GOOGLE_CLIENT_ID,
        googleClientSecret: GOOGLE_CLIENT_SECRET,
        googleApiToken: GOOGLE_API_TOKEN,
        googleAccessToken: GOOGLE_ACCESS_TOKEN,
        googleRefreshToken: GOOGLE_REFRESH_TOKEN,
        googleCalendarID: GOOGLE_CALENDAR_ID,
    };
};
exports.getEnv = getEnv;
