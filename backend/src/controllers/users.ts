import { RequestHandler } from "express";
import session from "express-session";
import createHttpError from "http-errors";
import user from "../models/user";
import bcrypt from "bcrypt";

interface SignUpBody {
  username?: string;
  email?: string;
  password?: string;
}

export const getAuth: RequestHandler = async function (
  req,
  res,
  next
) {
  try {
    const authUser = req.session.userId;

    if (!authUser) {
      throw createHttpError(401, "user not auth'ed");
    }

    const userAuth = await user
      .findById(authUser)
      .select("+email")
      .exec();
    res.status(200).json(userAuth);
  } catch (error) {
    next(error);
  }
};

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

    req.session.userId = newUser._id;

    res.json(newUser);
  } catch (error) {
    next(error);
  }
};

interface LoginBody {
  username?: string;
  password?: string;
}

export const login: RequestHandler<
  unknown,
  unknown,
  LoginBody,
  unknown
> = async function (req, res, next) {
  const username = req.body.username;
  const password = req.body.password;

  try {
    if (!username || !password) {
      throw createHttpError(400, "invalid parameters");
    }

    const existingUser = await user
      .findOne({ username: username })
      .select("+password +email")
      .exec();

    if (!existingUser) {
      throw createHttpError(401, "Invalid credentials");
    }

    const passwordMatch = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!passwordMatch) {
      throw createHttpError(401, "bad password");
    }

    req.session.userId = existingUser._id;
    res.status(201).json(existingUser);
  } catch (error) {
    next(error);
  }
};

export const logout: RequestHandler = function (req, res, next) {
  try {
    req.session.destroy((error) => {
      if (error) {
        next(error);
      }
      res.sendStatus(200);
    });
  } catch (error) {
    next(error);
  }
};
