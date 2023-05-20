import { DomainEvents } from '@/domain/interfaces/events/domain-events'
import { makeShouldCreateNotificationHandler } from '../handlers/make-should-create-notification'
import { makeUpdateStockHandler } from '../handlers/make-update-stock'
import { EventDispatcher } from '@/domain/application/dispatcher/event-dispatcher'

export function makeEventDispatcher() {
  const eventDispatcher = new EventDispatcher()

  const updateStockHandler = makeUpdateStockHandler()
  const shouldCreateNotificationHandler = makeShouldCreateNotificationHandler()

  eventDispatcher.register(DomainEvents.TRANSACTION_CREATED_EVENT, updateStockHandler)
  eventDispatcher.register(DomainEvents.TRANSACTION_CREATED_EVENT, shouldCreateNotificationHandler)

  return eventDispatcher
}
