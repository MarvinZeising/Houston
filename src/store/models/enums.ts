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
  Continuous = 'continuous',
  Definite = 'definite',
  DefiniteWithNotifications = 'definiteWithNotifications',
}

export {
  SessionStatus,
  TaskType,
}
