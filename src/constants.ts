require("dotenv").config();

export const __DEV__ = process.env.__DEV__ ?? undefined;
export const PORT = process.env.PORT ?? "8080";
export const GOV_PULLING_RATE = process.env.GOV_PULLING_RATE
  ? +process.env.GOV_PULLING_RATE
  : 1000;
export const govKey = process.env.GOV_KEY;
export const govUrl = process.env.GOV_URL;

if (!govKey) {
  throw new Error(
    "No gov key found in .env, please make sure you enter the key before you start the app"
  );
}

if (!govUrl) {
  //only accepts traffic from specific ip that was added to the white list
  throw new Error(
    "No gov url found in .env, please make sure you enter the url before you start the app"
  );
}
