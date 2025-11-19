const authController = require("../backend/user-authentication/controllers/authenticationController");

/**
 * Test: Missing email and password should trigger an error response
 *
 * Ensures:
 *  - The controller detects missing fields
 *  - `res.status(400)` is called
 *  - The correct JSON error message is returned
 */

describe("Register input validation (no DB)", () => {
  test("register returns 400 if email or password is missing", () => {
    const req = { body: {} };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    authController.register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Missing fields. Please provide an email and password",
    });
  });
});
