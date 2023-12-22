import { MongoClient } from "mongodb";
import { MongodbUrl } from "./constants";
import { IStationInfo } from "../models/station";

const client = new MongoClient(MongodbUrl);

export const db = client.db("Tahbura");
export const stationsCollection = db.collection<IStationInfo>("stations");
