import express from "express";
import { router as ApiRouter } from "./routes/api";
import { router as StationRouter } from "./routes/station";
import { PORT } from "./utils/constants";

import cron from "node-cron";
import { Siri } from "./models/gov";
import { LiveRouter } from "./routes/live";
import instance from "./utils/govInstance";
import { hasPassedLimit } from "./utils/helper";
import logger from "./utils/logger";

const app = express();

app.use(express.json());

let Tracking = new Map<number, { Siri: Siri; lastChecked: number }>();
cron.schedule("* * * * *", async () => {
  //run live updates
  logger("running updates");
  if (Tracking.size) {
    await Tracking.forEach(async (item, index) => {
      if (!hasPassedLimit(item.lastChecked, Date.now())) {
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
});

app.use("/api", ApiRouter);
app.use("/station", StationRouter);
app.use("/live", LiveRouter(Tracking));

app.listen(PORT, () => {
  console.log(`app running on port ${PORT}`);
});
