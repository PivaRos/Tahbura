import { VehicleLocation } from "./gov";

export interface ILineTracking {
  LineRef: string;
  AvgVelocity: number;
  LineName: string;
  StationRef: string;
  DistanceFromStation: number;
  LastFocused: number;
  LastUpdated: number;
  VehicleLocation: VehicleLocation;
  TimesUpdated: number;
}
