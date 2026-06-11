import Product from "../../../domain/product/entity/product";
import UpdateProductUseCase from "./update.product.usecase";

const MockRepository = () => {
  return {
    find: jest.fn().mockImplementation(() =>
      Promise.resolve(new Product("123", "Product 1", 100))
    ),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };
};

describe("Unit test update product use case", () => {
  it("should update a product", async () => {
    const productRepository = MockRepository();
    const usecase = new UpdateProductUseCase(productRepository);

    const input = {
      id: "123",
      name: "Updated Product",
      price: 150,
    };

    const output = await usecase.execute(input);

    expect(output).toEqual({
      id: "123",
      name: "Updated Product",
      price: 150,
    });
  });

  it("should thrown an error when trying to update with invalid name", async () => {
    const productRepository = MockRepository();
    const usecase = new UpdateProductUseCase(productRepository);

    const input = {
      id: "123",
      name: "",
      price: 150,
    };

    await expect(usecase.execute(input)).rejects.toThrow();
    await expect(usecase.execute(input)).rejects.toThrow(/Name is required/);
  });

  it("should thrown an error when trying to update with negative price", async () => {
    const productRepository = MockRepository();
    const usecase = new UpdateProductUseCase(productRepository);

    const input = {
      id: "123",
      name: "Updated Product",
      price: -50,
    };

    await expect(usecase.execute(input)).rejects.toThrow();
    await expect(usecase.execute(input)).rejects.toThrow(
      /Price must be greater than or equal to zero/
    );
  });
});
