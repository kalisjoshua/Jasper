import { Jasper } from "./jasper.engine.mjs";

jest.spyOn(console, "log").mockImplementation(() => {});

describe("Jasper engine", () => {
  const ENDMSG =
    "\n Congratulations you're done; start over with Jasper('restart').";
  const NOTQUITE = "Not quite try again.\n\n";
  const TESTFN = () => true;
  const TESTING = "TESTING!";

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
    it("should show end message text (ENDMSG) if no asks and empty call", async function () {
      expect(await Jasper()).toBe(ENDMSG);
    });

    it("should show TESTING text if TESTING task and empty call", async function () {
      addTestingAsk(TESTING);
      expect(await Jasper()).toBe(TESTING);
      expect(await Jasper()).not.toBe(ENDMSG);
    });

    it("should show a success message", async function () {
      await Jasper("ask", "intro", "hint", () => true);
      await Jasper("ask", "intro", "hint", () => true);

      expect(await Jasper("anything")).toMatch(/Next Task:/);
    });

    it("should display customized error messages - about a function", async function () {
      const error = new Error("not a function");

      await Jasper("ask", "", "", () => {
        throw error;
      });

      await expect(Jasper(1234)).rejects.toEqual({
        error,
        message: "Remember that time you were asked to pass a function?",
      });
    });

    it("should display customized error messages - about a JSON", async function () {
      const error = new Error("bad JSON");

      await Jasper("ask", "", "", () => {
        throw error;
      });

      await expect(Jasper(1234)).rejects.toEqual({
        error,
        message: "The JSON string needs to be properly formatted.",
      });
    });

    it("should display customized error messages - not a clue", async function () {
      const error = new Error("not a clue");

      await Jasper("ask", "", "", () => {
        throw error;
      });

      await expect(Jasper(1234)).rejects.toEqual({
        error,
        message: "It's a little unclear what you are trying to do.",
      });
    });

    it("should publish events", async function () {
      const expected = 1234;
      const fn = (ans) => {
        return ans === expected;
      };
      let published = false;
      const sub = (event) => {
        published = event;
      };

      await Jasper("ask", "", "", fn);
      await Jasper("listen", sub);

      expect(published).toEqual({
        challenge: {
          info: fn,
          level: 0,
        },
        invocation: {
          args: [sub],
          command: "listen",
        },
      });

      expect(await Jasper(1111)).toBe(NOTQUITE);
      expect(published).toEqual({
        challenge: {
          info: fn,
          level: 0,
        },
        invocation: {
          args: [],
          command: 1111,
        },
        result: false,
      });

      expect(await Jasper(expected)).toBe(ENDMSG);
    });
  });

  describe("Jasper('ask')", function () {
    var NOHELP = "No help text";

    it("should allow for adding asks", function () {
      expect(function () {
        addTestingAsk(TESTING);
      }).not.toThrow();
    });

    it("should accept asks without optional argument(s)", async function () {
      expect(await Jasper()).toBe(ENDMSG);

      Jasper("ask", NOHELP, TESTFN);

      expect(await Jasper("help")).toBe(NOHELP);
    });

    it("should throw an error if attempting to add an ask after being locked", async function () {
      // lock the Jasper asks
      await Jasper("ask");

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
  });

  describe("Jasper('ampty')", function () {
    it("should throw if not provided a `true` argument", function () {
      expect(() => {
        Jasper("empty");
      }).toThrow("Empty must be passed first_argument === 'true'.");
    });
  });

  describe("Jasper('help')", function () {
    it("should show end message text (ENDMSG) if no asks", async function () {
      expect(await Jasper("help")).toBe(ENDMSG);
    });

    it("should return 'introductory text'", async function () {
      var introText = "introductory text";

      await Jasper("ask", introText, TESTFN);

      expect(await Jasper("help")).toBe(introText);
    });

    it("should show end message text (ENDMSG) if no asks - using help aliases", async function () {
      // expect(jasper.help).toBe(ENDMSG); // Jasmine doesn't do this :(
      // expect(jasper.start).toBe(ENDMSG); // Jasmine doesn't do this :(
      expect(await Jasper.toString()).toBe(ENDMSG);
    });
  });

  describe("Jasper('hint')", function () {
    it("should return 'hint hint, nudge nudge\\nintroductory text' - NO prepended value", async function () {
      var hint = "hint hint, nudge nudge",
        intro = "introductory text";

      await Jasper("ask", intro, hint, TESTFN);

      expect(await Jasper("hint")).toBe(hint);
    });

    it("should return 'hint hint, nudge nudge\\nintroductory text' - prepended value", async function () {
      var hint = "hint hint, nudge nudge",
        intro = "introductory text",
        prepend = "Hot Dog! ";

      await Jasper("ask", intro + 1, hint, TESTFN);
      await Jasper("ask", intro + 2, hint, TESTFN);

      expect(await Jasper("hint", prepend)).toBe(
        prepend + hint + "\n " + intro + 2,
      );
    });
  });

  describe("Jasper('restart')", function () {
    it("should show 'All clear; go again?'", async function () {
      expect(await Jasper("restart")).toBe(
        "All clear; go for it!\n " + (await Jasper("help")),
      );
    });
  });

  describe("Jasper('skip')", function () {
    it("should show end message text (ENDMSG) if no asks at all", async function () {
      expect(await Jasper("skip")).toBe(ENDMSG);
    });

    it("should show end message text (ENDMSG) if only ask complete", async function () {
      addTestingAsk(TESTING);

      expect(await Jasper("skip")).toBe(ENDMSG);
    });

    it("should show end message text (ENDMSG) if all asks complete", async function () {
      addTestingAsk(TESTING);
      addTestingAsk(TESTING);
      addTestingAsk(TESTING);

      await Jasper("skip");
      await Jasper("skip");
      await Jasper("skip");

      expect(await Jasper("help")).toBe(ENDMSG);
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

  it("should tell when answer is wrong", async function () {
    await Jasper("ask", TESTING, function () {
      return false;
    });

    expect(await Jasper("My answer is...")).toBe(NOTQUITE + TESTING);
  });
});
