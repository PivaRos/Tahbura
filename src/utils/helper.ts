import { Collection, Document, WithId } from "mongodb";
import { IStationInfo } from "../models/station";
import { TrackingTimeLimitMin } from "./constants";

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

export function hasPassedLimit(date1: number, date2: number): boolean {
  // Convert the numeric dates to JavaScript Date objects
  const startDate = new Date(date1);
  const endDate = new Date(date2);

  // Calculate the time difference in milliseconds
  //@ts-ignore
  const timeDifference = endDate - startDate;

  // Check if the time difference is greater than or equal to 30 minutes (in milliseconds)
  const thirtyMinutesInMills = TrackingTimeLimitMin * 60 * 1000; // 30 minutes in milliseconds
  return timeDifference >= thirtyMinutesInMills;
}
