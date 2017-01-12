const winston = require('winston');
module.exports = logging;

function logging(sails) {
    this.get = get;
    return this;

    /**
      * Gets the logger for the provided name or the default logger
      *
      * @param {string} [name=names.default]
      * @returns the logger
      */
    function get(name = 'defaultLog') {
        let loggerExists = winston.loggers.has(name);
        if (loggerExists) {
            return winston.loggers.get(name);
        }
        winston.loggers.add(name, {
            file: {
                filename: sails.config.logger.filepath + name + '.log',
                json: false,
                timestamp: () => { return new Date().toLocaleString(); },
                maxsize: 5000000, // bytes 5MB files before swap
                maxFiles: 30,
                tailable: true,
                zippedArchive: true, // Zip files after switch
                level: sails.config.logger.level,
                prettyPrint: true
            },
            console: {
                silent: !sails.config.logger.console,
                level: sails.config.logger.level,
                json: false,
                colorize: true,
                timestamp: () => { return new Date().toLocaleString(); },
                prettyPrint: true
            }
        });
        return winston.loggers.get(name);
    }
};



