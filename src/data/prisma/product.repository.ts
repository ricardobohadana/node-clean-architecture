import { Product } from '@/domain/entities/product'
import { IProductRepository } from '@/domain/interfaces/repositories/product.repository'
import { prisma } from './client'
import { Product as ProductModel } from '@prisma/client'
export class PrismaProductRepository implements IProductRepository {
  private fromDatabaseModelToEntity(model: ProductModel | null): Product | null {
    if (!model) return model

    const { notificationLimit, size, updatedAt, price, color, ...rest } = model

    return new Product({
      ...rest,
      notificationLimit: notificationLimit ?? undefined,
      size: size ?? undefined,
      updatedAt: updatedAt ?? undefined,
      price: Number(price) / 100,
      color: color ?? undefined,
    })
  }

  async getProductByName(name: string): Promise<Product[]> {
    const models = await prisma.product.findMany({ where: { name: { contains: name } } })
    const products: Product[] = []
    models.forEach((model) => {
      const product = this.fromDatabaseModelToEntity(model)
      if (product) products.push(product)
    })

    return products
  }

  async save({
    id,
    color,
    createdAt,
    inStockAmount,
    name,
    notificationLimit,
    price,
    size,
    updatedAt,
  }: Product): Promise<void> {
    await prisma.product.create({
      data: {
        id,
        color,
        createdAt,
        inStockAmount,
        name,
        notificationLimit,
        price,
        size,
        updatedAt,
      },
    })
  }

  async getProductById(id: string): Promise<Product | null> {
    const model = await prisma.product.findUnique({ where: { id } })

    return this.fromDatabaseModelToEntity(model)
  }

  async update({
    id,
    color,
    createdAt,
    inStockAmount,
    name,
    notificationLimit,
    price,
    size,
    updatedAt,
  }: Product): Promise<void> {
    await prisma.product.update({
      where: { id },
      data: {
        color,
        createdAt,
        inStockAmount,
        name,
        notificationLimit,
        price,
        size,
        updatedAt,
      },
    })
  }

  async getAll({
    name,
    skip,
    take,
  }: {
    take: number
    skip: number
    name: string
  }): Promise<Product[]> {
    const models = await prisma.product.findMany({
      where: { name: { contains: name } },
      take,
      skip,
    })
    const products: Product[] = []
    models.forEach((model) => {
      const product = this.fromDatabaseModelToEntity(model)
      if (product) products.push(product)
    })

    return products
  }
}
