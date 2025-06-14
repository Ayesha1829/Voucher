const fs = require('fs');
const path = require('path');

class Logger {
  constructor() {
    this.logDir = path.join(__dirname, '../logs');
    this.ensureLogDirectory();
  }

  ensureLogDirectory() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  formatMessage(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const metaString = Object.keys(meta).length > 0 ? ` | ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${metaString}`;
  }

  writeToFile(level, formattedMessage) {
    const date = new Date().toISOString().split('T')[0];
    const logFile = path.join(this.logDir, `${date}.log`);
    
    fs.appendFileSync(logFile, formattedMessage + '\n');
    
    // Also write errors to separate error log
    if (level === 'error') {
      const errorLogFile = path.join(this.logDir, `${date}-error.log`);
      fs.appendFileSync(errorLogFile, formattedMessage + '\n');
    }
  }

  log(level, message, meta = {}) {
    const formattedMessage = this.formatMessage(level, message, meta);
    
    // Console output with colors
    const colors = {
      error: '\x1b[31m',   // Red
      warn: '\x1b[33m',    // Yellow
      info: '\x1b[36m',    // Cyan
      debug: '\x1b[35m',   // Magenta
      reset: '\x1b[0m'     // Reset
    };
    
    const color = colors[level] || colors.reset;
    console.log(`${color}${formattedMessage}${colors.reset}`);
    
    // Write to file in production
    if (process.env.NODE_ENV === 'production') {
      this.writeToFile(level, formattedMessage);
    }
  }

  error(message, meta = {}) {
    this.log('error', message, meta);
  }

  warn(message, meta = {}) {
    this.log('warn', message, meta);
  }

  info(message, meta = {}) {
    this.log('info', message, meta);
  }

  debug(message, meta = {}) {
    if (process.env.NODE_ENV === 'development') {
      this.log('debug', message, meta);
    }
  }

  // HTTP request logging
  request(req, res, responseTime) {
    const message = `${req.method} ${req.originalUrl} - ${res.statusCode} - ${responseTime}ms - ${req.ip}`;
    this.info(message, {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      responseTime,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
  }
}

// Create singleton instance
const logger = new Logger();

module.exports = logger;
