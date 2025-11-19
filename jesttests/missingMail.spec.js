const authController = require("../backend/user-authentication/controllers/authenticationController");

describe("Register input validation (no DB)", () => {
  test("register returns 400 if email or password is missing", () => {
    const req = { body: {} }; // missing email and password
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    authController.register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Missing fields. Please provide an email and password",
    });
  });
});
