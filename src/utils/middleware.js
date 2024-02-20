import { csrfSync } from "csrf-sync";
import { getAUserFriendRequests } from "../models/friend.js";

const { csrfSynchronisedProtection } = csrfSync({
  getTokenFromRequest: (req) => {
    return req.body["CSRFToken"];
  },
});

const banCheck = (req, res, next) => {
  if (req.currentUser.isBanned) {
    return res.redirect("/logout");
  }

  next();
};

const loggedOut = (req, res, next) => {
  if (req.session.isLoggedIn) {
    return res.redirect("/home");
  }

  next();
};

const admin = (req, res, next) => {
  if (!req.currentUser.isAdmin) {
    return res.redirect("/");
  }

  next();
};

const loggedIn = async (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect("/login");
  }

  req.pendingFriendRequests = await getAUserFriendRequests(req.session.userObjectID);

  next();
};

export const api = [];
export const any = [csrfSynchronisedProtection];
export const out = [csrfSynchronisedProtection, loggedOut];
export const userNoBanCheck = [csrfSynchronisedProtection, loggedIn];
export const userNoCSRF = [loggedIn, banCheck];
export const user = [csrfSynchronisedProtection, loggedIn, banCheck];
export const adminOnly = [csrfSynchronisedProtection, loggedIn, banCheck, admin];
