/* jshint laxcomma:true */
describe("Jasper engine", function() {
  "use strict";
  var jasper = Jasper
    , ENDMSG = "\nCongratulations you're done; start over with Jasper('restart')."
    , NOTQUITE = "Not quite try again."
    , TESTFN = function () {return true;}
    , TESTASYNCFN = function (done) { setTimeout(done,1000); }
    , TESTING = "TESTING!";

  function addTestingAsk (str) {
    jasper("ask", str, "help " + str, TESTFN);
  }

  beforeEach(function () {
    jasper("empty", true);
  });

  afterEach(function() {
    jasper("restart");
  });

  describe("Jasper()", function () {
    it("should show end message text (ENDMSG) if no asks and empty call", function() {
      expect(jasper()).toBe(ENDMSG);
    });

    it("should show TESTING text if TESTING task and empty call", function() {
      addTestingAsk(TESTING);
      expect(jasper()).toBe(TESTING);
      expect(jasper()).not.toBe(ENDMSG);
    });
  });

  describe("Jasper('ask')", function () {
    var NOHELP = "No help text";

    it("should allow for adding asks", function () {
      expect(function () {

        addTestingAsk(TESTING);

      }).not.toThrow();
    });

    it("should accept asks without optional argument(s)", function() {
      expect(jasper()).toBe(ENDMSG);

      jasper("ask", NOHELP, TESTFN);

      expect(jasper("help")).toBe(NOHELP);
    });

    it("should throw an error if locked and ask added", function() {
      // lock the Jasper asks
      jasper("ask");

      expect(function () {

        // try and add a new ask
        jasper("ask"
          , NOHELP, function () {
            return true;
          });

      }).toThrow();
    });

    it("should throw an error if a bad intro is given", function() {
      expect(function () {

        jasper("ask"
          , 1234
          , function () {
            return true;
          });

      }).toThrow();
    });

    it("should throw an error if a bad hint is given", function() {
      expect(function () {

        jasper("ask"
          , "1234"
          , 1234
          , function () {
            return true;
          });

      }).toThrow();
    });

    it("should throw an error if a bad execution function is given", function() {
      expect(function () {

        jasper("ask"
          , "1234"
          , 1234);

      }).toThrow();
    });

    it("should throw an error if a bad async timeout is given", function() {
      expect(function () {

        jasper("ask"
          , "1234"
          , 1234
          , function () {
            return true;
          }
          , "");

      }).toThrow();
    });
  });

  describe("Jasper('empty')", function () {
    it("should throw an error if true is not passed", function () {
      expect(function () {

        // no true value passed
        jasper("empty");

      }).toThrow();

      expect(function () {

        // truthy values don't count
        jasper("empty", "true");

      }).toThrow();

      expect(function () {

        // truthy values don't count
        jasper("empty", 1);

      }).toThrow();
    });
  });

  describe("Jasper('help')", function () {
    it("should show end message text (ENDMSG) if no asks", function() {

      expect(jasper("help")).toBe(ENDMSG);

    });

    it("should return 'introductory text'", function () {

      var introText = "introductory text";

      jasper("ask", introText, TESTFN);

      expect(jasper("help")).toBe(introText);

    });

    it("should show end message text (ENDMSG) if no asks - using help aliases", function() {

      // expect(jasper.help).toBe(ENDMSG); // Jasmine doesn't do this :(
      // expect(jasper.start).toBe(ENDMSG); // Jasmine doesn't do this :(
      expect(jasper.toString()).toBe(ENDMSG);

    });
  });

  describe("Jasper('hint')", function () {
    it("should return 'hint hint, nudge nudge\\nintroductory text' - NO prepended value", function () {

      var hint = "hint hint, nudge nudge"
        , intro = "introductory text";

      jasper("ask", intro, hint, TESTFN);

      expect(jasper("hint")).toBe(hint);

    });

    it("should return 'hint hint, nudge nudge\\nintroductory text' - NO prepended value", function () {

      var hint = "hint hint, nudge nudge"
        , intro = "introductory text"
        , prepend = "Hot Dog! ";

      jasper("ask", intro + 1, hint, TESTFN);
      jasper("ask", intro + 2, hint, TESTFN);

      expect(jasper("hint", prepend)).toBe(prepend + hint + "\n" + intro + 2);

    });
  });

  describe("Jasper('restart')", function () {
    it("should show 'All clear; go again?'", function() {

      expect(jasper('restart')).toBe("All clear; go for it!\n" + jasper("help"));

    });
  });

  describe("Jasper('restore')", function () {
    it("should throw an error when called without true argument", function() {

      var intro = "Scooby Doo";

      jasper("ask", intro, TESTFN);

      jasper("empty", true);

      expect(function () {
        jasper("restore");
      }).toThrow();

    });

    it("should throw an error when there is no history to restore", function() {

      jasper("empty", true, true);

      expect(function () {
        jasper("restore", true);
      }).toThrow();

    });

    it("should restore emptied asks", function() {

      var intro = "intro";

      jasper("ask", intro, TESTFN);

      jasper("empty", true);

      expect(jasper("restore", true)).toBe("All clear; go for it!\n" + intro);

    });
  });

  describe("Jasper('skip')", function () {
    it("should show end message text (ENDMSG) if no asks at all", function() {

      expect(jasper("skip")).toBe(ENDMSG);

    });

    it("should show end message text (ENDMSG) if only ask complete", function() {

      addTestingAsk(TESTING);

      expect(jasper("skip")).toBe(ENDMSG);

    });

    it("should show end message text (ENDMSG) if all asks complete", function() {

      addTestingAsk(TESTING);
      addTestingAsk(TESTING);
      addTestingAsk(TESTING);

      jasper("skip");
      jasper("skip");
      jasper("skip");

      expect(jasper("help")).toBe(ENDMSG);

    });

    it("should throw an error when called with non-index argument", function() {

      expect(function () {
        jasper("skip", "a");
      }).toThrow();

      expect(function () {
        jasper("skip", {toString: ""});
      }).toThrow();

    });

    it("should throw an error when called to skip zero", function() {

      expect(function () {
        jasper("skip", 0); // SyntaxError: Parse error
      }).toThrow();

    });
  });

  it('should tell when answer is wrong', function() {

    jasper("ask", TESTING, function () {
      return false;
    });

    expect(jasper("My answer is...")).toBe(NOTQUITE);

  });

  it('should throw an error when attempting to call a non-function as a function', function() {

    jasper("ask", TESTING, function (fn) {
      return fn();
    });

    expect(function () {
      jasper("My answer is...");
    }).toThrow();

  });

  it('should throw an error when attempting to parse invalid JSON', function() {

    jasper("ask", TESTING, function (str) {
      return JSON.parse(str);
    });

    expect(function () {
      jasper("My answer is...");
    }).toThrow();

  });

  it('should log a helpful error when an unknown error happens', function() {

    jasper("ask", TESTING, function (str) {
      throw new Error("Boobaloo!");
    });

    expect(function () {
      jasper("My answer is...");
    }).toThrow();

  });

  it("should show congratulatory adjective and level number when answered correctly", function() {

    jasper("ask", "Sample ask 1", "Do anything but call an API method.", TESTFN);
    jasper("ask", "Sample ask 2", "Do anything but call an API method.", TESTFN);

    var result = jasper(/regex is fun/);

    expect(result).not.toBe("Sample ask 2");

    expect(result).toMatch(/\nLevel\s+\d+:\s+/);

    result = jasper("Finish him.");

    expect(result).not.toBe("Sample ask 2");

    expect(result).toMatch(/\nLevel\s+\d+:\s+/);
    expect(result).toMatch(/Congratulations/);

  });

  it("should tell when tests are asynchronous", function() {

    jasper("ask", "Sample ask 1", "Do anything but call an API method.", TESTASYNCFN, 500);

    var result = jasper('test');

    expect(result).toBe("[Asynchronous level] Waiting for the result...");

  });

  it("should timeout when tests are asynchronous and filled too late", function(done) {

    jasper("ask", "Sample ask 2", "Do anything but call an API method.", TESTASYNCFN, 1500);

    jasper('test');

		setTimeout(function() {
			var result = jasper();
    	expect(result).toBe("Sample ask 2");
		},1501);

  });

  it("should work when tests are asynchronous and filled in time", function(done) {

    jasper("ask", "Sample ask 1", "Do anything but call an API method.", TESTASYNCFN, 1500);
    jasper("ask", "Sample ask 2", "Do anything but call an API method.", TESTFN);

    jasper('test');

		setTimeout(function() {
			var result = jasper();
    	expect(result).toBe("Sample ask 2");
		},1501);

  });

  // it('should go to before last question if skip is negative', function() {
  //   var feedBack = jasper('skip', -10);
  //   expect(feedBack).toBe("Add a 'jasper' method to the prototype of the object passed to the function your write.");
  // });
});
