import { OneloopClient } from "@oneloop-hq/oneloop-ts";
import dotenv from "dotenv";
import { Request, Response } from "express";

dotenv.config();

const oneloopClient = new OneloopClient({
  token: process.env.ONELOOP_KEY ?? "",
});

export const oneloopMiddleware = (config?: {
  scopes?: {
    id: string;
    read?: boolean;
    create?: boolean;
    update?: boolean;
    del?: boolean;
  }[];
  usage?: {
    id?: string;
    value: number;
  };
}) => {
  return async (req: Request, res: Response, next: () => any) => {
    try {
      let originalPattern = req.route?.path as string | undefined;
      console.log("originalPattern", originalPattern);
      if (!originalPattern) {
        originalPattern = req.app._router.stack.find((layer: any) => {
          if (layer.route) {
            return layer.route.path === req.path;
          }
          return false;
        })?.route?.path;
      }

      const isValidKey = await oneloopClient.verifyApiKey({
        key: req.headers.authorization?.replace("Bearer ", "") ?? "",
        requestedScopes:
          config?.scopes?.map((scope) => {
            return {
              id: scope.id,
              representation: scope.id,
              read: scope.read ?? false,
              create: scope.create ?? false,
              update: scope.update ?? false,
              del: scope.del ?? false,
            };
          }) ?? [],
        billing: config?.usage
          ? {
              usage: config.usage.value,
              useCustomerIdForBilling: config.usage.id ? false : true,
              id: config.usage.id,
            }
          : undefined,
        route: originalPattern,
      });

      if (isValidKey && isValidKey.status === "VALID") {
        next();
      } else {
        res.status(401).send(`Unauthorized: ${isValidKey.status}`);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send(`Internal server error: ${error}`);
    }
  };
};
