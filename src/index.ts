import express from "express";
import { PORT } from "./constants";
import { govPullingInit } from "./utils/gov";
import { router as ApiRouter } from "./routes/api";
import { router as StationRouter } from "./routes/station";
import { router as LiveRouter } from "./routes/live";

const app = express();

app.use(express.json());

govPullingInit(app);
app.use("/api", ApiRouter);
app.use("/station", StationRouter);
app.use("/live", LiveRouter);

app.listen(PORT, () => {
  console.log(`app running on port ${PORT}`);
});
