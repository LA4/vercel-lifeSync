const request = require("supertest");
const app = require("./app");
const { default: mongoose } = require("mongoose");
const User = require("./models/user");

const newUser = {
  username: "test-lacapsule",
  password: "test123",
  email: "test@gmail.com",
};

beforeEach(async () => {
  await User.deleteOne({ email: newUser.email });
});

describe("test post signUp", () => {
  it("Users schema & model", () => {
    expect(User).toBeDefined();

    const newFakeUser = new User(newUser);

    expect(newFakeUser).toHaveProperty("_id");
    expect(newFakeUser).toHaveProperty("token", newUser.token);
    expect(newFakeUser).toHaveProperty("password", newUser.password);
  });

  it("POST /signUp", async () => {
    const res = await request(app).post("/user/signUp").send(newUser);
    expect(res.statusCode).toBe(200);
    expect(res.body.result).toEqual(true);
  });
});

describe("test post signIn", () => {
  it("POST /signIn", async () => {
    const res = await request(app).post("/user/signIn").send({
      userId: "665464213041fdb80d9972ce",
      username: "Jo",
      password: "jojo1234",
      email: "jo@jo.com",
      token: "iYB_RFiay3MngOcNstixCOoeZU4i1QKf",
      flameCount: 0,
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      result: true,
      data: {
        email: "jo@jo.com",
        flameCount: 0,
        token: "iYB_RFiay3MngOcNstixCOoeZU4i1QKf",
        userId: "665464213041fdb80d9972ce",
        username: "Jo",
      },
    });
  });
  beforeAll((done) => {
    done();
  });

  afterAll((done) => {
    mongoose.connection.close();
    done();
  });
});
