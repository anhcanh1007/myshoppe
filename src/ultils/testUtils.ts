import { waitFor, waitForOptions, screen } from "@testing-library/dom";
import { expect } from "vitest";

const delay = (time: number) => {
  return new Promise((relsove) => {
    setTimeout(() => {
      relsove(true);
    }, time);
  });
};

export const logScreen = async (
  body: HTMLElement = document.body.parentElement as HTMLElement,
  options?: waitForOptions
) => {
  const { timeout = 1000 } = options || {};
  await waitFor(
    async () => {
      expect(await delay(timeout - 100)).toBe(true);
    },
    {
      ...options,
      timeout,
    }
  );
  screen.debug(body, 99999999);
};
