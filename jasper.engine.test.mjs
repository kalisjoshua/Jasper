import { Jasper } from "./jasper.engine.mjs";

jest.spyOn(console, "log").mockImplementation(() => {});

describe("Jasper engine", () => {
  const ENDMSG =
    "\n Congratulations you're done; start over with Jasper('restart').";
  const NOTQUITE = "Not quite try again.";
  const TESTFN = () => true;
  const TESTING = "TESTING!";

  function TESTASYNCFN(done) {
    setTimeout(done, 1000);
  }

  function addTestingAsk(str) {
    Jasper("ask", str, "help " + str, TESTFN);
  }

  afterEach(function () {
    Jasper("restart");
  });

  beforeEach(function () {
    Jasper("empty", true);
  });

  describe("Jasper()", function () {
    it("should show end message text (ENDMSG) if no asks and empty call", function () {
      expect(Jasper()).toBe(ENDMSG);
    });

    it("should show TESTING text if TESTING task and empty call", function () {
      addTestingAsk(TESTING);
      expect(Jasper()).toBe(TESTING);
      expect(Jasper()).not.toBe(ENDMSG);
    });
  });

  describe("Jasper('ask')", function () {
    var NOHELP = "No help text";

    it("should allow for adding asks", function () {
      expect(function () {
        addTestingAsk(TESTING);
      }).not.toThrow();
    });

    it("should accept asks without optional argument(s)", function () {
      expect(Jasper()).toBe(ENDMSG);

      Jasper("ask", NOHELP, TESTFN);

      expect(Jasper("help")).toBe(NOHELP);
    });

    it("should throw an error if locked and ask added", function () {
      // lock the Jasper asks
      Jasper("ask");

      expect(function () {
        // try and add a new ask
        Jasper("ask", NOHELP, function () {
          return true;
        });
      }).toThrow();
    });

    it("should throw an error if a bad intro is given", function () {
      expect(function () {
        Jasper("ask", 1234, function () {
          return true;
        });
      }).toThrow();
    });

    it("should throw an error if a bad hint is given", function () {
      expect(function () {
        Jasper("ask", "1234", 1234, function () {
          return true;
        });
      }).toThrow();
    });

    it("should throw an error if a bad execution function is given", function () {
      expect(function () {
        Jasper("ask", "1234", 1234);
      }).toThrow();
    });

    it("should throw an error if a bad async timeout is given", function () {
      expect(function () {
        Jasper(
          "ask",
          "1234",
          1234,
          function () {
            return true;
          },
          "",
        );
      }).toThrow();
    });
  });

  describe("Jasper('empty')", function () {
    it("should throw an error if true is not passed", function () {
      expect(function () {
        // no true value passed
        Jasper("empty");
      }).toThrow();

      expect(function () {
        // truthy values don't count
        Jasper("empty", "true");
      }).toThrow();

      expect(function () {
        // truthy values don't count
        Jasper("empty", 1);
      }).toThrow();
    });
  });

  describe("Jasper('help')", function () {
    it("should show end message text (ENDMSG) if no asks", function () {
      expect(Jasper("help")).toBe(ENDMSG);
    });

    it("should return 'introductory text'", function () {
      var introText = "introductory text";

      Jasper("ask", introText, TESTFN);

      expect(Jasper("help")).toBe(introText);
    });

    it("should show end message text (ENDMSG) if no asks - using help aliases", function () {
      // expect(jasper.help).toBe(ENDMSG); // Jasmine doesn't do this :(
      // expect(jasper.start).toBe(ENDMSG); // Jasmine doesn't do this :(
      expect(Jasper.toString()).toBe(ENDMSG);
    });
  });

  describe("Jasper('hint')", function () {
    it("should return 'hint hint, nudge nudge\\nintroductory text' - NO prepended value", function () {
      var hint = "hint hint, nudge nudge",
        intro = "introductory text";

      Jasper("ask", intro, hint, TESTFN);

      expect(Jasper("hint")).toBe(hint);
    });

    it("should return 'hint hint, nudge nudge\\nintroductory text' - prepended value", function () {
      var hint = "hint hint, nudge nudge",
        intro = "introductory text",
        prepend = "Hot Dog! ";

      Jasper("ask", intro + 1, hint, TESTFN);
      Jasper("ask", intro + 2, hint, TESTFN);

      expect(Jasper("hint", prepend)).toBe(prepend + hint + "\n " + intro + 2);
    });
  });

  describe("Jasper('restart')", function () {
    it("should show 'All clear; go again?'", function () {
      expect(Jasper("restart")).toBe(
        "All clear; go for it!\n " + Jasper("help"),
      );
    });
  });

  describe("Jasper('restore')", function () {
    it("should throw an error when called without true argument", function () {
      var intro = "Scooby Doo";

      Jasper("ask", intro, TESTFN);

      Jasper("empty", true);

      expect(function () {
        Jasper("restore");
      }).toThrow();
    });

    it("should throw an error when there is no history to restore", function () {
      Jasper("empty", true, true);

      expect(function () {
        Jasper("restore", true);
      }).toThrow();
    });

    it("should restore emptied asks", function () {
      var intro = "intro";

      Jasper("ask", intro, TESTFN);

      Jasper("empty", true);

      expect(Jasper("restore", true)).toBe("All clear; go for it!\n " + intro);
    });
  });

  describe("Jasper('skip')", function () {
    it("should show end message text (ENDMSG) if no asks at all", function () {
      expect(Jasper("skip")).toBe(ENDMSG);
    });

    it("should show end message text (ENDMSG) if only ask complete", function () {
      addTestingAsk(TESTING);

      expect(Jasper("skip")).toBe(ENDMSG);
    });

    it("should show end message text (ENDMSG) if all asks complete", function () {
      addTestingAsk(TESTING);
      addTestingAsk(TESTING);
      addTestingAsk(TESTING);

      Jasper("skip");
      Jasper("skip");
      Jasper("skip");

      expect(Jasper("help")).toBe(ENDMSG);
    });

    it("should throw an error when called with non-index argument", function () {
      expect(function () {
        Jasper("skip", "a");
      }).toThrow();

      expect(function () {
        Jasper("skip", { toString: "" });
      }).toThrow();
    });

    it("should throw an error when called to skip zero", function () {
      expect(function () {
        Jasper("skip", 0); // SyntaxError: Parse error
      }).toThrow();
    });
  });

  it("should tell when answer is wrong", function () {
    Jasper("ask", TESTING, function () {
      return false;
    });

    expect(Jasper("My answer is...")).toBe(NOTQUITE);
  });

  it("should throw an error when attempting to call a non-function as a function", function () {
    Jasper("ask", TESTING, function (fn) {
      return fn();
    });

    expect(function () {
      Jasper("My answer is...");
    }).toThrow();
  });

  it("should throw an error when attempting to parse invalid JSON", function () {
    Jasper("ask", TESTING, function (str) {
      return JSON.parse(str);
    });

    expect(function () {
      Jasper("My answer is...");
    }).toThrow();
  });

  it("should log a helpful error when an unknown error happens", function () {
    Jasper("ask", TESTING, function (str) {
      throw new Error("Boobaloo!");
    });

    expect(function () {
      Jasper("My answer is...");
    }).toThrow();
  });

  it("should show congratulatory adjective and level number when answered correctly", function () {
    Jasper(
      "ask",
      "Sample ask 1",
      "Do anything but call an API method.",
      TESTFN,
    );
    Jasper(
      "ask",
      "Sample ask 2",
      "Do anything but call an API method.",
      TESTFN,
    );

    var result = Jasper(/regex is fun/);

    expect(result).not.toBe("Sample ask 2");

    expect(result).toMatch(/Level\s+\d+:\s+/);

    result = Jasper("Finish him.");

    expect(result).not.toBe("Sample ask 2");

    expect(result).toMatch(/Level\s+\d+:\s+/);
    expect(result).toMatch(/Congratulations/);
  });

  it.skip("should tell when tests are asynchronous", function () {
    Jasper(
      "ask",
      "Sample ask 1",
      "Do anything but call an API method.",
      TESTASYNCFN,
      500,
    );

    var result = Jasper("test");

    expect(result).toBe("[Asynchronous level] Waiting for the result...");
  });

  it.skip("should timeout when tests are asynchronous and filled too late", function (done) {
    Jasper(
      "ask",
      "Sample ask 2",
      "Do anything but call an API method.",
      TESTASYNCFN,
      1500,
    );

    Jasper("test");

    setTimeout(function () {
      var result = Jasper();
      expect(result).toBe("Sample ask 2");
    }, 1501);
  });

  it.skip("should work when tests are asynchronous and filled in time", function (done) {
    Jasper(
      "ask",
      "Sample ask 1",
      "Do anything but call an API method.",
      TESTASYNCFN,
      1500,
    );
    Jasper(
      "ask",
      "Sample ask 2",
      "Do anything but call an API method.",
      TESTFN,
    );

    Jasper("test");

    setTimeout(function () {
      var result = Jasper();
      expect(result).toBe("Sample ask 2");
    }, 1501);
  });

  // it('should go to before last question if skip is negative', function() {
  //   var feedBack = Jasper('skip', -10);
  //   expect(feedBack).toBe("Add a 'jasper' method to the prototype of the object passed to the function your write.");
  // });
  // */
});
