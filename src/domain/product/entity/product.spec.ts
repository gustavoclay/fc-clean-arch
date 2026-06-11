import Product from "./product";
import NotificationError from "../../@shared/notification/notification.error";

describe("Product unit tests", () => {
  it("should throw error when id is empty", () => {
    expect(() => {
      const product = new Product("", "Product 1", 100);
    }).toThrowError(NotificationError);
  });

  it("should throw error when name is empty", () => {
    expect(() => {
      const product = new Product("123", "", 100);
    }).toThrowError(NotificationError);
  });

  it("should throw error when price is less than zero", () => {
    expect(() => {
      const product = new Product("123", "Name", -1);
    }).toThrowError(NotificationError);
  });

  it("should throw error with multiple validation errors simultaneously", () => {
    expect(() => {
      const product = new Product("", "", -5);
    }).toThrowError(NotificationError);

    try {
      const product = new Product("", "", -5);
    } catch (error) {
      if (error instanceof NotificationError) {
        expect(error.errors).toHaveLength(3);
        expect(error.errors[0].context).toBe("product");
        expect(error.errors[1].context).toBe("product");
        expect(error.errors[2].context).toBe("product");
        const messages = error.errors.map((e) => e.message);
        expect(messages).toContain("Id is required");
        expect(messages).toContain("Name is required");
        expect(messages).toContain("Price must be greater than or equal to zero");
      }
    }
  });

  it("should change name", () => {
    const product = new Product("123", "Product 1", 100);
    product.changeName("Product 2");
    expect(product.name).toBe("Product 2");
  });

  it("should change price", () => {
    const product = new Product("123", "Product 1", 100);
    product.changePrice(150);
    expect(product.price).toBe(150);
  });

  it("should throw error when changing name to empty", () => {
    const product = new Product("123", "Product 1", 100);
    expect(() => {
      product.changeName("");
    }).toThrowError(NotificationError);
  });

  it("should throw error when changing price to negative", () => {
    const product = new Product("123", "Product 1", 100);
    expect(() => {
      product.changePrice(-50);
    }).toThrowError(NotificationError);
  });
});
