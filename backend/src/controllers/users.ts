import { RequestHandler } from "express";
import createHttpError from "http-errors";
import user from "../models/user";
import bcrypt from "bcrypt";

interface SignUpBody {
  username?: string;
  email?: string;
  password?: string;
}

export const singUp: RequestHandler<
  unknown,
  unknown,
  SignUpBody,
  unknown
> = async function (req, res, next) {
  const username = req.body.username;
  const email = req.body.email;
  const passwordRaw = req.body.password;

  try {
    if (!username || !email || !passwordRaw) {
      throw createHttpError(400, "Missing some parameters");
    }

    const existingUsername = await user
      .findOne({
        username: username,
      })
      .exec();

    if (existingUsername) {
      throw createHttpError(409, "Username already taken");
    }

    const existingEmail = await user
      .findOne({
        email: email,
      })
      .exec();

    if (existingEmail) {
      throw createHttpError(409, "this email address already exists");
    }

    const passwordHashed = await bcrypt.hash(passwordRaw, 10);

    const newUser = await user.create({
      username: username,
      email: email,
      password: passwordHashed,
    });
    res.json(newUser);
  } catch (error) {
    next(error);
  }
};
