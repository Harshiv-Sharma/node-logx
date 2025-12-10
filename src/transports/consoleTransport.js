import winston from "winston";

export function consoleTransport() {
  return new winston.transports.Console({

    format: winston.format.combine(
      winston.format.colorize({ all: true }),
      winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),

      // custom printf to format console logs
      winston.format.printf(({ level, message, timestamp, ...meta }) => {
        const { metadata  } = meta ;
        
        // Pretty metadata formatting
        const metaString = metadata && Object.keys(metadata).length ?
          "\n   → " + JSON.stringify(metadata, null, 2) : "" ;

        return `(${timestamp}) ${level}: ${message} ${metaString}`;
      })    
    )  
  });
  }