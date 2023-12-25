import { Router, Request, Response } from "express";
import instance from "../utils/govInstance";
import { isAxiosError } from "axios";
import { JSONData, Siri } from "../models/gov";
import Queue from "../modules/Queue";

export const LiveRouter = (
  Tracking: Map<number, { Siri: Siri; lastChecked: number }>
) => {
  const router = Router();

  router.get("/:stopId", async (req: Request, res: Response) => {
    try {
      if (Tracking.has(+req.params.stopId)) {
        const result = Tracking.get(+req.params.stopId);
        if (!result) throw "no result for get";
        Tracking.set(+req.params.stopId, {
          Siri: result.Siri,
          lastChecked: Date.now(),
        });
        return res.json(result);
      } else {
        const response = await instance.get("", {
          params: { MonitoringRef: req.params.stopId },
        });
        const data: JSONData = response.data;
        Tracking.set(+req.params.stopId, {
          Siri: data.Siri,
          lastChecked: Date.now(),
        });
        return res.json(data);
      }
    } catch (error) {
      if (isAxiosError(error) && error.status) {
        return res.sendStatus(error.status);
      }

      return res.sendStatus(500);
    }
  });

  router.get("/:stopId/:busId", async (req: Request, res: Response) => {
    try {
      if (Tracking.has(+req.params.stopId)) {
        const siriObject = Tracking.get(+req.params.stopId);
        if (!siriObject) throw "siriObject is undefined";
        Tracking.set(+req.params.stopId, {
          lastChecked: Date.now(),
          Siri: siriObject.Siri,
        });
        const result =
          siriObject?.Siri?.ServiceDelivery.StopMonitoringDelivery[0].MonitoredStopVisit.find(
            (object) =>
              object.MonitoredVehicleJourney.LineRef === req.params.busId
          );
        return res.json(result);
      } else {
        const response = await instance.get("", {
          params: { MonitoringRef: req.params.stopId },
        });
        const data: JSONData = response.data;
        Tracking.set(+req.params.stopId, {
          Siri: data.Siri,
          lastChecked: Date.now(),
        });
        console.log(
          data.Siri.ServiceDelivery.StopMonitoringDelivery[0].MonitoredStopVisit
        );
        const result =
          data.Siri.ServiceDelivery.StopMonitoringDelivery[0].MonitoredStopVisit.find(
            (v) => v.MonitoredVehicleJourney.LineRef === req.params.busId
          );
        return res.json(result);
      }
    } catch {
      return res.sendStatus(500);
    }
  });

  return router;
};
