import { AssertionError } from "assert";
import { getCount } from "../src/getCount";

describe("getCount.ts", () => {
  const url = "https://kino.mail.ru";

  describe(`facebook for ${url}`, () => {
    const responsePromise = getCount({ url, networkName: "facebook" });

    it("should be a promise", () => {
      expect(responsePromise).toBeInstanceOf(Promise);
    });

    it("should resolve with a number", async () => {
      // expect.assertions(1);
      expect.hasAssertions();
      await expect(responsePromise).resolves.toBeGreaterThanOrEqual(0);
    });

    // it("should work without errors", () => {
    //   responsePromise.catch(() => {
    //     AssertionError();
    //   });
    // });
  });
});
