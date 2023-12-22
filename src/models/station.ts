export interface IStationInfo {
  _id: string;
  StationId: number;
  CityCode: number;
  CityName: string;
  MetropolinCode: number;
  MetropolinName: string;
  StationTypeCode: number;
  StationTypeName: string;
  location: { type: "Point"; coordinates: Array<number> };
  Neighborhood: string;
  YishuvSta: string;
}
