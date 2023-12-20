import { Router, Request, Response } from "express";
import instance from "../utils/govInstance";
import { isAxiosError } from "axios";
import logger from "../utils/logger";
import { JSONData } from "../models/models";
import { HandleTimeMinutes } from "../utils/helper";
import { stationsCollection } from "../utils/mongodb";

export const router = Router();

router.get("/stop", async (req: Request, res: Response) => {
  //TODO: get all available stops
  return res.json({});
});
router.get("/stop/:stopId", async (req: Request, res: Response) => {
  try {
    const response = await instance.get("", {
      params: { MonitoringRef: req.params.stopId },
    });
    const data: JSONData = response.data;
    const vehicles =
      data.Siri.ServiceDelivery.StopMonitoringDelivery[0].MonitoredStopVisit.map(
        (v) => v.MonitoredVehicleJourney
      );
    return res.json(data);
  } catch (error) {
    if (isAxiosError(error) && error.status) {
      return res.sendStatus(error.status);
    }

    return res.sendStatus(500);
  }
});
router.get("/stop/:stopId/:busId", async (req: Request, res: Response) => {
  const response = await instance.get("", {
    params: { MonitoringRef: req.params.stopId, LineRef: req.params.busId },
  });
  return res.json(response.data);
});
