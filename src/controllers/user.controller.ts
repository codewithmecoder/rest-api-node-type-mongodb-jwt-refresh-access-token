import { Request, Response } from "express";
import { CreateUserInput } from "../schema/user.schema";
import { createUser } from "../service/user.service";
import { omit } from "lodash";
export async function createUserHandler(
  req: Request<{}, {}, CreateUserInput["body"]>,
  res: Response
) {
  try {
    const user = await createUser(req.body);
    return res.status(201).send(omit(user, "password"));
  } catch (e: any) {
    res.status(409).send(e.message);
  }
}
