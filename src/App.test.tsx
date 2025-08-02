import { describe, expect, test } from "vitest";
import * as matchers from "@testing-library/jest-dom/matchers";
import { render, waitFor, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import { BrowserRouter, MemoryRouter } from "react-router-dom";

expect.extend(matchers);

describe("App", () => {
  test("App render va chuyen trang", async () => {
    render(<App />, {
      wrapper: BrowserRouter,
    });
    const user = userEvent.setup();
    /**
     * waitFor sẽ run callback 1 vài lần
     * cho đến khi hết timeout hoặc expect pass
     * số lần run phụ thuộc vào timeout và interval
     * mặc định: timeout = 1000ms và interval = 50ms
     */

    // Verify vào đúng trang chủ
    await waitFor(() => {
      expect(document.querySelector("title")?.textContent).toBe("Trang chủ");
    });

    // Verify chuyển sang trang login
    await user.click(screen.getByText(/Đăng nhập/i));
    await waitFor(() => {
      expect(screen.queryByText("Bạn chưa có tài khoản")).toBeDefined();
      expect(document.querySelector("title")?.textContent).toBe(
        "Đăng nhập | My Shoppee"
      );
    });
    screen.debug(document.body.parentElement as HTMLElement, 9999999999);
  });

  //test badroute => ve trang notfound
  test("Về trang notFound", async () => {
    const badRoute = "/some/bad/route";
    render(
      <MemoryRouter initialEntries={[badRoute]}>
        <App />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText(/404/i)).toBeDefined();
    });
  });
});
