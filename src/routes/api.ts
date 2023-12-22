import { Router, Request, Response } from "express";
import instance from "../utils/govInstance";
import { isAxiosError } from "axios";
import logger from "../utils/logger";
import { JSONData } from "../models/gov";
import { HandleTimeMinutes } from "../utils/helper";
import { stationsCollection } from "../utils/mongodb";

export const router = Router();
