const mongoose = require("mongoose");
const User = require("../models/user");
const app = require("../app");

describe("User Model Test", () => {
  // start and end test or else loop
  beforeAll((done) => {
    done();
  });

  // Clear all test data after every test.
  afterEach(async () => {
    await User.deleteMany();
  });

  // Remove and close the database and server or else loop.
  afterAll((done) => {
    mongoose.connection.close();
    done();
  });

  describe("composition user", () => {
    it("Est ce que mon user a un username", async () => {
      const userInstance = new User({
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      });
      await userInstance.save();
      expect(userInstance.username).toBeDefined();
    });

    it("Est ce que mon user a un email", async () => {
      const userInstance = new User({
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      });
      await userInstance.save();
      expect(userInstance.email).toBeDefined();
    });

    it("Est ce que mon user a un password", async () => {
      const userInstance = new User({
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      });
      await userInstance.save();
      expect(userInstance.password).toBeDefined();
    });

    it("Est ce que mon user a des notes", async () => {
      const userInstance = new User({
        username: "testuser",
        email: "test@example.com",
        password: "password123",
        note: [new mongoose.Types.ObjectId()],
      });
      await userInstance.save();
      expect(userInstance.note).toBeDefined();
    });

    it("Est ce que mon user a des task", async () => {
      const userInstance = new User({
        username: "testuser",
        email: "test@example.com",
        password: "password123",
        task: [new mongoose.Types.ObjectId()],
      });
      await userInstance.save();
      expect(userInstance.task).toBeDefined();
    });

    it("Est ce que mon user a des event", async () => {
      const userInstance = new User({
        username: "testuser",
        email: "test@example.com",
        password: "password123",
        event: [new mongoose.Types.ObjectId()],
      });
      await userInstance.save();
      expect(userInstance.event).toBeDefined();
    });

    it("Est ce que mon user a un token", async () => {
      const userInstance = new User({
        username: "testuser",
        email: "test@example.com",
        password: "password123",
        token: "someToken",
      });
      await userInstance.save();
      expect(userInstance.token).toBeDefined();
    });
  });
});
