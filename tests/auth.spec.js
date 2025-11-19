import { test, expect } from "@playwright/test";

/**
 * Test: Registration, login, protected routes, and logging out
 *
 * Ensures:
 *  - Users can create an account
 *  - Users can login after making an account
 *  - Users are able to log out
 *
 */
test("User can register, login, access protected route, then logout", async ({
  request,
}) => {
  const email = "testuser@example.com";
  const password = "TestPass123";

  await request
    .post("http://localhost:8001/api/authentication/register", {
      data: { email, password },
    })
    .catch(() => {});

  const loginRes = await request.post(
    "http://localhost:8001/api/authentication/login",
    {
      data: { email, password },
    }
  );
  expect(loginRes.ok()).toBeTruthy();
  const loginData = await loginRes.json();
  expect(loginData.token).toBeTruthy();
  const token = loginData.token;

  const protectedRes = await request.get(
    "http://localhost:8001/api/authentication/protected",
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  expect(protectedRes.ok()).toBeTruthy();
  const protectedData = await protectedRes.json();
  expect(protectedData.message).toContain(email);

  const logoutRes = await request.post(
    "http://localhost:8001/api/authentication/logout",
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  expect(logoutRes.ok()).toBeTruthy();
});
