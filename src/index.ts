import express from "express";
import { PORT } from "./constants";
import { govPullingInit } from "./utils/gov";
import { router as ApiRouter } from "./routes/api";
import { router as StationRouter } from "./routes/station";

const app = express();

app.use(express.json());

govPullingInit(app);
app.use("/api", ApiRouter);
app.use("/station", StationRouter);

app.listen(PORT, () => {
  console.log(`app running on port ${PORT}`);
});
