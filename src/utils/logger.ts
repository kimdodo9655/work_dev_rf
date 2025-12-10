import { ENV } from './env'

type LogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug'

interface LogData {
  context?: string
  status?: number
  statusText?: string
  message?: string
  url?: string
  method?: string
  data?: any
  timestamp?: string
  [key: string]: any
}

class Logger {
  /**
   * 한국 시간(KST) 문자열 반환
   */
  private getKSTTime(): string {
    const now = new Date()

    // UTC 시간을 한국 시간(UTC+9)으로 변환
    const kstOffset = 9 * 60 * 60 * 1000 // 9시간을 밀리초로
    const kstTime = new Date(now.getTime() + kstOffset)

    // YYYY-MM-DD HH:mm:ss.SSS 형식으로 포맷
    const year = kstTime.getUTCFullYear()
    const month = String(kstTime.getUTCMonth() + 1).padStart(2, '0')
    const day = String(kstTime.getUTCDate()).padStart(2, '0')
    const hours = String(kstTime.getUTCHours()).padStart(2, '0')
    const minutes = String(kstTime.getUTCMinutes()).padStart(2, '0')
    const seconds = String(kstTime.getUTCSeconds()).padStart(2, '0')
    const milliseconds = String(kstTime.getUTCMilliseconds()).padStart(3, '0')

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`
  }

  private write(level: LogLevel, message: string, data?: LogData) {
    if (!ENV.IS_DEV) return

    const timestamp = this.getKSTTime()
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`

    // 데이터가 있으면 함께 출력
    const logData = data
      ? {
          ...data,
          timestamp: data.timestamp || timestamp
        }
      : undefined

    switch (level) {
      case 'error':
        console.error(prefix, message, logData || '')
        break
      case 'warn':
        console.warn(prefix, message, logData || '')
        break
      case 'info':
        console.info(prefix, message, logData || '')
        break
      case 'debug':
        console.debug(prefix, message, logData || '')
        break
      default:
        console.log(prefix, message, logData || '')
    }
  }

  info(message: string, data?: LogData) {
    this.write('info', message, data)
  }

  warn(message: string, data?: LogData) {
    this.write('warn', message, data)
  }

  error(message: string, data?: LogData) {
    this.write('error', message, data)
  }

  debug(message: string, data?: LogData) {
    this.write('debug', message, data)
  }

  log(message: string, data?: LogData) {
    this.write('log', message, data)
  }
}

export const logger = new Logger()
