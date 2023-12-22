import { Document, WithId } from "mongodb";
import { IStationInfo } from "../models/station";
import logger from "../utils/logger";
import { stationsCollection } from "../utils/mongodb";

export const GetStationByStationId = async (Id: number) => {
  const station = await stationsCollection.findOne({
    StationId: Id,
  });
  return station;
};

export const GetStationByMongoId = async (Id: string) => {
  const station = await stationsCollection.findOne({
    _id: Id,
  });
  return station;
};

export async function GetClosestStation({
  lat,
  long,
  maxDistanceKm,
  numberOfStations,
}: {
  lat: number;
  long: number;
  maxDistanceKm?: number;
  numberOfStations?: number;
}): Promise<IStationInfo[] | null> {
  if (!maxDistanceKm) maxDistanceKm = 1;
  if (!numberOfStations) numberOfStations = 1;

  try {
    const query: Document = {
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [long, lat],
          },
          $maxDistance: maxDistanceKm * 1000,
        },
      },
    };
    const result: WithId<IStationInfo>[] | null = await stationsCollection
      .find(query)
      .limit(numberOfStations)
      .toArray();
    return result;
  } catch (error) {
    logger("Error:", error);
    return null;
  }
}
