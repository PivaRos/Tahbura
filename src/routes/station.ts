import { Router } from "express";
import { stationsCollection } from "../utils/mongodb";
import { findClosestStation } from "../utils/helper";

export const router = Router();

router.get("/:id", async (req, res) => {
  const station = await stationsCollection.findOne({
    StationId: +(req.params.id ?? -1),
  });
  return res.json({
    lat: station?.location.coordinates[1],
    long: station?.location.coordinates[0],
  });
});

router.post("/location", async (req, res) => {
  const station = await findClosestStation(
    +req.body.lat,
    +req.body.long,
    stationsCollection,
    200
  );
  if (!station) return res.sendStatus(500);
  return res.json(station);
});
