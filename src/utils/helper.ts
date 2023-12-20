import { Collection, Document, WithId } from "mongodb";
import { IStationInfo } from "../models/station";

//return time in minutes
export const HandleTimeMinutes = (
  distanceMeters: string,
  speedKmh: undefined | string
): number => {
  const distanceNumberKm = (distanceMeters ? +distanceMeters : 0) / 1000;
  const speedNumber = speedKmh ? +speedKmh : 0;
  if (speedKmh) {
    return Math.round((distanceNumberKm / speedNumber) * 60);
  } else {
    return -1;
  }
};

export async function findClosestStation(
  lat: number,
  long: number,
  collection: Collection<IStationInfo>,
  maxDistanceKm: number = 2
): Promise<IStationInfo | null> {
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

    const result: WithId<IStationInfo> | null = await collection.findOne(query);

    return result;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}
