import { describe, it, expect, beforeEach, vi } from 'vitest'
import { faker } from '@faker-js/faker/locale/pt_BR'
import { IProductRepository } from '@/domain/interfaces/repositories/product.repository'
import { MockProxy, mock } from 'vitest-mock-extended'
import { UpdateProductNotificationLimitUseCase } from '@/domain/application/use-cases/update-product-notification-limit'
import { Product } from '@/domain/entities/product'
import { ProductDoesNotExistError } from '@/domain/application/errors/product-does-not-exist.error'

describe('Update product notification limit use case tests', () => {
  let sutUseCase: UpdateProductNotificationLimitUseCase
  let productRepository: MockProxy<IProductRepository>
  let product: Product
  beforeEach(async () => {
    product = new Product({
      name: faker.commerce.product(),
      price: 99.39,
      createdAt: faker.date.past(),
      updatedAt: faker.date.past(),
    })
    productRepository = mock<IProductRepository>()
    productRepository.update.mockImplementation(async (data) => {})
    productRepository.getProductById.mockImplementation(async (id) => (id === '0' ? null : product))
    sutUseCase = new UpdateProductNotificationLimitUseCase(productRepository)
  })

  it('should be able to update the product notification limit', async () => {
    const spy = vi.spyOn(productRepository, 'update')
    const useCaseProps = {
      productId: product.id,
      notificationLimit: 20,
    }

    await sutUseCase.execute(useCaseProps)

    expect(spy).toHaveBeenCalledOnce()
    expect(product.notificationLimit).toEqual(useCaseProps.notificationLimit)
    expect(product.updatedAt).toBeDefined()
    expect(product.updatedAt).not.toEqual(product.createdAt)
  })

  it('should not able to update the product notification limit of unexisting product', async () => {
    const useCaseProps = {
      productId: '0',
      notificationLimit: 20,
    }

    expect(async () => await sutUseCase.execute(useCaseProps)).rejects.toBeInstanceOf(
      ProductDoesNotExistError,
    )
  })

  it('should be able to update the product notification limit to 0 (only notify if there are no products left)', async () => {
    const spy = vi.spyOn(productRepository, 'update')

    const useCaseProps = {
      productId: product.id,
      notificationLimit: 0,
    }
    await sutUseCase.execute(useCaseProps)

    expect(spy).toHaveBeenCalledOnce()
    expect(product.notificationLimit).toEqual(useCaseProps.notificationLimit)
    expect(product.updatedAt).toBeDefined()
    expect(product.updatedAt).not.toEqual(product.createdAt)
  })
})
