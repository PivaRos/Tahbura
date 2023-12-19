export interface Root {
  Siri: { ServiceDelivery: ServiceDelivery };
}

export interface ServiceDelivery {
  ResponseTimestamp: string;
  ProducerRef: string;
  ResponseMessageIdentifier: string;
  RequestMessageRef: number;
  Status: boolean;
  StopMonitoringDelivery: StopMonitoringDelivery;
}

export interface StopMonitoringDelivery {
  ResponseTimestamp: string;
  Status: boolean;
  MonitoredStopVisit: MonitoredStopVisit[];
}

export interface MonitoredStopVisit {
  RecordedAtTime: string;
  ItemIdentifier: number;
  MonitoringRef: number;
  MonitoredVehicleJourney: MonitoredVehicleJourney;
}

export interface MonitoredVehicleJourney {
  LineRef: number;
  DirectionRef: number;
  FramedVehicleJourneyRef: FramedVehicleJourneyRef;
  PublishedLineName: any;
  OperatorRef: number;
  DestinationRef: number;
  OriginAimedDepartureTime: string;
  ConfidenceLevel: string;
  VehicleLocation?: VehicleLocation;
  Bearing: number;
  Velocity: number;
  VehicleRef: number;
  MonitoredCall: MonitoredCall;
}

export interface FramedVehicleJourneyRef {
  DataFrameRef: string;
  DatedVehicleJourneyRef: number;
}

export interface VehicleLocation {
  Longitude: number;
  Latitude: number;
}

export interface MonitoredCall {
  StopPointRef: number;
  Order: number;
  ExpectedArrivalTime: string;
  DistanceFromStop: number;
  AimedArrivalTime?: string;
}
