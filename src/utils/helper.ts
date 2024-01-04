import { Collection, Document, WithId } from "mongodb";
import { IStationInfo } from "../models/station";
import { TrackingTimeLimitMin } from "./constants";
import { Siri } from "../models/gov";
import instance from "./govInstance";

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

export function hasPassedLimit(
  date1: number,
  date2: number,
  timeMin: number
): boolean {
  // Convert the numeric dates to JavaScript Date objects
  const startDate = new Date(date1);
  const endDate = new Date(date2);

  // Calculate the time difference in milliseconds
  //@ts-ignore
  const timeDifference = endDate - startDate;

  // Check if the time difference is greater than or equal to 30 minutes (in milliseconds)
  const thirtyMinutesInMills = timeMin * 1000; // 48 seconds in milliseconds
  return timeDifference >= thirtyMinutesInMills;
}

export const getTracking = async (
  Tracking: Map<number, { Siri: Siri; lastChecked: number }>,
  TrackingRef: number
) => {
  if (Tracking.has(TrackingRef)) {
    const stationTracking = Tracking.get(TrackingRef) as {
      Siri: Siri;
      lastChecked: number;
    };
    if (
      hasPassedLimit(
        stationTracking.lastChecked,
        Date.now(),
        TrackingTimeLimitMin
      )
    ) {
      //update the tracking.
      console.log("updating the object");
      const stationTracking = (
        await instance.get("", { params: { MonitoringRef: TrackingRef } })
      ).data as Siri;
      Tracking.set(TrackingRef, {
        Siri: stationTracking,
        lastChecked: Date.now(),
      });
      return stationTracking;
    } else {
      console.log("returning the existing object");
      return stationTracking.Siri;
    }
  } else {
    console.log("getting first time object");
    const stationTracking = (
      await instance.get("", { params: { MonitoringRef: TrackingRef } })
    ).data as Siri;
    if (stationTracking) {
      Tracking.set(TrackingRef, {
        Siri: stationTracking,
        lastChecked: Date.now(),
      });
      return stationTracking;
    }
    console.log("not found");
    //no matching found
    return;
  }
};

export function getDistanceKm(
  point1: { lat: number; long: number },
  point2: { lat: number; long: number }
) {
  var R = 6371; // km
  var dLat = toRad(point2.lat - point1.lat);
  var dLon = toRad(point2.long - point1.long);
  var lat1 = toRad(point1.lat);
  var lat2 = toRad(point2.lat);

  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d;
}

// Converts numeric degrees to radians
function toRad(Value: number) {
  return (Value * Math.PI) / 180;
}
