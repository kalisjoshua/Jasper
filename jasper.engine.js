/* jshint laxcomma:true */

var Jasper = (function () {
  "use strict";

  var adjectives

    // indicators of success in answering the ask
    , answered = []

    , API

    // attic will hold versions of the levels array that have been emptied
    , attic = []

    // check isType description for more details about these functions
    // , isFunction = isType.bind(null, "function") // Phantom hates bind? :(
    // , isString = isType.bind(null, "string")     // Phantom hates bind? :(
    , isFunction = apply_one(isType, "function") // taking advantage of hoisting
    , isString = apply_one(isType, "string")     // taking advantage of hoisting

    // levels will hold all asks given to Jasper
    , levels = []

    // lock indicates if asks can be added or not
    , lock = false

    // progress is the current position of the user within the levels array
    , progress = 0
    ;

  // Phantom hates Function.prototype.bind :(
  /**
   * Apply the first argument of a function
   *
   * @param  {Function} fn
   *         The function partially apply
   *
   * @param  {String}   type
   *         The type to check against
   *
   * @return {true|false}
   */
  function apply_one (fn, type) {
    return function (obj) {
        return fn(type, obj);
      };
  }

  /**
   * Deterime if argument is a number
   *
   * @param  {anything}  n
   *
   * @return {Boolean}
   *
   */
  function isNumber (n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  /**
   * Test an object type against a string as a regex
   *
   * @param  {string}  type
   *         A string to be tested against the object type
   *
   * @param  {Object}  obj
   *         Any object to be inspected
   *
   * @return {Boolean}
   */
  function isType (type, obj) {
    return (new RegExp(type, "i"))
      .test({}.toString.call(obj));
  }

  /**
   * Randomize a list of congratulatory adjectives
   *
   * @return {String}
   */
  adjectives = (function () {
    var length, words;

    words = ("Admirable Awesome Brilliant Capital Excellent Fabulous " +
      "Fantabulous Glorious Good Great Impressive Keen Magnificent " +
      "Outstanding Resplendent Splendid Splendiferous Superb Superior " +
      "Swanky")
      .split(" ");

    length = words.length;

    return function () {
      var indx = ~~(Math.random() * length) % length;

      words = words
        .slice(indx)
        .concat(words.slice(0, indx));

      return ("%" + ["!", "."][~~(Math.random() * 2)])
        .replace("%", words[0]);
    };
  }());

  /**
   * Namespace for the API allowing for lookup in jasper_engine
   *
   * @type {Object}
   */
  API = {
    /**
     * Register a new ask (challenge) with Jasper to extend the fun
     *
     * @param  {String}   intro
     *         An introductory (ambiguous) description of what the ask is asking
     *
     * @param  {String}   hint
     *         A more explicit text to describe the ask specifically
     *
     * @param  {Function} fn
     *         The body of the challenge
     *
     * @return undefined
     */
    ask: function api_ask (intro, hint, fn) {
      if (!!lock) {
        throw new Error("Jasper has been locked, no new asks may be added.");
      }

      var length = arguments.length;

      if (length > 0) {
        // Make second parameter optional
        if (2 === length) {
          fn = hint;
          hint = "";
        }

        if (!isString(intro)) {
          throw new Error("Intro text must be a String.");
        }

        if (!isString(hint)) {
          throw new Error("Hint text must be a String.");
        }

        if (!isFunction(fn)) {
          throw new Error("Challenge must be a Function.");
        }

        fn.intro = intro;
        fn.hint = hint;
        levels.push(fn);
      } else {
        // no arguments passed
        // lock the implementation so no more asks can be added
        lock = true;
      }
    }

    /**
     * Remove all asks to start from scratch
     * This must be executed with a context of 'true' to prevent accidental call
     *
     * @param  {true}         arg
     *         Passing anything other than true will throw an error
     *
     * @param  {true|falsey}  atticToo
     *         Passing truthy will empty the attic array; testing only probably
     *
     * @return undefined
     */
    , empty: function api_empty (arg, atticToo) {
      if (true === arg) {
        if (levels.length && !atticToo) {
          attic.push(levels);
        }

        if (atticToo) {
          attic = [];
        }

        levels = [];
        lock = false;
        API.restart();
      } else {
        throw new Error("Empty must be passed first_argument === 'true'.");
      }
    }

    // , extras: function () {
    //   // global variables: help, start, hint, jasper
    //   // to evaluate as a call to Jasper("hint") via valueOf/toString
    // }

    /**
     * Show the current level's intro text
     *
     * @return {String}
     *         The intro text of the current level, or the end text
     */
    , help: function api_help (prepend) {
      return progress < levels.length && false !== answered[progress]
        ? levels[progress]
          .intro
          .replace("#", 1 + progress)
        : "\nCongratulations you're done; start over with Jasper('restart').";
    }

    /**
     * Show the current level's hint text
     *
     * @param  {String} prepend
     *         Optional addition text to add to the output to be more explanatory
     *
     * @return {String}
     *         The resulting string to be output
     */
    , hint: function api_hint (prepend) {
      return (prepend || "") +
        levels[progress].hint +
        (prepend ? "\n" + API.help() : "");
    }

    /**
     * Start the asks/challenges over again
     *
     * @return {String}
     *         Message telling the user they are ready to go again
     */
    , restart: function api_restart () {
      answered = [];
      progress = 0;
      return "All clear; go for it!\n" + API.help();
    }

    /**
     * Restore previously emptied asks
     * This must be executed with a context of 'true' to prevent accidental call
     *
     * @param  {true}     arg
     *         Passing anything other than true will throw an error
     *
     * @return undefined
     */
    , restore: function api_restore (arg) {
      if (true === arg) {
        if (attic.length) {
          levels = attic.pop();
        } else {
          throw new Error("Restore called with no history to restore.");
        }

        return API.restart();
      } else {
        throw new Error("Restore must be passed first_argument === 'true'.");
      }
    }

    /**
     * Skip to an ask/challenge without completing the current on
     *
     * @param  {Integer} num
     *         A positive number skips forward from the current location -
     *         'progress', negative moves backward
     *
     * @return {String}
     *         The help text for the next ask/challenge
     */
    , skip: function api_skip (search) {
      var len;

      if (void 0 === search || isNumber(search)) {
        if (0 === +search) {
          throw new Error("Why would you want to skip to where you are? " +
            "Zero passed to Jasper('skip').");
        }

        // default to 'skipping' one ask forward
        search = search || 1;

        // if previously answered dont't penalize for skipping
        answered[progress] = answered[progress] || false;

        // make sure to skip in bounds
        progress = (progress + ~~search) % levels.length;
      } else {
        throw new Error("Skip needs a number to skip to, " +
          "or a string to search for; '%' doesn't work."
          .replace("%", search));
      }

      return API.help();
    }
  };

  /** Command Pattern - Manager
   * Process user interactions and manage state
   *
   * @param  {String} command
   *         API method to invoke or (attempted) answer to level
   *
   * @param  {[anything?]} arg
   *         The first additional argument
   *
   * @return {String}
   *         Prompt for the user to take next steps
   *
   */
  function jasper_engine (command, arg) {
    /*jshint validthis:true*/
    var result;

    // default to the 'help' util method
    command = command || "help";

    // run a util method if asked for or no arguments
    if (API[command] || 0 === arguments.length) {
      // only pass the arguments if provided; zero is a valid argument sometimes
      result = (arg || 0 === arg)
        ? API[command].apply(this, [].slice.call(arguments, 1))
        : API[command].call(this);
    } else {
      try {
        // pass the arguments to the level function to check correctness
        if (levels[progress].apply(this, arguments)) {
          answered[progress] = true;

          result = API.hint(adjectives() + "\nLevel " + (progress) + ": ");

          progress++;

          result += "\n\n" + API.help();
        } else {
          result = "Not quite try again.";
        }
      } catch (e) {
        if (/not\sa\sfunction/i.test(e.message)) {
          result = "Remember that time I told you to pass a function?";
        } else if (/JSON/i.test(e.message)) {
          result = "The JSON string needs to be properly formatted.";
        } else {
          result = "I'm not sure at all what you are trying to do.";
        }

        throw e;
      }
    }

    return result;
  }

  // hints to help people find the path to enlightenment
  jasper_engine.help =
  jasper_engine.start =
  jasper_engine.toString =
  function () {
    return jasper_engine();
  };

  console.log("Level 0: Completed by opening your browser's console.\n" +
    "'Jasper' is waiting for 'start'. GL! HF!");

  return jasper_engine;
}());
