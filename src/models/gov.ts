export interface MonitoredCall {
  StopPointRef: string;
  Order: string;
  ExpectedArrivalTime: string;
  DistanceFromStop: string;
}

export interface VehicleLocation {
  Longitude: string;
  Latitude: string;
}

interface FramedVehicleJourneyRef {
  DataFrameRef: string;
  DatedVehicleJourneyRef: string;
}

interface MonitoredVehicleJourney {
  LineRef: string;
  DirectionRef: string;
  FramedVehicleJourneyRef: FramedVehicleJourneyRef;
  PublishedLineName: string;
  OperatorRef: string;
  DestinationRef: string;
  OriginAimedDepartureTime: string;
  ConfidenceLevel: string;
  VehicleLocation: VehicleLocation;
  Bearing?: string;
  Velocity?: string;
  VehicleRef: string;
  MonitoredCall: MonitoredCall;
}

interface MonitoredStopVisit {
  "-version": string;
  ResponseTimestamp: string;
  Status: string;
  RecordedAtTime?: string;
  ItemIdentifier?: string;
  MonitoringRef?: string;
  MonitoredVehicleJourney: MonitoredVehicleJourney;
}

interface StopMonitoringDelivery {
  ResponseTimestamp: string;
  Status: string;
  MonitoredStopVisit: MonitoredStopVisit[];
}

export interface ServiceDelivery {
  ResponseTimestamp: string;
  ProducerRef: string;
  ResponseMessageIdentifier: string;
  RequestMessageRef: string;
  Status: string;
  StopMonitoringDelivery: StopMonitoringDelivery[];
}

export interface Siri {
  ServiceDelivery: ServiceDelivery;
}

export interface JSONData {
  Siri: Siri;
}
