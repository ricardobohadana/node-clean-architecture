import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MockProxy, mock } from 'vitest-mock-extended'
import { INotificationRepository } from '@/domain/interfaces/repositories/notification.repository'
import { IProductRepository } from '@/domain/interfaces/repositories/product.repository'
import { IEventDispatcher } from '@/domain/interfaces/events/event-dispatcher'
import { EventDispatcher } from '@/domain/application/dispatcher/event-dispatcher'
import { UpdateStockHandler } from '@/domain/application/handlers/update-stock.handler'
import { DomainEvents } from '@/domain/interfaces/events/domain-events'
import { Product, ProductConstructorProps } from '@/domain/entities/product'
import { faker } from '@faker-js/faker'
import { Transaction, TransactionConstructorProps } from '@/domain/entities/transaction'
import { randomUUID } from 'crypto'
import { TransactionTypeEnum } from '@/domain/entities/enums/transaction-type'
import { TransactionCreatedEvent } from '@/domain/application/events/transaction-created.event'
import { ShouldSendNotificationHandler } from '@/domain/application/handlers/notification.handler'

describe('Transaction Created Event Handlers test', () => {
  let productRepository: MockProxy<IProductRepository>
  let notificationRepository: MockProxy<INotificationRepository>
  let eventDispatcher: IEventDispatcher
  let event: TransactionCreatedEvent
  let sutProductHandler: UpdateStockHandler
  let sutNotificationHandler: ShouldSendNotificationHandler

  let productProps: ProductConstructorProps
  let transactionProps: TransactionConstructorProps

  let product: Product

  beforeEach(() => {
    notificationRepository = mock<INotificationRepository>()
    productRepository = mock<IProductRepository>()
    productRepository.update.mockImplementation(async (data) => {})
    notificationRepository.create.mockImplementation(async (notification) => {})
    eventDispatcher = new EventDispatcher()
    sutProductHandler = new UpdateStockHandler(productRepository)
    sutNotificationHandler = new ShouldSendNotificationHandler(notificationRepository)
    eventDispatcher.register(DomainEvents.TRANSACTION_CREATED_EVENT, sutProductHandler)
    eventDispatcher.register(DomainEvents.TRANSACTION_CREATED_EVENT, sutNotificationHandler)

    productProps = {
      id: randomUUID(),
      name: faker.commerce.productName(),
      price: 99,
      inStockAmount: 100,
      notificationLimit: 20,
      createdAt: faker.date.past(),
      updatedAt: faker.date.past(),
    }

    product = new Product(productProps)

    transactionProps = {
      productId: productProps.id!,
      amount: 90,
      transactionDate: faker.date.past(),
      type: TransactionTypeEnum.SALE,
    }
  })

  it('should process a SALE correctly by updating the stock', async () => {
    const transaction = new Transaction(transactionProps)

    event = new TransactionCreatedEvent({ transaction, product })

    const productRepoSpy = vi.spyOn(productRepository, 'update')

    await eventDispatcher.dispatch(event)

    expect(productRepoSpy).toHaveBeenCalledOnce()
    expect(product.inStockAmount).toEqual(productProps.inStockAmount! - transactionProps.amount)
    expect(product.updatedAt).toBeDefined()
    expect(product.updatedAt).not.toEqual(product.createdAt)
  })

  it('should process a PURCHASE correctly by updating the stock', async () => {
    const transaction = new Transaction({ ...transactionProps, type: TransactionTypeEnum.PURCHASE })

    event = new TransactionCreatedEvent({ transaction, product })

    const productRepoSpy = vi.spyOn(productRepository, 'update')

    await eventDispatcher.dispatch(event)

    expect(productRepoSpy).toHaveBeenCalledOnce()
    expect(product.inStockAmount).toEqual(productProps.inStockAmount! + transactionProps.amount)
    expect(product.updatedAt).toBeDefined()
    expect(product.updatedAt).not.toEqual(product.createdAt)
  })

  it('should process the NotificationEvent by creating a notification', async () => {
    const transaction = new Transaction(transactionProps)

    event = new TransactionCreatedEvent({ transaction, product })

    const notificationRepoSpy = vi.spyOn(notificationRepository, 'create')

    await eventDispatcher.dispatch(event)

    expect(notificationRepoSpy).toHaveBeenCalledOnce()
  })

  it('should process the NotificationEvent by not creating a notification (PURCHASE)', async () => {
    const transaction = new Transaction({ ...transactionProps, type: TransactionTypeEnum.PURCHASE })

    event = new TransactionCreatedEvent({ transaction, product })

    const notificationRepoSpy = vi.spyOn(notificationRepository, 'create')

    await eventDispatcher.dispatch(event)

    expect(notificationRepoSpy).not.toHaveBeenCalled()
  })

  it('should process the NotificationEvent by not creating a notification (did not hit stockLimit)', async () => {
    notificationRepository.create.mockImplementation(async (notification) => {})

    const transaction = new Transaction({ ...transactionProps, amount: 2 })

    event = new TransactionCreatedEvent({ transaction, product })

    const notificationRepoSpy = vi.spyOn(notificationRepository, 'create')

    await eventDispatcher.dispatch(event)

    expect(notificationRepoSpy).not.toHaveBeenCalled()
  })
})
