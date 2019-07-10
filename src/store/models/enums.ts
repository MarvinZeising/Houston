enum SessionStatus {
  None,
  Running,
  Exiting,
  Success,
  Error,
  Killed,
  Ended,
}

enum TaskType {
  Continuous,
  Definite,
}

export {
  SessionStatus,
  TaskType,
}
