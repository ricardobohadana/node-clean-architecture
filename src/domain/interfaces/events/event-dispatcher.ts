import { IEvent } from './event'
import { IEventHandler } from './event-handler'

export interface IEventDispatcher {
  register(eventName: string, handler: IEventHandler): void

  dispatch(event: IEvent): Promise<void>
}
