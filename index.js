import "dotenv/config";
import mongoose from "mongoose";
import md from "markdown-it";

import express from "express";
import expressSession from "express-session";
import expressSessionStore from "connect-mongo";
import expressCookie from "cookie-parser";
import expressCompression from "compression";

import { formatDistanceToNow, format } from "date-fns";

import { User } from "./src/models/user.js";
import { logger } from "./src/utils/logger.js";

import generalRoutes from "./src/routes/general.js";
import authRoutes from "./src/routes/auth.js";
import postsRoutes from "./src/routes/posts.js";
import stocksRoutes from "./src/routes/stocks.js";
import settingsRoutes from "./src/routes/settings.js";
import adminRoutes from "./src/routes/admin.js";

import { dirname } from 'path';
import { fileURLToPath } from 'url';

const PORT = process.env.PORT || 3000;

global.PROJECT_ROOT = dirname(fileURLToPath(import.meta.url));

logger.info("connecting to MongoDB..");
await mongoose.connect(process.env.DB_URL, {});

const app = express();

app.set("views", "src/views");
app.set("view engine", "ejs");

const sessionStore = expressSessionStore.create({ mongoUrl: process.env.DB_URL });

app.use(expressSession({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore
}));
app.use(expressCookie());
app.use(express.urlencoded({
    extended: false,
    limit: "4mb"
}));
app.use(expressCompression());
app.use(express.static("assets"));

app.locals.formatDistanceToNow = formatDistanceToNow;
app.locals.format = format;
app.locals.md = md({
    html: false,
    breaks: false,
    linkify: true,
    typographer: false,
});

app.use(async (req, res, next) => {
    res.setHeader("X-Powered-By", "GaySexEnterpriseWebFramework");

    if (req.session.isLoggedIn) {
        req.currentUser = await User.findOne({
            _id: req.session.userObjectID
        });
    }

    res.locals.req = req;
    res.locals.res = res;
    res.locals.isLoggedIn = req.session.isLoggedIn;

    if (req.session.isLoggedIn) {
        res.locals.currentUser = req.currentUser;
    } else {
        res.locals.currentUser = null;
    }

    next();
});

app.use(generalRoutes);
app.use(authRoutes);
app.use(adminRoutes);
app.use(stocksRoutes);
app.use(postsRoutes);
app.use(settingsRoutes);

app.get("*", (req, res) => {
    res.status(404);
    res.render("404");
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    if(err) {
        logger.error(err);
        res.status(500);

        res.render("error");
    }
});

app.listen(PORT, (err) => {
    if (err) logger.error(err);
    logger.info(`started bojan social on port ${PORT} :)`);
});



