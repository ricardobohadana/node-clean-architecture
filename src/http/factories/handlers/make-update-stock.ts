import { PrismaProductRepository } from '@/data/prisma/product.repository'
import { UpdateStockHandler } from '@/domain/application/handlers/update-stock.handler'

export function makeUpdateStockHandler() {
  const productRepository = new PrismaProductRepository()
  return new UpdateStockHandler(productRepository)
}
