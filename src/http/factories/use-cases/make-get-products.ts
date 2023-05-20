import { PrismaProductRepository } from '@/data/prisma/product.repository'
import { GetProductUseCase } from '@/domain/application/use-cases/get-products'

export function makeGetProductsUseCase() {
  const productRepository = new PrismaProductRepository()
  return new GetProductUseCase(productRepository)
}
