const bcrypt = require("bcryptjs");
jest.mock("bcryptjs");

test("bcrypt.hashSync hashes password", () => {
  bcrypt.hashSync.mockReturnValue("hashedPassword");
  const password = "mypassword";
  const hash = bcrypt.hashSync(password, 10);

  expect(bcrypt.hashSync).toHaveBeenCalledWith(password, 10);
  expect(hash).toBe("hashedPassword");
});

test("bcrypt.compareSync returns correct result", () => {
  bcrypt.compareSync.mockReturnValue(true);
  const result = bcrypt.compareSync("password123", "hashedPassword");

  expect(bcrypt.compareSync).toHaveBeenCalledWith(
    "password123",
    "hashedPassword"
  );
  expect(result).toBe(true);
});
