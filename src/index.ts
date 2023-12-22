import express from "express";
import { PORT } from "./utils/constants";
import { govPullingInit } from "./utils/gov";
import { router as ApiRouter } from "./routes/api";
import { router as StationRouter } from "./routes/station";
import { router as LiveRouter } from "./routes/live";
import cron from "node-cron";
import Queue from "./modules/Queue";
import { ILineTracking } from "./models/tacking";
import instance from "./utils/govInstance";
import { JSONData } from "./models/gov";
import { has30MinutesPassed } from "./utils/helper";

const app = express();

app.use(express.json());

const Tracking = new Map<
  { LineRef: string; StationRef: string },
  ILineTracking
>();
let TrackingQueue = new Queue<{ LineRef: string; StationRef: string }>();

cron.schedule("* * * * *", async () => {
  //run live updates
  const newQueue = new Queue<{ LineRef: string; StationRef: string }>();
  if (!TrackingQueue.isEmpty()) {
    TrackingQueue.queue.forEach(async (trackingItem) => {
      const Line = Tracking.get(trackingItem);
      if (Line) {
        const { data }: { data: JSONData } = await instance.get("", {
          params: {
            MonitoringRef: Line.StationRef,
            LineRef: Line.LineRef,
          },
        });
        const tracking =
          data.Siri.ServiceDelivery.StopMonitoringDelivery[0]
            ?.MonitoredStopVisit[0]?.MonitoredVehicleJourney;
        if (tracking) {
          const newLine: ILineTracking = {
            ...Line,
            DistanceFromStation: +tracking.MonitoredCall.DistanceFromStop,
            AvgVelocity:
              (Line.AvgVelocity * Line.TimesUpdated +
                (tracking.Velocity ? +tracking.Velocity : 0)) /
              (Line.TimesUpdated + 1),
            TimesUpdated: Line.TimesUpdated + 1,
            LastUpdated: Date.now(),
            VehicleLocation: tracking.VehicleLocation,
          };
          Tracking.set(
            { LineRef: tracking.LineRef, StationRef: Line.StationRef },
            newLine
          );
        }
        if (!has30MinutesPassed(Line.LastFocused, Date.now())) {
          newQueue.enqueue({
            LineRef: Line.LineRef,
            StationRef: Line.StationRef,
          });
        }
      } else {
        //get tracking data for this line and save it in map
        const { data }: { data: JSONData } = await instance.get("", {
          params: {
            MonitoringRef: trackingItem.StationRef,
            LineRef: trackingItem.LineRef,
          },
        });
        const StationRef =
          data.Siri.ServiceDelivery.StopMonitoringDelivery[0]
            .MonitoredStopVisit[0].MonitoringRef;
        const vehicleData =
          data.Siri.ServiceDelivery.StopMonitoringDelivery[0]
            .MonitoredStopVisit[0].MonitoredVehicleJourney;
        Tracking.set(
          { LineRef: vehicleData.LineRef, StationRef: StationRef ?? "" },
          {
            AvgVelocity: vehicleData.Velocity ? +vehicleData.Velocity : 0,
            DistanceFromStation: +vehicleData.MonitoredCall.DistanceFromStop,
            LastFocused: Date.now(),
            LastUpdated: Date.now(),
            LineName: vehicleData.PublishedLineName,
            LineRef: vehicleData.LineRef,
            StationRef: StationRef ?? "",
            TimesUpdated: 1,
            VehicleLocation: vehicleData.VehicleLocation,
          }
        );
        newQueue.enqueue({
          LineRef: vehicleData.LineRef,
          StationRef: StationRef ?? "",
        });
      }
    });
    TrackingQueue = newQueue;
  }
});

app.use("/api", ApiRouter);
app.use("/station", StationRouter);
app.use("/live", LiveRouter);

app.listen(PORT, () => {
  console.log(`app running on port ${PORT}`);
});
