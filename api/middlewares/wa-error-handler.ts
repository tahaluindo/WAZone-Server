import { Boom } from "@hapi/boom";
import { Response, Request } from "express";
import { getWa, setWa } from "../..";

type ErrorHandlerOpts = {
  botId: string;
  error: any;
  req: Request;
  res: Response;
};
export const waErrorHandler = async (opts: ErrorHandlerOpts) => {
  const { botId, error, req, res } = opts;
  const output = (error as Boom)?.output;
  const isPreconditionFailed = output?.statusCode === 428;
  const isRequestTimeout = output?.statusCode === 408;
  // console.log("Output:", output);

  const wa = getWa(botId);

  if (isPreconditionFailed || isRequestTimeout)
    await setWa(botId, wa.sock.opts);

  return res.status(500).json({
    message: error?.message ?? "Unexpected error",
  });
};
