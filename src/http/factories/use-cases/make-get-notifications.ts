import { PrismaNotificationRepository } from '@/data/prisma/notification.repository'
import { GetNotificationsUseCase } from '@/domain/application/use-cases/get-notifications'

export function makeGetNotificationsUseCase() {
  const notificRepo = new PrismaNotificationRepository()
  return new GetNotificationsUseCase(notificRepo)
}
