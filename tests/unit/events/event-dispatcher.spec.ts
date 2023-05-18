import { beforeEach, describe, expect, it, vi } from 'vitest'
import { EventDispatcher } from '../../../src/events/event-dispatcher'
import { IProductRepository } from '../../../src/domain/interfaces/repositories/product.repository'
import { MockProxy, mock } from 'vitest-mock-extended'
import { Product } from '../../../src/domain/entities/product'
import { faker } from '@faker-js/faker'
import { Transaction } from '../../../src/domain/entities/transaction'
import { TransactionTypeEnum } from '../../../src/domain/enums/transaction-type'
import { TransactionCreatedProductEventHandler } from '../../../src/events/handlers/transaction-created-event/product.handler'
import { TransactionCreatedEvent } from '../../../src/domain/events/transaction-created.event'
import { DomainEvents } from '../../../src/domain/interfaces/events/domain-events'

describe('Domain event tests', () => {
  let productRepository: MockProxy<IProductRepository>

  beforeEach(() => {
    productRepository = mock<IProductRepository>()
  })

  it('should be able to register an event', () => {
    const eventDispatcher = new EventDispatcher()
    const eventHandler = new TransactionCreatedProductEventHandler(productRepository)

    eventDispatcher.register(DomainEvents.TRANSACTION_CREATED_EVENT, eventHandler)

    expect(eventDispatcher.eventMapping[DomainEvents.TRANSACTION_CREATED_EVENT]).toBeDefined()
    expect(eventDispatcher.eventMapping[DomainEvents.TRANSACTION_CREATED_EVENT]).toHaveLength(1)
  })

  it('should be able to dispatch an event', async () => {
    const eventDispatcher = new EventDispatcher()
    const eventHandler = new TransactionCreatedProductEventHandler(productRepository)
    const spyEventHandler = vi.spyOn(eventHandler, 'execute')

    eventDispatcher.register(DomainEvents.TRANSACTION_CREATED_EVENT, eventHandler)

    const product = new Product({
      name: faker.commerce.product(),
      price: 199.99,
      inStockAmount: 100,
    })
    const transaction = new Transaction({
      amount: 10,
      productId: product.id,
      transactionDate: new Date(),
      type: TransactionTypeEnum.SALE,
    })
    const transactionCreatedEvent = new TransactionCreatedEvent({
      product,
      transaction,
    })

    await eventDispatcher.dispatch(transactionCreatedEvent)

    expect(spyEventHandler).toHaveBeenCalledOnce()
  })
})
