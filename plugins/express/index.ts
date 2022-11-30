import express, { Express } from "express";
import cors from "cors";

type Opts = {
  port: string | number;
};

export const useServer = ({ port }: Opts) => {
  const app: Express = express();

  // Middlewares
  app.use(express.json());
  app.use(cors());

  return {
    app,
  };
};
