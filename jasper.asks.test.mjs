import { Jasper } from "./jasper.engine.mjs";
import { init } from "./jasper.asks.mjs";

jest.spyOn(console, "log").mockImplementation(() => {});

describe("User ", function () {
  init(Jasper);

  beforeEach(function () {
    Jasper("start");
  });

  afterEach(function () {
    Jasper("restart");
  });

  it("should provide answer to return true challenge", function () {
    var feedback = Jasper(function () {
      return true;
    });

    expect(feedback).not.toBe("Not quite try again.");
  });

  it("should provide answer to object literal challenge", function () {
    Jasper("skip", 1);
    var feedback = Jasper({
      a: 1,
      b: 1,
    });

    expect(feedback).not.toBe("Not quite try again.");
  });

  it("should provide answer to throw error challenge", function () {
    Jasper("skip", 2);
    var feedback = Jasper(function () {
      throw new Error("up");
    });

    expect(feedback).not.toBe("Not quite try again.");
  });

  it("should provide answer to JSON string challenge", function () {
    Jasper("skip", 3);
    var json = JSON.stringify({
      do: "good",
    });
    var feedback = Jasper(json);

    expect(feedback).not.toBe("Not quite try again.");
  });

  it("should provide answer to sum arguments challenge", function () {
    Jasper("skip", 4);
    var feedback = Jasper(function () {
      var sum = 0;
      for (var i = 0; i < arguments.length; i++) {
        sum += arguments[i];
      }

      return sum;
    });

    expect(feedback).not.toBe("Not quite try again.");
  });

  it("should provide answer to simple closure challenge", function () {
    Jasper("skip", 5);
    var feedback = Jasper(function (arg) {
      return function () {
        return arg;
      };
    });

    expect(feedback).not.toBe("Not quite try again.");
  });

  it("should provide answer to context change challenge", function () {
    Jasper("skip", 6);
    var context = {
      a: 1,
    };

    var feedback = Jasper.call(context, context);

    expect(feedback).not.toBe("Not quite try again.");
  });

  it("should provide answer to prototype addition challenge", function () {
    Jasper("skip", 7);

    var feedback = Jasper(function (object) {
      object.prototype.jasper = function () {};
    });

    expect(feedback).not.toBe("Not quite try again.");
  });

  it.skip("should provide answer to async challenge", function () {
    Jasper("skip", 8);

    var feedback = Jasper(function (object) {
      object.prototype.jasper = function () {};
    });

    expect(feedback).not.toBe("Not quite try again.");
  });
});
