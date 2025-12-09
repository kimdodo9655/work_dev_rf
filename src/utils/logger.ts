import { ENV } from './env'

type LogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug'

class Logger {
  private write(level: LogLevel, ...args: any[]) {
    if (!ENV.IS_DEV) return

    const timestamp = new Date().toISOString()
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`

    switch (level) {
      case 'error':
        console.error(prefix, ...args)
        break
      case 'warn':
        console.warn(prefix, ...args)
        break
      case 'info':
        console.info(prefix, ...args)
        break
      case 'debug':
        console.debug(prefix, ...args)
        break
      default:
        console.log(prefix, ...args)
    }
  }

  info(...args: any[]) {
    this.write('info', ...args)
  }

  warn(...args: any[]) {
    this.write('warn', ...args)
  }

  error(...args: any[]) {
    this.write('error', ...args)
  }

  debug(...args: any[]) {
    this.write('debug', ...args)
  }

  log(...args: any[]) {
    this.write('log', ...args)
  }
}

export const logger = new Logger()
