import winston from 'winston';
import { inspect } from 'util';

const { combine, timestamp, printf, colorize } = winston.format;

const consoleFormat = combine(
     timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
     colorize({ all: true }),
     printf(({ timestamp, level, message, ...meta }) => {
          const formattedMessage = typeof message === 'object'
               ? inspect(message, { colors: true, depth: 3 })
               : message;

          const formattedMeta = Object.keys(meta)
               .filter(key => typeof key !== 'symbol')
               .reduce((obj, key) => {
                    obj[key] = meta[key];
                    return obj;
               }, {} as Record<string, unknown>);

          let log = `${timestamp} [${level}]: ${formattedMessage}`;

          if (Object.keys(formattedMeta).length > 0) {
               log += `\n${inspect(formattedMeta, { colors: true, depth: 3 })}`;
          }

          return log;
     })
);

const logger = winston.createLogger({
     level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
     format: consoleFormat,
     transports: [
          new winston.transports.Console({
               handleExceptions: true,
               handleRejections: true,
          })
     ],
});

export default logger;