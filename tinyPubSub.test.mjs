import * as tps from "./tinyPubSub.mjs";

describe("TinyPubSub (tps)", () => {
  beforeEach(() => {
    delete tps.pub.list;
  });

  describe("sub", () => {
    it("should throw if anything that isn't a function is provided", () => {
      const testCases = [void 0, "a", true, {}, []];

      testCases.forEach((arg) => {
        const type = {}.toString.call(arg);

        expect(() => {
          tps.sub(arg);
        }).toThrow(
          `To subscribe, a function must be provided: ${type} provided.`,
        );
      });
    });

    it("should allow subscriptions", () => {
      const testFn1 = () => {};

      expect(tps.pub.list).toBe(undefined);
      tps.sub(testFn1);
      expect(tps.pub.list.length).toBe(1);
    });
  });

  describe("pub", () => {
    it("should not error when no subscriptions exist", () => {
      expect(tps.pub.list).toBe(undefined);
      expect(tps.pub()).toBe(undefined);
    });

    it("should publish events to subscribers", () => {
      let hasRun = false;

      tps.sub(() => {
        hasRun = true;
      });

      expect(hasRun).toBe(false);
      tps.pub();
      expect(hasRun).toBe(true);
    });

    it("should only publish to subscriptions; not removed subscriptions", () => {
      const events = {
        first: [],
        second: [],
        third: [],
        fourth: [],
        fifth: [],
      };

      const first = tps.sub((event) => {
        events.first.push(event);
      });
      const second = tps.sub((event) => {
        events.second.push(event);
      });
      const third = tps.sub((event) => {
        events.third.push(event);
      });
      const fourth = tps.sub((event) => {
        events.fourth.push(event);
      });

      tps.pub(0);

      expect(events).toEqual({
        first: [0],
        second: [0],
        third: [0],
        fourth: [0],
        fifth: [],
      });

      second();
      tps.pub(1);

      expect(events).toEqual({
        first: [0, 1],
        second: [0],
        third: [0, 1],
        fourth: [0, 1],
        fifth: [],
      });

      const fifth = tps.sub((event) => {
        events.fifth.push(event);
      });

      third();
      tps.pub(2);

      expect(events).toEqual({
        first: [0, 1, 2],
        second: [0],
        third: [0, 1],
        fourth: [0, 1, 2],
        fifth: [2],
      });

      first();
      fourth();
      fifth();
      tps.pub(3);

      expect(events).toEqual({
        first: [0, 1, 2],
        second: [0],
        third: [0, 1],
        fourth: [0, 1, 2],
        fifth: [2],
      });
    });
  });
});
