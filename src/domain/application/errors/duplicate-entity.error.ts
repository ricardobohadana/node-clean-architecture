export class DuplicateEntityError extends Error {
  constructor() {
    super('Duplicate entity entry error')
  }
}
