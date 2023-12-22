import { __DEV__ } from "./constants";

const logger = (text: string | unknown, ...logArgs: any[]) => {
  if (__DEV__ && text) {
    if (logArgs.length > 0) {
      console.log(text, ...logArgs);
    } else {
      console.log(text);
    }
  }
};

export default logger;
