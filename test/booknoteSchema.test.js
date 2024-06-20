const mongoose = require("mongoose");
const Booknote = require("../models/booknote");
const app = require("../app");

describe("booknote composition", () => {
  const booknoteinstance = new Booknote({
    created_at: new Date(),
    user_Id: [new mongoose.Types.ObjectId()],
    notes: "je su1s une t0mate test",
    mood: 1,
  });
  // start and end test or else loop
  beforeAll((done) => {
    done();
  });

  // Clear all test data after every test.
  afterEach(async () => {
    await Booknote.deleteMany({
      notes: "je su1s une t0mate test",
    });
  });

  // Remove and close the database and server or else loop.
  afterAll((done) => {
    mongoose.connection.close();
    done();
  });
  it("booknote contains a created_at", async () => {
    await booknoteinstance.save();
    expect(booknoteinstance.created_at).toBeDefined();
  });

  it("booknote contains a created_at", async () => {
    const booknoteinstance = new Booknote({
      created_at: new Date(),
      user_Id: [new mongoose.Types.ObjectId()],
      notes: "je su1s une t0mate test",
      mood: 1,
    });
    await booknoteinstance.save();
    expect(booknoteinstance.user_Id).toBeDefined();
  });

  it("booknote contains a created_at", async () => {
    const booknoteinstance = new Booknote({
      created_at: new Date(),
      user_Id: [new mongoose.Types.ObjectId()],
      notes: "je su1s une t0mate test",
      mood: 1,
    });
    await booknoteinstance.save();
    expect(booknoteinstance.notes).toBeDefined();
  });

  it("booknote contains a created_at", async () => {
    const booknoteinstance = new Booknote({
      created_at: new Date(),
      user_Id: [new mongoose.Types.ObjectId()],
      notes: "je su1s une t0mate test",
      mood: 1,
    });
    await booknoteinstance.save();
    expect(booknoteinstance.mood).toBeDefined();
  });
});
