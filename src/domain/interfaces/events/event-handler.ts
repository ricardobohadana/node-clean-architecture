import { IEvent } from './event'

export interface IEventHandler<K = any> {
  execute(event: IEvent<K>): Promise<void>
}
