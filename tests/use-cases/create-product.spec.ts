import { describe, it, expect, beforeEach } from 'vitest'
import { faker } from '@faker-js/faker/locale/pt_BR'
import { CreateProductUseCase } from '../../src/domain/use-cases/create-product'
import { InvalidPriceError } from '../../src/domain/errors/invalid-price.error'
import { IProductRepository } from '../../src/domain/interfaces/product.repository'
import { mock } from 'vitest-mock-extended'
import { Product } from '../../src/domain/entities/product'
import { DuplicateEntityError } from '../../src/domain/errors/duplicate-entity.error'

describe('Create product unit tests', () => {
  let sutUseCase: CreateProductUseCase
  const productRepository = mock<IProductRepository>()

  beforeEach(async () => {
    sutUseCase = new CreateProductUseCase(productRepository)
  })

  it('should be able to create a product', async () => {
    const productData = {
      name: faker.commerce.product(),
      price: Number(faker.commerce.price()),
    }
    productRepository.getProductByName.mockImplementation(async () => null)
    const product = await sutUseCase.execute(productData)

    expect(product.inStockAmount).toEqual(0)
    expect(product.id).toBeTruthy()
  })

  it('should not be able to create a product with price <= 0', async () => {
    const productData = {
      name: faker.commerce.product(),
      price: -10,
    }
    productRepository.getProductByName.mockImplementation(async () => null)
    expect(async () => await sutUseCase.execute(productData)).rejects.toBeInstanceOf(
      InvalidPriceError,
    )
  })

  it('should not be able to create two equal products', async () => {
    const productData = {
      name: faker.commerce.product(),
      price: Number(faker.commerce.price()),
    }
    productRepository.getProductByName.mockImplementation(
      async () => await new Product(productData),
    )
    expect(async () => await sutUseCase.execute(productData)).rejects.toBeInstanceOf(
      DuplicateEntityError,
    )
  })
})
