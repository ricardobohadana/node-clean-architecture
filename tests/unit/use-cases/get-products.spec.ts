import { describe, it, expect, beforeEach } from 'vitest'
import { faker } from '@faker-js/faker/locale/pt_BR'
import { GetProductUseCase } from '@/domain/application/use-cases/get-products'
import { IProductRepository } from '@/domain/interfaces/repositories/product.repository'
import { MockProxy, mock } from 'vitest-mock-extended'
import { Product } from '@/domain/entities/product'

describe('Get products unit tests', () => {
  let sutUseCase: GetProductUseCase
  let productRepository: MockProxy<IProductRepository>

  beforeEach(async () => {
    productRepository = mock<IProductRepository>()
    productRepository.getAll.mockImplementation(async ({ name, skip, take }) => {
      const products: Product[] = []
      for (let index = skip; index < take; index++) {
        const product = new Product({
          name: faker.commerce.productName() + name,
          price: faker.number.float(),
        })
        products.push(product)
      }

      return products
    })
    sutUseCase = new GetProductUseCase(productRepository)
  })

  it('should be able to get all products', async () => {
    const useCaseProps = {}
    const { products } = await sutUseCase.execute(useCaseProps)

    expect(products).toBeDefined()
  })

  it('should be able to filter products by name', async () => {
    const useCaseProps = {
      name: 'name',
    }
    const { products } = await sutUseCase.execute(useCaseProps)

    expect(products).toBeDefined()
    expect(products.every((p) => p.name.includes(useCaseProps.name))).toBeTruthy()
  })

  it('should be able to paginate products', async () => {
    const useCaseProps = {
      take: 20,
      skip: 13,
    }
    const { products } = await sutUseCase.execute(useCaseProps)

    expect(products).toBeDefined()
    expect(products).toHaveLength(useCaseProps.take - useCaseProps.skip)
  })
})
