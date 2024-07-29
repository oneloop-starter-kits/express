import express, { Express } from "express";
import { getUsers } from "./functions";
import { oneloopMiddleware } from "./middleware";

const app: Express = express();
const port = process.env.PORT || 3000;

app.get(
  "/",
  oneloopMiddleware([
    {
      id: "users",
      read: true,
    },
  ]),
  getUsers
);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
