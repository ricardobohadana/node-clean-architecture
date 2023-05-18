export interface IEvent<T = any> {
  timestamp: Date
  eventName: string
  data: T
}
