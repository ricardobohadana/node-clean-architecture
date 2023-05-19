import { INotificationRepository } from '@/domain/interfaces/repositories/notification.repository'
import { NotificationDoesNotExistError } from '../errors/notification-does-not-exist.error'

interface ReadNotificationUseCaseProps {
  id: string
}

export class ReadNotificationUseCase {
  constructor(private readonly notificationRepository: INotificationRepository) {}

  async execute({ id }: ReadNotificationUseCaseProps) {
    const notification = await this.notificationRepository.get(id)

    if (!notification) throw new NotificationDoesNotExistError()

    if (!notification.readAt) {
      notification.read()
    }
  }
}
