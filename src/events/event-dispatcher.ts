import { IEvent } from '../domain/interfaces/events/event'
import { IEventDispatcher } from '../domain/interfaces/events/event-dispatcher'
import { IEventHandler } from '../domain/interfaces/events/event-handler'

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
