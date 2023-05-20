import { PrismaProductRepository } from '@/data/prisma/product.repository'
import { UpdateProductNotificationLimitUseCase } from '@/domain/application/use-cases/update-product-notification-limit'

export function makeUpdateProductNotificationLimitUseCase() {
  const productRepository = new PrismaProductRepository()
  return new UpdateProductNotificationLimitUseCase(productRepository)
}
