export function logInfo(message: string, metadata?: Record<string, unknown>) {
  console.log(
    JSON.stringify({
      level: "info",
      message,
      ...metadata,
      timestamp: new Date().toISOString()
    })
  );
}

export function logWarn(message: string, metadata?: Record<string, unknown>) {
  console.warn(
    JSON.stringify({
      level: "warn",
      message,
      ...metadata,
      timestamp: new Date().toISOString()
    })
  );
}

export function logError(message: string, metadata?: Record<string, unknown>) {
  console.error(
    JSON.stringify({
      level: "error",
      message,
      ...metadata,
      timestamp: new Date().toISOString()
    })
  );
}
