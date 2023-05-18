import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MockProxy, mock } from 'vitest-mock-extended'
import { INotificationRepository } from '@/domain/interfaces/repositories/notification.repository'
import { IProductRepository } from '@/domain/interfaces/repositories/product.repository'
import { IEventDispatcher } from '@/domain/interfaces/events/event-dispatcher'
import { EventDispatcher } from '@/events/event-dispatcher'
import { TransactionCreatedProductEventHandler } from '@/events/handlers/transaction-created-event/product.handler'
import { DomainEvents } from '@/domain/interfaces/events/domain-events'
import { Product, ProductConstructorProps } from '@/domain/entities/product'
import { faker } from '@faker-js/faker'
import { Transaction, TransactionConstructorProps } from '@/domain/entities/transaction'
import { randomUUID } from 'crypto'
import { TransactionTypeEnum } from '@/domain/enums/transaction-type'
import { TransactionCreatedEvent } from '@/domain/events/transaction-created.event'
import { TransactionCreatedNotificationEventHandler } from '@/events/handlers/transaction-created-event/notification.handler'

describe('Transaction Created Event Handlers test', () => {
  let productRepository: MockProxy<IProductRepository>
  let notificationRepository: MockProxy<INotificationRepository>
  let eventDispatcher: IEventDispatcher
  let event: TransactionCreatedEvent
  let sutProductHandler: TransactionCreatedProductEventHandler
  let sutNotificationHandler: TransactionCreatedNotificationEventHandler

  let productProps: ProductConstructorProps
  let transactionProps: TransactionConstructorProps

  beforeEach(() => {
    notificationRepository = mock<INotificationRepository>()
    productRepository = mock<IProductRepository>()
    eventDispatcher = new EventDispatcher()
    sutProductHandler = new TransactionCreatedProductEventHandler(productRepository)
    sutNotificationHandler = new TransactionCreatedNotificationEventHandler(notificationRepository)
    eventDispatcher.register(DomainEvents.TRANSACTION_CREATED_EVENT, sutProductHandler)
    eventDispatcher.register(DomainEvents.TRANSACTION_CREATED_EVENT, sutNotificationHandler)

    productProps = {
      id: randomUUID(),
      name: faker.commerce.productName(),
      price: 99,
      inStockAmount: 100,
      notificationLimit: 20,
    }

    transactionProps = {
      productId: productProps.id!,
      amount: 90,
      transactionDate: faker.date.past(),
      type: TransactionTypeEnum.SALE,
    }
  })

  it('should process a SALE correctly by updating the stock', async () => {
    productRepository.updateStock.mockImplementation(async (data) => {
      product.inStockAmount = data.inStockAmount
    })

    const product = new Product(productProps)
    const transaction = new Transaction(transactionProps)

    event = new TransactionCreatedEvent({ transaction, product })

    const productRepoSpy = vi.spyOn(productRepository, 'updateStock')

    await eventDispatcher.dispatch(event)

    expect(productRepoSpy).toHaveBeenCalledOnce()
    expect(product.inStockAmount).toEqual(productProps.inStockAmount! - transactionProps.amount)
  })

  it('should process a PURCHASE correctly by updating the stock', async () => {
    productRepository.updateStock.mockImplementation(async (data) => {
      product.inStockAmount = data.inStockAmount
    })

    const product = new Product(productProps)
    const transaction = new Transaction({ ...transactionProps, type: TransactionTypeEnum.PURCHASE })

    event = new TransactionCreatedEvent({ transaction, product })

    const productRepoSpy = vi.spyOn(productRepository, 'updateStock')

    await eventDispatcher.dispatch(event)

    expect(productRepoSpy).toHaveBeenCalledOnce()
    expect(product.inStockAmount).toEqual(productProps.inStockAmount! + transactionProps.amount)
  })

  it('should process the NotificationEvent by creating a notification', async () => {
    productRepository.updateStock.mockImplementation(async (data) => {})
    notificationRepository.create.mockImplementation(async (notification) => {})

    const product = new Product(productProps)
    const transaction = new Transaction(transactionProps)

    event = new TransactionCreatedEvent({ transaction, product })

    const notificationRepoSpy = vi.spyOn(notificationRepository, 'create')

    await eventDispatcher.dispatch(event)

    expect(notificationRepoSpy).toHaveBeenCalledOnce()
  })

  it('should process the NotificationEvent by not creating a notification (PURCHASE)', async () => {
    productRepository.updateStock.mockImplementation(async (data) => {})
    notificationRepository.create.mockImplementation(async (notification) => {})

    const product = new Product(productProps)
    const transaction = new Transaction({ ...transactionProps, type: TransactionTypeEnum.PURCHASE })

    event = new TransactionCreatedEvent({ transaction, product })

    const notificationRepoSpy = vi.spyOn(notificationRepository, 'create')

    await eventDispatcher.dispatch(event)

    expect(notificationRepoSpy).not.toHaveBeenCalled()
  })

  it('should process the NotificationEvent by not creating a notification (did not hit stockLimit)', async () => {
    productRepository.updateStock.mockImplementation(async (data) => {})
    notificationRepository.create.mockImplementation(async (notification) => {})

    const product = new Product(productProps)
    const transaction = new Transaction({ ...transactionProps, amount: 2 })

    event = new TransactionCreatedEvent({ transaction, product })

    const notificationRepoSpy = vi.spyOn(notificationRepository, 'create')

    await eventDispatcher.dispatch(event)

    expect(notificationRepoSpy).not.toHaveBeenCalled()
  })
})
