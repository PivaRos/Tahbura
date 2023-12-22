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
