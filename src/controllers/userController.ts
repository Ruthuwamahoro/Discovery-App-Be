import express, { Request, Response, NextFunction } from "express";
import passport from "passport";
import { Strategy as LocalStrategy } from 'passport-local';
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User, IUser } from "../models/userModel";

const router = express.Router();

declare global {
  namespace Express {
    interface User extends IUser {}
  }
}


passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (email: string, password: string, done: any) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          return done(null, false, { message: "Invalid email" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return done(null, false, { message: "Invalid password" });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user: IUser, done: any) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done: any) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});


export interface ApiResponse {
  status: number;
  message: string;
  data: any;
}

export const signUpController = async (
  req: Request,
  res: Response<ApiResponse>
): Promise<void> => {
  const { username, email, gender, telephone, password } = req.body;

  if (!username || !email || !gender || !telephone || !password) {
    res.status(400).json({
      status: 400,
      message: "Fields are missing",
      data: null,
    });
    return;
  }

  try {
    const [existingUsername, existingEmail] = await Promise.all([
      User.findOne({ username }),
      User.findOne({ email }),
    ]);

    if (existingUsername) {
      res.status(400).json({
        status: 400,
        message: "Username already exists",
        data: null,
      });
      return;
    }

    if (existingEmail) {
      res.status(400).json({
        status: 400,
        message: "Email already exists",
        data: null,
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      gender,
      telephone,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(200).json({
      status: 200,
      message: "Successfully registered",
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: `An unexpected error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`,
      data: null,
    });
  }
};

export const getUserByIdController = async(req: Request, res: Response)=> {
  try {
      const {id} = req.params;
      const user = await User.findById({id});
      res.status(200).json({
          status: 200,
          message: "user retrieved successfully",
          data: user
      });
  } catch(err) {
      res.status(500).json({
          status: 500,
          message: `An unexpected error occurred: ${err instanceof Error ? err.message : 'Unknown error'}`,
          data: null
      });
  }
}

export const getAllUsers = async(res: Response<ApiResponse>) => {
  try{
    const allUsers = await User.find();

    res.status(200).json({
      status: 200,
      message: "All users retrieved successfully",
      data: allUsers
    })

  } catch(err){
    res.status(500).json({
      status: 500,
      message: `An unexpected error occurred: ${err instanceof Error ? err.message : 'Unknown error'}`,
      data: null
  });
  }
}



export const loginController = async (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    "local",
    { session: false },
    (error: Error | null, user: IUser | false, info: { message: string }) => {
      if (error) return next(error);
      if (!user) {
        return res.status(400).json({
          status: 400,
          message: info.message,
          data: null,
        });
      }

      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET || 'your-fallback-secret',
        {
          expiresIn: "8h",
        }
      );

      return res.status(200).json({
        status: 200,
        message: "Logged in successfully",
        data: token,
      });
    }
  )(req, res, next);
};

export default router;