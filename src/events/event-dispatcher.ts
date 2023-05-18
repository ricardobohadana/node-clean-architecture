import { IEventDispatcher } from '../domain/events/interfaces/event-dispatcher'
import { IEvent } from '../domain/events/interfaces/event'
import { IEventHandler } from '../domain/events/interfaces/event-handler'

export type EventMapping = Record<string, IEventHandler[]>

export class EventDispatcher implements IEventDispatcher {
  private _eventMapping: EventMapping = {}

  get eventMapping() {
    return this._eventMapping
  }

  register(eventName: string, handler: IEventHandler): void {
    this._eventMapping = {
      ...this._eventMapping,
      [eventName]: [...(this._eventMapping[eventName] ?? []), handler],
    }
  }

  async dispatch(event: IEvent): Promise<void> {
    const { eventName } = event
    if (Object.keys(this._eventMapping).includes(eventName))
      this._eventMapping[eventName].forEach(async (handler) => await handler.execute(event))
  }
}
