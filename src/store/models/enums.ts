enum SessionStatus {
  None,
  InProgress,
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
