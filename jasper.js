/*jshint laxcomma:true*/

var Jasper = (function () {
  "use strict";

  var adjectives
    , levels = []
    , progress = 0
    , utils
    ;

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
    ask: function (intro, fn) {
      switch (arguments.length) {
        case 2:
          fn.intro = intro;
          levels.push(fn);
          break;
        case 1:
          // not sure what to do here yet, but it'll come to me
          break;
        default:
          utils.lock();
          break;
      }
    }

    , help: function () {
      return progress < levels.length
        ? levels[progress].intro
        : "Congratulations you're done; start over with Jasper('reset').";
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

  console.log("'Jasper' is waiting for you to, 'start'...");

  function jasper_engine (command, arg) {
    /*jshint validthis:true*/
    // default to the 'help' util method
    command = command || "help";

    // run a util method if asked for or no arguments
    if (utils[command] || 0 === arguments.length) {
      // only pass the arguments if provided
      return arg ? utils[command].apply(this, [].slice.call(arguments, 1)) : utils[command]();
    } else {
      // if complete don't try and read off the end of the array
      if (progress !== levels.length) {
        try {
          // pass the arguments to the level function to check correctness
          if (levels[progress].apply(this, arguments)) {
            progress++;
            console.log(adjectives());
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


Jasper("ask", "Call Jasper with one argument: 'start'.", function (str) {
  return "start" === str;
});

Jasper("ask", "Pass in a function that returns true.", function (cb) {
  return true === cb();
});

Jasper("ask", "Provide an object with two properties: 'a' and 'b'.", function (obj) {
  return ((void 0) !== obj.a && (void 0) !== obj.b);
});

Jasper("ask", "Send a JSON string that has a property 'do' with the value 'good'", function (json) {
  return "good" === JSON.parse(json)["do"];
});

Jasper("ask", "Write a function to sum any number of number arguments.", function (fn) {
  var inputs
    , sum = 0;

  // build a random length array with random values
  inputs = Array
    // random length array
    .apply(null, Array(~~(Math.random() * 32)))
    .map(function () {
      // with random values
      var num = ~~(Math.random() * 1024);

      // caching the sum to test the results
      sum += num;

      return num;
    });

  return sum === fn.apply(null, inputs);
});

Jasper("ask", "Write a function that takes an argument and returns a function that returns that argument.", function (fn) {
  return [42, "good stuff", /asdf/]
    .reduce(function (acc, arg) {
      return acc && fn(arg)() === arg;
    }, true);
});

Jasper("ask", "Execute Jasper with a context that matches its argument.", function (arg) {
  return this == arg;
});

Jasper("ask", "Add a 'jasper' method to the prototype of the object passed to the function your write.", function (fn) {
  function F () {}

  var obj = new F();

  fn(F);

  return obj.jasper && /function/i.test({}.toString.call(obj.jasper)) && !obj.hasOwnProperty("jasper");
});

// Jasper("ask", "", function () {});

Jasper("ask"); // lock the list of asks