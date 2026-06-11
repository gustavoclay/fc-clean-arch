import { app, sequelize } from "../express";
import request from "supertest";
import Product from "../../../domain/product/entity/product";
import ProductRepository from "../../product/repository/sequelize/product.repository";

describe("E2E test for product", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should list all products (JSON)", async () => {
    const productRepository = new ProductRepository();
    
    const product1 = new Product("1", "Product 1", 100);
    const product2 = new Product("2", "Product 2", 200);
    
    await productRepository.create(product1);
    await productRepository.create(product2);

    const response = await request(app).get("/product").send();

    expect(response.status).toBe(200);
    expect(response.body.products).toBeDefined();
    expect(response.body.products.length).toBe(2);
    
    const product = response.body.products[0];
    expect(product.id).toBe("1");
    expect(product.name).toBe("Product 1");
    expect(product.price).toBe(100);
    
    const product2Item = response.body.products[1];
    expect(product2Item.id).toBe("2");
    expect(product2Item.name).toBe("Product 2");
    expect(product2Item.price).toBe(200);
  });

  it("should list all products in XML format", async () => {
    const productRepository = new ProductRepository();
    
    const product1 = new Product("1", "Product 1", 100);
    const product2 = new Product("2", "Product 2", 200);
    
    await productRepository.create(product1);
    await productRepository.create(product2);

    const response = await request(app)
      .get("/product")
      .set("Accept", "application/xml")
      .send();

    expect(response.status).toBe(200);
    expect(response.text).toContain(`<?xml version="1.0" encoding="UTF-8"?>`);
    expect(response.text).toContain(`<products>`);
    expect(response.text).toContain(`<product>`);
    expect(response.text).toContain(`<id>1</id>`);
    expect(response.text).toContain(`<name>Product 1</name>`);
    expect(response.text).toContain(`<price>100</price>`);
    expect(response.text).toContain(`<id>2</id>`);
    expect(response.text).toContain(`<name>Product 2</name>`);
    expect(response.text).toContain(`<price>200</price>`);
    expect(response.text).toContain(`</product>`);
    expect(response.text).toContain(`</products>`);
  });

  it("should list empty products", async () => {
    const response = await request(app).get("/product").send();

    expect(response.status).toBe(200);
    expect(response.body.products).toBeDefined();
    expect(response.body.products.length).toBe(0);
  });
});
