import express from "express";
import { PORT } from "./constants";
import { govPullingInit } from "./utils/gov";
import { router as ApiRouter } from "./routes/api";

const app = express();
govPullingInit(app);

app.use("/api", ApiRouter);

app.listen(PORT, () => {
  console.log(`app running on port ${PORT}`);
});
