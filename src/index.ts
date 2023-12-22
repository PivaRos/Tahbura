import express from "express";
import { PORT } from "./utils/constants";
import { govPullingInit } from "./utils/gov";
import { router as ApiRouter } from "./routes/api";
import { router as StationRouter } from "./routes/station";
import { router as LiveRouter } from "./routes/live";
import cron from "node-cron";
import Queue from "./modules/Queue";
import { ILineTracking } from "./models/tacking";

const app = express();

app.use(express.json());

const Tracking = new Map<string, ILineTracking>();
const TrackingQueue = new Queue<number>();

cron.schedule("* * * * *", () => {
  //run live updates
  if (!TrackingQueue.isEmpty()) {
    TrackingQueue.queue.forEach((trackingItem) => {
      //TODO:run tracking live location with gov server
      //TODO:update the Tracking information
    });
  }
});

app.use("/api", ApiRouter);
app.use("/station", StationRouter);
app.use("/live", LiveRouter);

app.listen(PORT, () => {
  console.log(`app running on port ${PORT}`);
});
