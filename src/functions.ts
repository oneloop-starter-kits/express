import { OneloopClient } from "@oneloop-hq/oneloop-ts";
import { Request, Response } from "express";

export const ScrapeMeterId = "scrape_api_meter";

export const helloWorld = async (req: Request, res: Response) => {
  res.send("Hello World");
};

export const getUsers = async (req: Request, res: Response) => {
  res.send("Get users route is authenticated and working");
};

export const getBillingInfo = async (req: Request, res: Response) => {
  res.send("Get billing info route is authenticated and has proper scopes");
};

export const scrapeWebsite = async (req: Request, res: Response) => {
  res.send("Scrape website route is authenticated and has used some credits");
};

export const getScrapeMeter = async (req: Request, res: Response) => {
  const oneloopClient = new OneloopClient({
    token: process.env.ONELOOP_KEY ?? "",
  });
  const meter = await oneloopClient.getBillingUsage(ScrapeMeterId);
  res.send("Meter: " + meter + " Value: " + JSON.stringify(meter));
};
