import { Notification } from '@/domain/entities/notification'
import { INotificationRepository } from '@/domain/interfaces/repositories/notification.repository'
import { prisma } from './client'
import { Notification as NotificationModel } from '@prisma/client'

export class PrismaNotificationRepository implements INotificationRepository {
  private fromDatabaseModelToEntity(model: NotificationModel | null): Notification | null {
    if (!model) return null
    const { id, productId, createdAt, readAt, updatedAt } = model
    return new Notification({
      id,
      productId,
      createdAt,
      readAt: readAt ?? undefined,
      updatedAt: updatedAt ?? undefined,
    })
  }

  async getAll({
    year,
    take,
    skip,
    productId,
    readAt,
  }: {
    month?: number | undefined
    year?: number | undefined
    take: number
    skip: number
    productId?: string | undefined
    readAt?: boolean | undefined
  }): Promise<Notification[]> {
    const readAtCondition = readAt ? { not: null } : undefined
    const createdAt = {
      gte: year ? new Date(year, 0, 1) : undefined,
      lte: year ? new Date(year, 11, 31) : undefined,
    }
    const notificationsModel = await prisma.notification.findMany({
      skip,
      take,
      where: { productId, readAt: readAtCondition, createdAt },
    })

    const notifications: Notification[] = []
    notificationsModel.forEach((n) => {
      const notific = this.fromDatabaseModelToEntity(n)
      notific && notifications.push(notific)
    })

    return notifications
  }

  async create({ id, createdAt, productId, readAt, updatedAt }: Notification): Promise<void> {
    await prisma.notification.create({ data: { id, createdAt, productId, readAt, updatedAt } })
  }

  async get(id: string): Promise<Notification | null> {
    const notificationModel = await prisma.notification.findUnique({ where: { id } })
    return this.fromDatabaseModelToEntity(notificationModel)
  }

  async update({ id, createdAt, productId, readAt, updatedAt }: Notification): Promise<void> {
    await prisma.notification.update({
      where: { id },
      data: { createdAt, productId, readAt, updatedAt },
    })
  }
}
