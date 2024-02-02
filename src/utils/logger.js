import winston from "winston";

const logger = winston.createLogger({
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
  },
  transports: [
    new winston.transports.Console({
      format: winston.format.colorize({ all: true }),
      stderrLevels: ["error", "warn"],
    }),
    new winston.transports.File({ filename: 'logs/main.log' }),
  ],
  format: winston.format.combine(
    winston.format.timestamp({ format: "DD-MM-YYYY HH:mm:ss" }),
    winston.format.printf((info) => {
      const { timestamp, level, message, ...args } = info;

      return `[${timestamp}]: [${level.toUpperCase()}] - ${message} ${
        Object.keys(args).length ? JSON.stringify(args, null, 2) : ""
      }`;
    })
  ),
});

winston.addColors({
  info: "green",
  main: "gray",
  debug: "magenta",
  warn: "yellow",
  error: "red",
});

export { logger };