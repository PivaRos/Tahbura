import express from "express";
import { router as ApiRouter } from "./routes/api";
import { router as StationRouter } from "./routes/station";
import { PORT, TrackingTimeLimitMin, update_method } from "./utils/constants";

import cron from "node-cron";
import { Siri } from "./models/gov";
import { LiveRouter } from "./routes/live";
import instance from "./utils/govInstance";
import { hasPassedLimit } from "./utils/helper";
import logger from "./utils/logger";
import { UPDATE_METHOD } from "./models/app";
import Route from "./modules/route";

const app = express();

app.use(express.json());

let Tracking = new Map<number, { Siri: Siri; lastChecked: number }>();
cron.schedule("* * * * *", async () => {
  //run live updates
  if (update_method === UPDATE_METHOD.PULLING) {
    logger("running updates");
    if (Tracking.size) {
      await Tracking.forEach(async (item, index) => {
        if (
          !hasPassedLimit(item.lastChecked, Date.now(), TrackingTimeLimitMin)
        ) {
          //update
          logger("updating item", index);
          const response = await instance.get("", {
            params: { MonitoringRef: index },
          });
          Tracking.set(index, {
            Siri: response.data.Siri,
            lastChecked: item.lastChecked,
          });
        } else {
          logger("delete untracked item", index);
          Tracking.delete(index);
        }
      });
    }
  }
});

// cron.schedule("* * * *", async () => {
//   //run cleanup
//   if (update_method === UPDATE_METHOD.HOOK) {
//     Tracking.forEach((trackingItem, index) => {
//       if (hasPassedLimit(trackingItem.lastChecked, Date.now(), 35)) {
//         Tracking.delete(index);
//       }
//     });
//   }
// });

const array = [
  { lat: 32.286416, long: 34.862015 },
  { lat: 32.286265, long: 34.870237 },
  { lat: 32.293004, long: 34.869167 },
  { lat: 32.373656, long: 34.953779 },
];

const route = new Route(array);
console.log(route.getKmLength());
app.use("/api", ApiRouter);
app.use("/station", StationRouter);
app.use("/live", LiveRouter(Tracking));

app.listen(PORT, () => {
  console.log(`app running on port ${PORT}`);
});
