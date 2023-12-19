import { Router, Request, Response } from "express";
import instance from "../utils/govInstance";

export const router = Router();

router.get("/stop", async (req: Request, res: Response) => {
  //TODO: get all available stops
  return res.json({});
});
router.get("/stop/:stopId", async (req: Request, res: Response) => {
  const response = await instance.get("", {
    params: { MonitoringRef: req.params.stopId },
  });
  return res.json(response.data);
});
router.get("/stop/:stopId/:busId", async (req: Request, res: Response) => {
  const response = await instance.get("", {
    params: { MonitoringRef: req.params.stopId, LineRef: req.params.busId },
  });
  return res.json(response.data);
});
