import { PrismaNotificationRepository } from '@/data/prisma/notification.repository'
import { ReadNotificationUseCase } from '@/domain/application/use-cases/read-notification'

export function makeReadNotificationUseCase() {
  const notificationRepository = new PrismaNotificationRepository()
  return new ReadNotificationUseCase(notificationRepository)
}
