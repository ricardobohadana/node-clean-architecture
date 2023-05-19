export class NotificationDoesNotExistError extends Error {
  constructor() {
    super('Notification does not exist')
  }
}
