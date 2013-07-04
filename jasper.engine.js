/* jshint laxcomma:true */

var Jasper = (function () {
  "use strict";

  var adjectives
    , isFunction = isType.bind(null, "function")
    , isString = isType.bind(null, "string")
    , levels = []
    , progress = 0
    , utils
    ;

  function isType (type, obj) {
    return (new RegExp(type, "i"))
      .test({}.toString.call(obj));
  }

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

  utils = {
    ask: function (intro, hint, fn) {
      var length = arguments.length;

      if (length > 0) {
        // Make second parameter optional
        if (2 === length) {
          fn      = hint;
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

        if (2 === length || 3 === length) {
          fn.intro   = intro;
          fn.hint = hint;
          levels.push(fn);
        }
      } else {
        // no arguments passed
        // lock the implementation so no more challenges can be added
        utils.lock();
      }
    }

    , help: function () {
      return progress < levels.length
        ? levels[progress]
          .intro
          .replace("#", 1 + progress)
        : "Congratulations you're done; start over with Jasper('reset').";
    }

    , hint: function (prepend) {
      console.log((prepend || "") + levels[progress].hint);

      if (!prepend) {
        return jasper_engine();
      }
    }

    , lock: function () {
      utils.ask = function () {
        throw new Error("Jasper has been locked, no new asks may be added.");
      };
    }

    , reset: function () {
      progress = 0;
      return "All clear; go again?";
    }

    , skip: function (num) {
      if (num < 0) {
        num = levels.length -1;
      }
      progress += (~~num || 1);
      return utils.help();
    }
  };

  // console.log("'Jasper' is waiting for you to, 'start'...");
  console.log("Level 0: Completed by opening your browser's console.\n" +
    "'Jasper' is waiting for 'start'. GL! HF!");

  function jasper_engine (command, arg) {
    /*jshint validthis:true*/
    // default to the 'help' util method
    command = command || "help";

    // run a util method if asked for or no arguments
    if (utils[command] || 0 === arguments.length) {
      // only pass the arguments if provided
      return arg
        ? utils[command]
          .apply(this, [].slice.call(arguments, 1))
        : utils[command]();
    } else {
      // if complete don't try and read off the end of the array
      if (progress !== levels.length) {
        try {
          // pass the arguments to the level function to check correctness
          if (levels[progress].apply(this, arguments)) {
            utils.hint(adjectives() + "\nLevel " + (progress) + ": ");
            progress++;
          } else {
            return "Not quite try again.";
          }
        } catch (e) {
          // TODO: log a helpful message?
          throw e;
        }
      }
    }

    // call the engine again to show the intro for the next ask
    return jasper_engine();
  }

  // hints to help people find the path to enlightenment
  jasper_engine.help =
  jasper_engine.start =
  jasper_engine.toString =
  function () {
    return jasper_engine();
  };

  return jasper_engine;
}());
