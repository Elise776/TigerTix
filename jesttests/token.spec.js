const jwt = require("jsonwebtoken");
jest.mock("jsonwebtoken");

/**
 * Test: JWT token is created
 *
 * Ensures:
 *  - jwt token is created when user is logged in. Expires in 30 minutes
 */
test("JWT token is created with correct payload", () => {
  const fakeUser = { id: 42, email: "test@example.com" };
  const token = "mockedToken";

  jwt.sign.mockReturnValue(token);

  const generated = jwt.sign(
    { id: fakeUser.id, email: fakeUser.email },
    "supersecretkey",
    { expiresIn: "30m" }
  );

  expect(jwt.sign).toHaveBeenCalledWith(
    { id: 42, email: "test@example.com" },
    "supersecretkey",
    { expiresIn: "30m" }
  );
  expect(generated).toBe(token);
});
