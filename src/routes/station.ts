import { Router } from "express";
import { LocationValidation } from "../utils/validation/LocationValidation";
import { Request, Response } from "express";
import {
  GetClosestStation,
  GetStationByStationId,
} from "../api/StationServices";

export const router = Router();

router.get("/:id", async (req, res) => {
  const station = await GetStationByStationId(+(req.params.id ?? -1));
  return res.json({
    lat: station?.location.coordinates[1],
    long: station?.location.coordinates[0],
  });
});

router.post(
  "/location",
  LocationValidation(),
  async (req: Request, res: Response) => {
    const { lat, long, maxDistanceKm, numberOfStations } = req.body;
    const station = await GetClosestStation({
      lat,
      long,
      maxDistanceKm,
      numberOfStations,
    });

    if (!station) return res.sendStatus(500);
    return res.json(station);
  }
);
