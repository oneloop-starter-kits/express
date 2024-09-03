import express, { Express } from "express";
import {
  getBillingInfo,
  getScrapeMeter,
  getUsers,
  helloWorld,
  ScrapeMeterId,
  scrapeWebsite,
} from "./functions";
import { oneloopMiddleware } from "./middleware";

const app: Express = express();
const port = process.env.PORT || 3000;

app.get("/", helloWorld);

app.get("/users", oneloopMiddleware(), getUsers);

app.get(
  "/billing",
  oneloopMiddleware({ scopes: [{ id: "billing", read: true }] }),
  getBillingInfo
);

app.get(
  "/scrape",
  oneloopMiddleware({ usage: { value: 1, id: ScrapeMeterId } }),
  scrapeWebsite
);

app.get("/scrape-meter", oneloopMiddleware(), getScrapeMeter);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
