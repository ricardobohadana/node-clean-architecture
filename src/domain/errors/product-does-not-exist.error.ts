export class ProductDoesNotExistError extends Error {
  constructor() {
    super('Product does not exist')
  }
}
