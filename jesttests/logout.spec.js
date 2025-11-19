const authController = require("../backend/user-authentication/controllers/authenticationController");

test("logout clears cookie and returns success message", () => {
  const req = {};
  const res = { clearCookie: jest.fn(), json: jest.fn() };

  authController.logout(req, res);

  expect(res.clearCookie).toHaveBeenCalledWith("token");
  expect(res.json).toHaveBeenCalledWith({
    message: "Sucessfully logged out from TigerTix",
  });
});
