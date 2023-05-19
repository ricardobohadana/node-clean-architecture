import { describe, it, expect, beforeEach, vi } from 'vitest'
import { faker } from '@faker-js/faker/locale/pt_BR'
import { MockProxy, mock } from 'vitest-mock-extended'
import { INotificationRepository } from '@/domain/interfaces/repositories/notification.repository'
import { Notification } from '@/domain/entities/notification'
import { randomUUID } from 'crypto'
import { ReadNotificationUseCase } from '@/domain/application/use-cases/read-notification'
import { NotificationDoesNotExistError } from '@/domain/application/errors/notification-does-not-exist.error'

describe('Read notification use case tests', () => {
  let sutUseCase: ReadNotificationUseCase
  let notificationRepository: MockProxy<INotificationRepository>
  let notification: Notification
  beforeEach(async () => {
    notification = new Notification({
      id: randomUUID(),
      productId: randomUUID(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.past(),
    })
    notificationRepository = mock<INotificationRepository>()
    notificationRepository.update.mockImplementation(async (data) => {})
    notificationRepository.get.mockImplementation(async (id) => {
      return id === notification.id ? notification : null
    })
    sutUseCase = new ReadNotificationUseCase(notificationRepository)
  })

  it('should be able to read a notification', async () => {
    const spy = vi.spyOn(notificationRepository, 'update')
    const useCaseProps = {
      id: notification.id,
    }

    await sutUseCase.execute(useCaseProps)

    expect(spy).toHaveBeenCalledOnce()
    expect(notification.readAt).toBeDefined()
    expect(notification.updatedAt).toBeDefined()
    expect(notification.updatedAt).not.toEqual(notification.createdAt)
  })

  it('should not able to update the product notification limit of unexisting product', async () => {
    const useCaseProps = {
      id: '0',
    }

    expect(async () => await sutUseCase.execute(useCaseProps)).rejects.toBeInstanceOf(
      NotificationDoesNotExistError,
    )
  })
})
