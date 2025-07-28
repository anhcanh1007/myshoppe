import { beforeEach, describe, expect, it } from "vitest";
import http from "../http";
import HttpStatusCode from "../../constants/httpStatusCode.enum";
import { clearAccessTokenFromLS } from "../auth";
beforeEach(() => {
  clearAccessTokenFromLS();
});
describe("goi api", () => {
  it("api products", async () => {
    const res = await http.get("products");
    expect(res.status).toBe(HttpStatusCode.Ok);
  });

  //   it("test api get me", async () => {
  //     const res = await http.get("me");
  //     console.log(res);
  //     expect(res.status).toBe(HttpStatusCode.Ok);
  //   });
});
