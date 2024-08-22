import { OneloopApiClient } from "@oneloop-hq/oneloop-ts";
import dotenv from "dotenv";
import { Request, Response } from "express";

dotenv.config();

const oneloopClient = new OneloopApiClient({
  token: process.env.ONELOOP_KEY ?? "",
});

export const oneloopMiddleware = (
  scopes: {
    id: string;
    read?: boolean;
    create?: boolean;
    update?: boolean;
    del?: boolean;
  }[]
) => {
  return async (req: Request, res: Response, next: () => any) => {
    const isValidKey = await oneloopClient.verifyApiKey({
      key: req.headers.authorization ?? "",
      requestedScopes: scopes.map((scope) => {
        return {
          id: scope.id,
          representation: scope.id,
          read: scope.read ?? false,
          create: scope.create ?? false,
          update: scope.update ?? false,
          del: scope.del ?? false,
        };
      }),
    });

    if (isValidKey) {
      next();
    } else {
      res.status(401).send("Unauthorized");
    }
  };
};
