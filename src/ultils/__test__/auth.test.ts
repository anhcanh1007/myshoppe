import { describe, expect, it } from "vitest";
import {
  clearAccessTokenFromLS,
  getAccessTokenToLS,
  setAccessTokenFromLS,
} from "../auth";
import { beforeEach } from "node:test";

const access_token =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NWMwMGU2YTcyYjRhZGQ5YWQzMjJkZiIsImVtYWlsIjoiYW5oM3Rlc3RAZ21haWwuY29tIiwicm9sZXMiOlsiVXNlciJdLCJjcmVhdGVkX2F0IjoiMjAyNS0wNy0yNlQxNTo1NzoxMi4wODJaIiwiaWF0IjoxNzUzNTQ1NDMyLCJleHAiOjE3NTM2MzE4MzJ9.c3Od2zqctsZyq3Sf6AKTWUkOb9x0kH9mHU0wWioxCJU";

// const refresh_token =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NWMwMGU2YTcyYjRhZGQ5YWQzMjJkZiIsImVtYWlsIjoiYW5oM3Rlc3RAZ21haWwuY29tIiwicm9sZXMiOlsiVXNlciJdLCJjcmVhdGVkX2F0IjoiMjAyNS0wNy0yNlQxNTo1NzoxMi4wODJaIiwiaWF0IjoxNzUzNTQ1NDMyLCJleHAiOjE3NjIxODU0MzJ9.m68bFq9wOCDlNTA8XnhzfMfDxhssvKPenGYgD-vP2SU";

beforeEach(() => {
  clearAccessTokenFromLS();
});

describe("setAccessTokenToLS", () => {
  it("set access_token", () => {
    setAccessTokenFromLS(access_token);
    expect(getAccessTokenToLS()).toBe(access_token);
  });
});
