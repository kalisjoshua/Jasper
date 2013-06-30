/*jshint laxcomma:true*/

var Jasper = (function () {
  var levels
    , progress = 0
    , success
    , undef = (function (u) {return u;}())
    , utils
    ;

  function ask (intro, fn) {
    fn.intro = intro;

    return fn;
  }

  function fnError (e) {
    console.log("Ooops, did you pass a function?");
    console.error(e);
    return false;
  }

  success = (function () {
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

  levels = [
    ask("Call Jasper with one argument: 'start'.", function (str) {
      return "start" === str;
    })
    ,ask("Pass in a function that returns true.", function (cb) {
      try {
        return true === cb();
      } catch (e) {
        return fnError(e);
      }
    })
    ,ask("Provide an object with two properties: 'a' and 'b'.", function (obj) {
      return (undef !== obj.a && undef !== obj.b);
    })
    ,ask("Send a JSON string with a, 'good', 'do' property.", function (json) {
      try {
        return "good" === JSON.parse(json)["do"];
      } catch (e) {
        console.log("The JSON syntax seems to be invalid.");
        console.error(e);
        return false;
      }
    })
    ,ask("Write a function to sum any number of numbers.", function (fn) {
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

      try {
        return sum === fn.apply(null, inputs);
      } catch (e) {
        return fnError(e);
      }
    })
    // ,ask("", function () {})
  ];

  utils = {
    help: function () {
      return progress < levels.length
        ? levels[progress].intro
        : "Congratulations you're done; start over with Jasper('reset').";
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

  console.log("'Jasper' is waiting, for you to 'start'...");

  return function jasper_engine (command, arg) {
    // run a util method if asked for or no arguments
    if (utils[command] || 0 === arguments.length) {
      // default to the 'help' util method
      return utils[command || "help"](arg);
    } else {
      // if complete don't try and read off the end of the array
      if (progress !== levels.length) {
        // pass the arguments to the level function to check correctness
        if (levels[progress].apply(null, arguments)) {
          progress++;
          console.log(success());
        } else {
          return "Not quite try again.";
        }
      }
    }

    return jasper_engine();
  };
}());