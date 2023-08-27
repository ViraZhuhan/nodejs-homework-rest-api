const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");
require("dotenv").config();

const { login } = require("./auth");

const { DB_HOST, PORT } = process.env;
// eslint-disable-next-line no-undef
beforeEach(async () => {
  await mongoose.connect(DB_HOST);
});

// eslint-disable-next-line no-undef
afterEach(async () => {
  await mongoose.connection.close();
});

// eslint-disable-next-line no-undef
describe("test login", () => {

// eslint-disable-next-line no-undef
  test("user must be logged in", async () => {
    const res = await request(app).post("/api/auth/login").send({
      password: "123456",
      email: "test@gmail.com",
    });

// eslint-disable-next-line no-undef
    expect(res.statusCode).toBe(200);
  });

// eslint-disable-next-line no-undef
  test("should return a token", async () => {
    const res = await request(app).post("/api/auth/login").send({
      password: "123456",
      email: "test@gmail.com",
    });
    const { token } = res.body;

    // eslint-disable-next-line no-undef
    expect(token).toBeTruthy();
  });

// eslint-disable-next-line no-undef
  test("should return a user object with email address and subscription as a string", async () => {
    const res = await request(app).post("/api/auth/login").send({
      password: "123456",
      email: "test@gmail.com",
    });
    const { user } = res.body;

// eslint-disable-next-line no-undef
    expect(typeof user.email).toBe("string");

// eslint-disable-next-line no-undef
    expect(typeof user.subscription).toBe("string");
  });
});
