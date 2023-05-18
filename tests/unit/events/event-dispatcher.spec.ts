import { beforeEach, describe, expect, it, vi } from 'vitest'
import { EventDispatcher } from '../../../src/events/event-dispatcher'
import { ProductSoldEventHandler } from '../../../src/events/handlers/product-sold-event.handler'
import { IProductRepository } from '../../../src/domain/interfaces/product.repository'
import { MockProxy, mock } from 'vitest-mock-extended'
import { DomainEvents } from '../../../src/domain/events/interfaces/domain-events'
import { ProductSoldEvent } from '../../../src/domain/events/domain-events/product-sold.event'
import { randomUUID } from 'crypto'

describe('Domain event tests', () => {
  let productRepository: MockProxy<IProductRepository>

  beforeEach(() => {
    productRepository = mock<IProductRepository>()
  })

  it('should be able to register an event', () => {
    const eventDispatcher = new EventDispatcher()
    const eventHandler = new ProductSoldEventHandler(productRepository)

    eventDispatcher.register(DomainEvents.PRODUCT_SOLD_EVENT, eventHandler)

    expect(eventDispatcher.eventMapping[DomainEvents.PRODUCT_SOLD_EVENT]).toBeDefined()
    expect(eventDispatcher.eventMapping[DomainEvents.PRODUCT_SOLD_EVENT]).toHaveLength(1)
  })

  it('should be able to dispatch an event', async () => {
    const eventDispatcher = new EventDispatcher()
    const eventHandler = new ProductSoldEventHandler(productRepository)
    const spyEventHandler = vi.spyOn(eventHandler, 'execute')

    eventDispatcher.register(DomainEvents.PRODUCT_SOLD_EVENT, eventHandler)

    const productSoldEvent = new ProductSoldEvent({
      inStockAmount: 10,
      productId: randomUUID(),
      soldAmount: 5,
    })

    await eventDispatcher.dispatch(productSoldEvent)

    expect(spyEventHandler).toHaveBeenCalled()
  })
})
