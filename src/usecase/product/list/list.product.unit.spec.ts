import Product from "../../../domain/product/entity/product";
import ListProductUseCase from "./list.product.usecase";

const product1 = new Product("1", "Product 1", 100);
const product2 = new Product("2", "Product 2", 200);

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn().mockReturnValue(Promise.resolve([product1, product2])),
    create: jest.fn(),
    update: jest.fn(),
  };
};

describe("Unit test list product use case", () => {
  it("should list all products", async () => {
    const productRepository = MockRepository();
    const usecase = new ListProductUseCase(productRepository);

    const output = await usecase.execute({});

    expect(output).toEqual({
      products: [
        {
          id: "1",
          name: "Product 1",
          price: 100,
        },
        {
          id: "2",
          name: "Product 2",
          price: 200,
        },
      ],
    });
  });

  it("should list empty products", async () => {
    const productRepository = MockRepository();
    productRepository.findAll.mockReturnValue(Promise.resolve([]));
    const usecase = new ListProductUseCase(productRepository);

    const output = await usecase.execute({});

    expect(output).toEqual({
      products: [],
    });
  });
});
