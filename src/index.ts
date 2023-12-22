import express from "express";
import { PORT } from "./utils/constants";
import { govPullingInit } from "./utils/gov";
import { router as ApiRouter } from "./routes/api";
import { router as StationRouter } from "./routes/station";
import { router as LiveRouter } from "./routes/live";
import cron from "node-cron";

const app = express();

app.use(express.json());

cron.schedule("* * * * *", () => {
  //run live updates
});

app.use("/api", ApiRouter);
app.use("/station", StationRouter);
app.use("/live", LiveRouter);

app.listen(PORT, () => {
  console.log(`app running on port ${PORT}`);
});
