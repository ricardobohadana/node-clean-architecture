import { describe, it, expect, beforeEach } from 'vitest'
import { faker } from '@faker-js/faker/locale/pt_BR'
import { MockProxy, mock } from 'vitest-mock-extended'
import { randomUUID } from 'crypto'
import { ITransactionRepository } from '@/domain/interfaces/repositories/transaction.repository'
import { GetTransactionHistoryUseCase } from '@/domain/application/use-cases/get-transaction-history'
import { Transaction } from '@/domain/entities/transaction'
import { TransactionTypeEnum } from '@/domain/entities/enums/transaction-type'

describe('Get transaction history use case tests', () => {
  let sutUseCase: GetTransactionHistoryUseCase
  let transactionRepository: MockProxy<ITransactionRepository>

  beforeEach(async () => {
    transactionRepository = mock<ITransactionRepository>()
    transactionRepository.getByProductId.mockImplementation(
      async ({ productId, type, skip, take }) => {
        const transactions: Transaction[] = []
        for (let index = skip; index < take; index++) {
          const transactionData = {
            productId: productId === '0' ? randomUUID() : productId,
            amount: faker.number.int({ min: 1, max: 10 }),
            type: [TransactionTypeEnum.PURCHASE, TransactionTypeEnum.SALE][
              type
                ? type === TransactionTypeEnum.PURCHASE
                  ? 0
                  : 1
                : faker.number.int({ min: 0, max: 1 })
            ],
            transactionDate: faker.date.past(),
          }
          transactions.push(new Transaction(transactionData))
        }
        return transactions.filter((t) => t.productId === productId)
      },
    )
    sutUseCase = new GetTransactionHistoryUseCase(transactionRepository)
  })

  it('should be able to get transaction history by productId', async () => {
    const useCaseProps = {
      productId: randomUUID(),
    }

    const response = await sutUseCase.execute(useCaseProps)

    expect(response).toBeDefined()
    expect(response).toHaveProperty('transactions')
    expect(response.transactions).toHaveLength(10)
  })

  it('should be able to get only sales transaction history by productId', async () => {
    const useCaseProps = {
      productId: randomUUID(),
      type: TransactionTypeEnum.SALE,
    }

    const response = await sutUseCase.execute(useCaseProps)

    expect(response).toBeDefined()
    expect(response).toHaveProperty('transactions')
    expect(response.transactions.every((t) => t.type === TransactionTypeEnum.SALE)).toBeTruthy()
  })

  it('should be able to get only purchases transaction history by productId', async () => {
    const useCaseProps = {
      productId: randomUUID(),
      type: TransactionTypeEnum.PURCHASE,
    }

    const response = await sutUseCase.execute(useCaseProps)

    expect(response).toBeDefined()
    expect(response).toHaveProperty('transactions')
    expect(response.transactions.every((t) => t.type === TransactionTypeEnum.PURCHASE)).toBeTruthy()
  })

  it('should be able to get transaction history by productId with pagination', async () => {
    const useCaseProps = {
      productId: randomUUID(),
      skip: 5,
      take: 22,
    }

    const response = await sutUseCase.execute(useCaseProps)

    expect(response).toBeDefined()
    expect(response).toHaveProperty('transactions')
    expect(response.transactions).toHaveLength(useCaseProps.take - useCaseProps.skip)
  })

  it('should be able to get an empty array as transaction history for an unexisting product', async () => {
    const useCaseProps = {
      productId: '0',
    }

    const response = await sutUseCase.execute(useCaseProps)

    expect(response).toBeDefined()
    expect(response).toHaveProperty('transactions')
    expect(response.transactions).toHaveLength(0)
  })
})
