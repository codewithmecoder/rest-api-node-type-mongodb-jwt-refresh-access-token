import { CookieOptions, NextFunction, Request, Response } from "express";
import axios from "axios";
import {
  createSession,
  findSession,
  updateSession,
} from "../service/session.service";
import jwt from "jsonwebtoken";
import {
  findAndUpdateUser,
  getGoogleOauthTokens,
  validatePassword,
} from "../service/user.service";
import { signJwt } from "../utils/jwt.utils";
import config from "config";
import log from "../utils/logger";

const accessTokenCookieOptions: CookieOptions = {
  maxAge: 900000, //15 mins
  httpOnly: true,
  domain: "localhost",
  path: "/",
  sameSite: "lax",
  secure: false,
};
const refreshTokenCookieOptions: CookieOptions = {
  ...accessTokenCookieOptions,
  maxAge: 3.154e10, //1 year
};
export async function createUserSessionHandler(req: Request, res: Response) {
  // Validate the user's password
  const _user = await validatePassword(req.body);
  if (!_user) {
    return res.status(401).send("Invalid email or password");
  }
  // create a session
  const session = await createSession(
    _user._id.toString(),
    req.get("user-agent") || ""
  );
  // create an access token
  const accessToken = signJwt(
    {
      ..._user,
      session: session._id,
    },
    {
      expiresIn: config.get("accessTokenTtl"), // 15m
    }
  );
  // create a refresh token

  const refreshToken = signJwt(
    {
      ..._user,
      session: session._id,
    },
    {
      expiresIn: config.get("refreshTokenTtl"), // 1y
    }
  );

  // return access & refresh token
  res.cookie("accessToken", accessToken, accessTokenCookieOptions);
  res.cookie("resfreshToken", refreshToken, refreshTokenCookieOptions);
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

export async function googleOauthHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // get the code from qs
    const code = req.query.code as string;
    //get the id and access token with the code
    const { id_token, access_token } = await getGoogleOauthTokens({ code });

    // get user with token
    const googleUser = await getGoogleUser({ id_token, access_token });
    //jwt.decode(id_token);
    if (!googleUser.verified_email) {
      return res.status(403).send("Google account is not verified");
    }
    // upsert a session
    const _user = await findAndUpdateUser(
      {
        email: googleUser.email,
      },
      {
        email: googleUser.email,
        name: googleUser.name,
        picture: googleUser.picture,
      },
      {
        upsert: true,
        new: true,
      }
    );
    // create a session
    const session = await createSession(
      _user?._id.toString(),
      req.get("user-agent") || ""
    );
    // create an access token
    const accessToken = signJwt(
      {
        ..._user?.toJSON(),
        session: session._id,
      },
      {
        expiresIn: config.get("accessTokenTtl"), // 15m
      }
    );
    // create a refresh token

    const refreshToken = signJwt(
      {
        ..._user?.toJSON(),
        session: session._id,
      },
      {
        expiresIn: config.get("refreshTokenTtl"), // 1y
      }
    );

    // set cookies
    res.cookie("accessToken", accessToken, accessTokenCookieOptions);
    res.cookie("resfreshToken", refreshToken, refreshTokenCookieOptions);
    // redirect
    res.redirect(config.get("origin"));
  } catch (error: any) {
    log.error(error, "Failed");
    return res.redirect(`${config.get("origin")}/oauth/error`);
  }
}

interface GoogleUserResult {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family: string;
  picture: string;
  locale: string;
}

export async function getGoogleUser({
  id_token,
  access_token,
}: {
  id_token: string;
  access_token: string;
}): Promise<GoogleUserResult> {
  try {
    const res = await axios.get<GoogleUserResult>(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
      {
        headers: {
          Authorization: `Bearer ${id_token}`,
        },
      }
    );
    return res.data;
  } catch (error: any) {
    log.error(error, "Error fetching Google user");
    throw new Error(error.message);
  }
}
