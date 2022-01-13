import { NextFunction, Request, Response } from "express";
import { get } from "lodash";
import { reIssueAccessToken } from "../service/session.service";
import { verifyJwt } from "../utils/jwt.utils";
export const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken =
    get(req, "cookies.accessToken") ||
    get(req, "headers.authorization", "").replace(/^Bearer\s/, "");
  const refreshToken =
    get(req, "cookies.resfreshToken") || get(req, "headers.x-refresh");

  if (accessToken) {
    const { decoded, expired } = verifyJwt(accessToken);
    if (expired && decoded) {
      res.locals.user = decoded;
      return next();
    }
  }

  const { expired } = verifyJwt(refreshToken);
  if (!expired && refreshToken) {
    const newAccessToken = await reIssueAccessToken({ refreshToken });

    if (newAccessToken) {
      res.setHeader("x-access-token", newAccessToken);
      res.cookie("accessToken", newAccessToken, {
        maxAge: 900000, //15 mins
        httpOnly: true,
        domain: "localhost",
        path: "/",
        sameSite: "strict",
        secure: false,
      });
    }
    const result = verifyJwt(newAccessToken as string);
    res.locals.user = result.decoded;
  }

  return next();
};
