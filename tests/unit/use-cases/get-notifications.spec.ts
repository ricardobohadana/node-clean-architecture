import { describe, it, expect, beforeEach } from 'vitest'
import { faker } from '@faker-js/faker/locale/pt_BR'
import { MockProxy, mock } from 'vitest-mock-extended'
import { randomUUID } from 'crypto'
import { GetTransactionHistoryUseCase } from '@/domain/application/use-cases/get-transaction-history'
import { Notification } from '@/domain/entities/notification'
import { TransactionTypeEnum } from '@/domain/entities/enums/transaction-type'
import { GetNotificationsUseCase } from '@/domain/application/use-cases/get-notifications'
import { INotificationRepository } from '@/domain/interfaces/repositories/notification.repository'

describe('Get notifications use case tests', () => {
  let sutUseCase: GetNotificationsUseCase
  let notificationsRepository: MockProxy<INotificationRepository>

  beforeEach(async () => {
    notificationsRepository = mock<INotificationRepository>()
    notificationsRepository.getAll.mockImplementation(
      async ({ productId, month, year, skip, take, readAt }) => {
        const notifications: Notification[] = []
        for (let index = skip; index < take; index++) {
          notifications.push(
            new Notification({
              productId: productId ?? randomUUID(),
              readAt: [undefined, faker.date.past()][faker.number.int({ min: 0, max: 1 })],
            }),
          )
        }
        return notifications.filter(
          (n) =>
            n.productId !== '0' &&
            (readAt === undefined
              ? true
              : readAt
              ? n.readAt !== undefined
              : n.readAt === undefined),
        )
      },
    )
    sutUseCase = new GetNotificationsUseCase(notificationsRepository)
  })

  it('should be able to get all notifications', async () => {
    const response = await sutUseCase.execute({})

    expect(response).toBeDefined()
    expect(response).toHaveProperty('notifications')
    expect(response.notifications).toHaveLength(10)
  })

  it('should be able to get all NOT READ notifications', async () => {
    const useCaseProps = {
      readAt: false,
    }
    const response = await sutUseCase.execute(useCaseProps)

    expect(response).toBeDefined()
    expect(response).toHaveProperty('notifications')
    expect(response.notifications.every((n) => !n.readAt)).toBeTruthy()
  })

  it('should be able to get all NOT READ notifications for a given productId', async () => {
    const useCaseProps = {
      productId: randomUUID(),
      readAt: false,
    }
    const response = await sutUseCase.execute(useCaseProps)

    expect(response).toBeDefined()
    expect(response).toHaveProperty('notifications')
    expect(response.notifications.every((n) => !n.readAt)).toBeTruthy()
    expect(response.notifications.every((t) => t.productId === useCaseProps.productId)).toBeTruthy()
  })

  it('should be able to get transaction history by productId with pagination', async () => {
    const useCaseProps = {
      skip: 5,
      take: 22,
    }

    const response = await sutUseCase.execute(useCaseProps)

    expect(response).toBeDefined()
    expect(response).toHaveProperty('notifications')
    expect(response.notifications).toHaveLength(useCaseProps.take - useCaseProps.skip)
  })

  it('should be able to get an empty array as transaction history for an unexisting product', async () => {
    const useCaseProps = {
      productId: '0',
    }

    const response = await sutUseCase.execute(useCaseProps)

    expect(response).toBeDefined()
    expect(response).toHaveProperty('notifications')
    expect(response.notifications).toHaveLength(0)
  })
})
