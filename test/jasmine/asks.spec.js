describe("User ", function () {
  "use strict";

  var jasper = Jasper;

  beforeEach(function () {
    jasper("start");
  });

  afterEach(function () {
    jasper("restart");
  });

  it("should provide answer to return true challenge", function () {
    var feedback = jasper(function () {
      return true;
    });

    expect(feedback).not.toBe("Not quite try again.");
  });

  it("should provide answer to object literal challenge", function () {
    jasper("skip", 1);
    var feedback = jasper({
      a: 1,
      b: 1,
    });

    expect(feedback).not.toBe("Not quite try again.");
  });

  it("should provide answer to throw error challenge", function () {
    jasper("skip", 2);
    var feedback = jasper(function () {
      throw new Error("up");
    });

    expect(feedback).not.toBe("Not quite try again.");
  });

  it("should provide answer to JSON string challenge", function () {
    jasper("skip", 3);
    var json = JSON.stringify({
      do: "good",
    });
    var feedback = jasper(json);

    expect(feedback).not.toBe("Not quite try again.");
  });

  it("should provide answer to sum arguments challenge", function () {
    jasper("skip", 4);
    var feedback = jasper(function () {
      var sum = 0;
      for (var i = 0; i < arguments.length; i++) {
        sum += arguments[i];
      }

      return sum;
    });

    expect(feedback).not.toBe("Not quite try again.");
  });

  it("should provide answer to simple closure challenge", function () {
    jasper("skip", 5);
    var feedback = jasper(function (arg) {
      return function () {
        return arg;
      };
    });

    expect(feedback).not.toBe("Not quite try again.");
  });

  it("should provide answer to context change challenge", function () {
    jasper("skip", 6);
    var context = {
      a: 1,
    };

    var feedback = Jasper.call(context, context);

    expect(feedback).not.toBe("Not quite try again.");
  });

  it("should provide answer to prototype addition challenge", function () {
    jasper("skip", 7);

    var feedback = jasper(function (object) {
      object.prototype.jasper = function () {};
    });

    expect(feedback).not.toBe("Not quite try again.");
  });

  it("should provide answer to async challenge", function () {
    jasper("skip", 8);

    var feedback = jasper(function (object) {
      object.prototype.jasper = function () {};
    });

    expect(feedback).not.toBe("Not quite try again.");
  });
});
