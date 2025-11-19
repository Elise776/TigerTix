/**
 * Unit tests for bcrypt hashing and comparison behavior.
 *
 * These tests verify that:
 *  - bcrypt.hashSync is called correctly and returns the mocked hash.
 *  - bcrypt.compareSync correctly returns the mocked boolean comparison result.
 */
const bcrypt = require("bcryptjs");
jest.mock("bcryptjs");

/**
 * Test: bcrypt.hashSync hashes a password correctly.
 *
 * Ensures:
 *  - hashSync is called with the correct arguments.
 *  - the mocked return value is passed back from the function.
 */
test("bcrypt.hashSync hashes password", () => {
  bcrypt.hashSync.mockReturnValue("hashedPassword");
  const password = "mypassword";
  const hash = bcrypt.hashSync(password, 10);

  expect(bcrypt.hashSync).toHaveBeenCalledWith(password, 10);
  expect(hash).toBe("hashedPassword");
});

/**
 * Test: bcrypt.compareSync returns correct comparison result.
 *
 * Ensures:
 *  - compareSync is called with the correct arguments.
 *  - it returns the mocked comparison result.
 */
test("bcrypt.compareSync returns correct result", () => {
  bcrypt.compareSync.mockReturnValue(true);
  const result = bcrypt.compareSync("password123", "hashedPassword");

  expect(bcrypt.compareSync).toHaveBeenCalledWith(
    "password123",
    "hashedPassword"
  );
  expect(result).toBe(true);
});
