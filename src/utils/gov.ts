import { GOV_PULLING_RATE } from "./constants";
import logger from "./logger";

export const govPullingInit = (app: Express.Application) => {
  let pullingInterval;
  try {
    pullingInterval = setInterval(() => {}, GOV_PULLING_RATE);
  } catch (error) {
    logger(error);
    clearInterval(pullingInterval);
  }
};
