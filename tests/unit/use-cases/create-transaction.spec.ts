import { faker } from '@faker-js/faker'
import { randomUUID } from 'crypto'
import { beforeEach, describe, expect, it } from 'vitest'
import { CreateTransactionUseCase } from '@/domain/use-cases/create-transaction'
import { TransactionTypeEnum } from '@/domain/enums/transaction-type'
import { MockProxy, mock } from 'vitest-mock-extended'
import { InvalidTransactionAmountError } from '@/domain/errors/invalid-transaction-amount.error'
import { InvalidTransactionDateError } from '@/domain/errors/invalid-transaction-date.error'
import { ProductDoesNotExistError } from '@/domain/errors/product-does-not-exist.error'
import { IProductRepository } from '@/domain/interfaces/repositories/product.repository'
import { Product } from '@/domain/entities/product'
import { NotEnoughStockError } from '@/domain/errors/not-enough-stock.error'
import { ITransactionRepository } from '@/domain/interfaces/repositories/transaction.repository'
import { IEventDispatcher } from '@/domain/interfaces/events/event-dispatcher'

describe('Create transaction use case', () => {
  let transactionRepository: MockProxy<ITransactionRepository>
  let productRepository: MockProxy<IProductRepository>
  let sutUseCase: CreateTransactionUseCase
  let eventDispatcher: MockProxy<IEventDispatcher>

  beforeEach(() => {
    transactionRepository = mock<ITransactionRepository>()
    productRepository = mock<IProductRepository>()
    eventDispatcher = mock<IEventDispatcher>()
    productRepository.getProductById.mockImplementation(async (id) =>
      id !== '0'
        ? new Product({ name: faker.commerce.product(), price: 199.99, inStockAmount: 10 })
        : null,
    )

    sutUseCase = new CreateTransactionUseCase(
      transactionRepository,
      productRepository,
      eventDispatcher,
    )
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
