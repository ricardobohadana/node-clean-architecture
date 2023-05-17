import { faker } from '@faker-js/faker'
import { randomUUID } from 'crypto'
import { describe, expect, it } from 'vitest'
import { createTransactionUseCase } from '../../src/domain/use-cases/create-transaction'
import { TransactionTypeEnum } from '../../src/domain/enums/transaction-type'

describe('Create transaction use case', () => {
  it('should be able to create a transaction', () => {
    const transactionData = {
      productId: randomUUID() as string,
      amount: faker.number.int({ min: 1, max: 100 }),
      type: [TransactionTypeEnum.PURCHASE, TransactionTypeEnum.SALE][
        faker.number.int({ min: 0, max: 1 })
      ],
      transactionDate: faker.date.past(),
    }

    const transaction = createTransactionUseCase(transactionData)

    expect(transaction.id).toBeTruthy()
  })
})
