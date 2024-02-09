import express from "express";
import bcrypt from "bcrypt";
import * as middleware from "../utils/middleware.js";
import { User, getUserByEmail, getUserByUsername } from "../models/user.js";
import mongoose from "mongoose";

const router = express.Router();

router.all("/signup", ...middleware.out, async (req, res, next) => {
  try {
    let error;

    if (req.method == "POST" && process.env.ENABLE_SIGNUPS != "false") {
      let { username, email, password, confirmPassword } = req.body;

      username = username.trim();
      password = password.trim();
      confirmPassword = confirmPassword.trim();

      if (/[\n\r]/.test(username)) error = "invalid username";

      if (!password || password.toLowerCase() == "password")
        error = "a valid password is required";

      if (confirmPassword != password) error = "the passwords must match";

      if (!error) {
        if (!(await getUserByEmail(email))) {
          if (!(await getUserByUsername(username))) {
            if (password.length <= 70) {
              const bcryptHash = await bcrypt.hash(
                password,
                10
              );
              const id = (await User.countDocuments()) + 1;

              try {
                const user = new User({
                  _id: new mongoose.Types.ObjectId(),
                  id,
                  username,
                  displayName: username,
                  email: email,
                  passwordHash: bcryptHash,
                  lastLogin: new Date(),
                });

                await user.save();

                return res.redirect("/login");
              } catch (err) {
                error = Object.values(err.errors)[0].properties.message;
              }
            } else error = "your password is too long! 70 characters maxium";
          } else error = "an account with the same username already exists!";
        } else error = "an account with this email already exists!";
      }
    }

    res.render("signup", {
      error,
      csrfToken: req.csrfToken(),
    });
  } catch (error) {
    next(error);
  }
});

router.all("/login", ...middleware.out, async (req, res, next) => {
    try {
      let error;

      if (req.method == "POST") {
        let { username, password } = req.body;

        username = username.trim();
        password = password.trim();

        if(typeof username != 'string'
            || typeof password != 'string')
            return res.redirect('/login');

        let user = await getUserByUsername(username);

        if (user) {
            if (!user.isBanned) {
                const comparePass = await bcrypt.compare(password, user.passwordHash);
                if (comparePass) {
                    user.lastLogin = new Date();
                    user.lastIP = req.ip;

                    await user.save();

                    req.session.isLoggedIn = true;
                    req.session.userObjectID = user._id.toString();

                    return res.redirect("/home");
                } else error = "wrong username or password";
            } else error = "this account has been banned. touch grass";
        } else error = "wrong username or password";
      }

      res.render("login", {
        error,
        csrfToken: req.csrfToken(),
      });
    } catch (error) {
      next(error);
    }
});

router.get("/logout", ...middleware.userNoBanCheck, async (req, res, next) => {
  try {
    req.session.destroy(() => {
      return res.redirect("/");
    });
  } catch (error) {
      next(error);
  }
});

export default router;
