enum SessionStatus {
  None = 'None',
  Running = 'Running',
  Exited = 'Exited',
  Success = 'Success',
  Failed = 'Failed',
  Killed = 'Killed',
  Ended = 'Ended',
}

enum TaskType {
  Continuous,
  Definite,
  DefiniteWithNotifications,
}

export {
  SessionStatus,
  TaskType,
}
