export class NotEnoughStockError extends Error {
  constructor() {
    super('Not enough units in stock to sell that amount')
  }
}
