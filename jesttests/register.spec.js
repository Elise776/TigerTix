const auth = require("../backend/user-authentication/controllers/authenticationController");
const db = require("../backend/user-authentication/models/authenticationModel");
const bcrypt = require("bcryptjs");

jest.mock("../backend/user-authentication/models/authenticationModel");
jest.mock("bcryptjs");

describe("Registration", () => {
  let mockRequest, mockResponse;

  beforeEach(() => {
    mockRequest = {
      body: {},
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  test("Fails if missing email or password", () => {
    mockRequest.body = {};

    auth.register(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "Missing fields. Please provide an email and password",
    });
  });
});
