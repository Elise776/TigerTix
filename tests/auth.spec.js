// tests/auth.spec.js
import { test, expect } from "@playwright/test";

test("User can register, login, access protected route, then logout", async ({
  request,
}) => {
  const email = "testuser@example.com";
  const password = "TestPass123";

  // 1. Try to register user (ignore errors if already exists)
  await request
    .post("http://localhost:8001/api/authentication/register", {
      data: { email, password },
    })
    .catch(() => {});

  // 2. Login
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

  // 3. Access protected route
  const protectedRes = await request.get(
    "http://localhost:8001/api/authentication/protected",
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  expect(protectedRes.ok()).toBeTruthy();
  const protectedData = await protectedRes.json();
  expect(protectedData.message).toContain(email);

  // 4. Logout (just clears cookie, JWT remains valid)
  const logoutRes = await request.post(
    "http://localhost:8001/api/authentication/logout",
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  expect(logoutRes.ok()).toBeTruthy();
});
