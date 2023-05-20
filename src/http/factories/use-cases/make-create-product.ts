import { PrismaProductRepository } from '@/data/prisma/product.repository'
import { CreateProductUseCase } from '@/domain/application/use-cases/create-product'

export function makeCreateProductUseCase() {
  const prodRepo = new PrismaProductRepository()
  return new CreateProductUseCase(prodRepo)
}
