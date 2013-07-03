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

            if ( 1 === progress ) {
              console.log(adjectives() + ' Level 1 was to open your console and initialize Jasper. GL! HF!');
            } else {
              console.log(adjectives());
            }            
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
