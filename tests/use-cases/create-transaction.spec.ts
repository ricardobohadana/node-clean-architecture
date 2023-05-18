import { faker } from '@faker-js/faker'
import { randomUUID } from 'crypto'
import { beforeEach, describe, expect, it } from 'vitest'
import { CreateTransactionUseCase } from '../../src/domain/use-cases/create-transaction'
import { TransactionTypeEnum } from '../../src/domain/enums/transaction-type'
import { MockProxy, mock } from 'vitest-mock-extended'
import { ITransactionRepository } from '../../src/domain/interfaces/transaction.repository'
import { InvalidTransactionAmountError } from '../../src/domain/errors/invalid-transaction-amount.error'
import { InvalidTransactionDateError } from '../../src/domain/errors/invalid-transaction-date.error'
import { ProductDoesNotExistError } from '../../src/domain/errors/product-does-not-exist.error'
import { IProductRepository } from '../../src/domain/interfaces/product.repository'
import { Product } from '../../src/domain/entities/product'
import { NotEnoughStockError } from '../../src/domain/errors/not-enough-stock.error'

describe('Create transaction use case', () => {
  let transactionRepository: MockProxy<ITransactionRepository>
  let productRepository: MockProxy<IProductRepository>
  let sutUseCase: CreateTransactionUseCase

  beforeEach(() => {
    transactionRepository = mock<ITransactionRepository>()
    productRepository = mock<IProductRepository>()
    productRepository.getProductById.mockImplementation(async (id) =>
      id !== '0'
        ? new Product({ name: faker.commerce.product(), price: 199.99, inStockAmount: 10 })
        : null,
    )

    sutUseCase = new CreateTransactionUseCase(transactionRepository, productRepository)
  })

  it('should be able to create a transaction', async () => {
    const transactionData = {
      productId: randomUUID() as string,
      amount: faker.number.int({ min: 1, max: 10 }),
      type: [TransactionTypeEnum.PURCHASE, TransactionTypeEnum.SALE][
        faker.number.int({ min: 0, max: 1 })
      ],
      transactionDate: faker.date.past(),
    }

    const transaction = await sutUseCase.execute(transactionData)

    expect(transaction.id).toBeTruthy()
    expect(transaction.type).toEqual(transactionData.type)
    expect(transactionRepository.save).toHaveBeenCalledOnce()
  })

  it('should not be able to create a SALE transaction for a product without enough stock amount', async () => {
    const transactionData = {
      productId: randomUUID(),
      amount: faker.number.int({ min: 11, max: 100 }),
      type: TransactionTypeEnum.SALE,
      transactionDate: faker.date.past(),
    }

    await expect(async () => await sutUseCase.execute(transactionData)).rejects.toBeInstanceOf(
      NotEnoughStockError,
    )
    expect(transactionRepository.save).not.toHaveBeenCalledOnce()
  })

  it('should not be able to create a transaction for an unexisting product', async () => {
    const transactionData = {
      productId: '0',
      amount: faker.number.int({ min: 1, max: 10 }),
      type: [TransactionTypeEnum.PURCHASE, TransactionTypeEnum.SALE][
        faker.number.int({ min: 0, max: 1 })
      ],
      transactionDate: faker.date.past(),
    }

    await expect(async () => await sutUseCase.execute(transactionData)).rejects.toBeInstanceOf(
      ProductDoesNotExistError,
    )
    expect(transactionRepository.save).not.toHaveBeenCalledOnce()
  })

  it('should not be able to create a transaction with amount <= 0', async () => {
    const transactionData = {
      productId: randomUUID() as string,
      amount: faker.number.int({ min: -10, max: 0 }),
      type: [TransactionTypeEnum.PURCHASE, TransactionTypeEnum.SALE][
        faker.number.int({ min: 0, max: 1 })
      ],
      transactionDate: faker.date.past(),
    }

    await expect(async () => await sutUseCase.execute(transactionData)).rejects.toBeInstanceOf(
      InvalidTransactionAmountError,
    )
    expect(transactionRepository.save).not.toHaveBeenCalledOnce()
  })

  it('should not be able to create a transaction with a future date', async () => {
    const transactionData = {
      productId: randomUUID() as string,
      amount: faker.number.int({ min: 1, max: 10 }),
      type: [TransactionTypeEnum.PURCHASE, TransactionTypeEnum.SALE][
        faker.number.int({ min: 0, max: 1 })
      ],
      transactionDate: faker.date.future(),
    }

    await expect(async () => await sutUseCase.execute(transactionData)).rejects.toBeInstanceOf(
      InvalidTransactionDateError,
    )
    expect(transactionRepository.save).not.toHaveBeenCalledOnce()
  })
})
