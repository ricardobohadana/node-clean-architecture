import {describe, it, expect} from 'vitest';
import {faker} from '@faker-js/faker/locale/pt_BR';
import {createProductUseCase} from '../../src/domain/use-cases/create-product';

describe('Create product unit tests', () => {
	it('should be able to create a product', () => {
		const productData = {
			name: faker.commerce.product(),
			price: Number(faker.commerce.price()),
		};
		const product = createProductUseCase(productData);

		expect(product.inStockAmount).toEqual(0);
		console.log(product);
		expect(product.id).toBeTruthy();
	});
});
