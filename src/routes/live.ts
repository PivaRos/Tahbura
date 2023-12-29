import { Router, Request, Response } from "express";
import instance from "../utils/govInstance";
import { isAxiosError } from "axios";
import { JSONData, Siri } from "../models/gov";
import Queue from "../modules/Queue";
import { update_method } from "../utils/constants";
import { UPDATE_METHOD } from "../models/app";
import { getTracking } from "../utils/helper";

export const LiveRouter = (
  Tracking: Map<number, { Siri: Siri; lastChecked: number }>
) => {
  const router = Router();

  router.get("/:stopId", async (req: Request, res: Response) => {
    try {
      if (update_method === UPDATE_METHOD.PULLING) {
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
      } else {
        const tracking = await getTracking(Tracking, +req.params.stopId);
        return tracking;
      }
    } catch (error) {
      if (isAxiosError(error) && error.status) {
        return res.sendStatus(error.status);
      }

      return res.sendStatus(500);
    }
  });

  return router;
};
