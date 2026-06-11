import { Sequelize } from "sequelize-typescript";
import Product from "../../../domain/product/entity/product";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import UpdateProductUseCase from "./update.product.usecase";

describe("Integration test update product use case", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should update a product", async () => {
    const productRepository = new ProductRepository();
    const usecase = new UpdateProductUseCase(productRepository);

    const product = new Product("123", "Product 1", 100);
    await productRepository.create(product);

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

    const updatedProduct = await productRepository.find("123");
    expect(updatedProduct.name).toEqual("Updated Product");
    expect(updatedProduct.price).toEqual(150);
  });

  it("should thrown an error when trying to update with invalid name", async () => {
    const productRepository = new ProductRepository();
    const usecase = new UpdateProductUseCase(productRepository);

    const product = new Product("123", "Product 1", 100);
    await productRepository.create(product);

    const input = {
      id: "123",
      name: "",
      price: 150,
    };

    await expect(usecase.execute(input)).rejects.toThrow();
    await expect(usecase.execute(input)).rejects.toThrow(
      /Name is required/
    );
  });

  it("should thrown an error when trying to update with negative price", async () => {
    const productRepository = new ProductRepository();
    const usecase = new UpdateProductUseCase(productRepository);

    const product = new Product("123", "Product 1", 100);
    await productRepository.create(product);

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
