import { NextFunction, Request, Response } from "express";
import {
  createSession,
  findSession,
  updateSession,
} from "../service/session.service";
import { validatePassword } from "../service/user.service";
import { signJwt } from "../utils/jwt.utils";
import config from "config";

export async function createUserSessionHandler(req: Request, res: Response) {
  // Validate the user's password
  const user = await validatePassword(req.body);
  if (!user) {
    return res.status(401).send("Invalid email or password");
  }
  // create a session
  const session = await createSession(
    user._id.toString(),
    req.get("user-agent") || ""
  );
  // create an access token
  const accessToken = signJwt(
    {
      ...user,
      session: session._id,
    },
    {
      expiresIn: config.get("accessTokenTtl"), // 15m
    }
  );
  // create a refresh token

  const refreshToken = signJwt(
    {
      ...user,
      session: session._id,
    },
    {
      expiresIn: config.get("refreshTokenTtl"), // 1y
    }
  );

  // return access & refresh token
  res.status(200).send({
    accessToken,
    refreshToken,
  });
}

export async function getUserSessionHandler(req: Request, res: Response) {
  const userId = res.locals.user._id;
  const session = await findSession({ user: userId, valid: true });
  return res.send(session);
}

export async function deleteSessionHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const sessionId = res.locals.user.session;
  await updateSession({ _id: sessionId }, { valid: false });
  return res.send({
    accessToken: null,
    refreshToken: null,
  });
}
