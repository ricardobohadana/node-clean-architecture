import { describe, it, expect, beforeEach, vi } from 'vitest'
import { faker } from '@faker-js/faker/locale/pt_BR'
import { IProductRepository } from '@/domain/interfaces/repositories/product.repository'
import { MockProxy, mock } from 'vitest-mock-extended'
import { UpdateProductNotificationLimitUseCase } from '@/domain/application/use-cases/update-product-notification-limit'
import { randomUUID } from 'crypto'
import { Product } from '@/domain/entities/product'
import { ProductDoesNotExistError } from '@/domain/application/errors/product-does-not-exist.error'

describe('Update product notification limit use case tests', () => {
  let sutUseCase: UpdateProductNotificationLimitUseCase
  let productRepository: MockProxy<IProductRepository>

  beforeEach(async () => {
    productRepository = mock<IProductRepository>()
    productRepository.update.mockImplementation(async (data) => {})
    productRepository.getProductById.mockImplementation(async (id) =>
      id === '0' ? null : new Product({ name: faker.commerce.product(), price: 99.39 }),
    )
    sutUseCase = new UpdateProductNotificationLimitUseCase(productRepository)
  })

  it('should be able to update the product notification limit', async () => {
    const spy = vi.spyOn(productRepository, 'update')
    const useCaseProps = {
      productId: randomUUID(),
      notificationLimit: 20,
    }

    await sutUseCase.execute(useCaseProps)

    expect(spy).toHaveBeenCalledOnce()
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
      productId: randomUUID(),
      notificationLimit: 0,
    }
    await sutUseCase.execute(useCaseProps)

    expect(spy).toHaveBeenCalledOnce()
  })
})
