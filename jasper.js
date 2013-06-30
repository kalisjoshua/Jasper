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
      return (/start/i).test(str);
    })
    ,ask("Pass in a function that returns true.", function (cb) {
      try {
        return true === cb();
      } catch (e) {
        console.log("Ooops, did you pass a function?");
        console.error(e);
        return false;
      }
    })
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
      progress += (~~num || 1);
      return utils.help();
    }
  };

  console.log("Jasper is waiting, for you to start...");

  return function jasper_engine (arg) {
    // run a util method if asked for or no arguments
    if (utils[arg] || 0 === arguments.length) {
      // default to the 'help' util method
      return utils[arg || "help"]();
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