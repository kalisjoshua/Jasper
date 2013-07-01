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
    throw e;
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
    ,ask("Send a JSON string that has a property 'do' with the value 'good'", function (json) {
      try {
        return "good" === JSON.parse(json)["do"];
      } catch (e) {
        console.log("The JSON syntax seems to be invalid.");
        console.error(e);
        return false;
      }
    })
    ,ask("Write a function to sum any number of number arguments.", function (fn) {
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
    ,ask("Write a funciton that takes an argument and returns a function that returns that argument.", function (fn) {
      try {
        return [42, "good stuff", /asdf/]
          .reduce(function (acc, arg) {
            return acc && fn(arg)() === arg;
          }, true);
      } catch (e) {
        return fnError(e);
      }
    })
    ,ask("Execute Jasper with a context that matches its argument.", function (arg) {
      return this == arg;
    })
    ,ask("Add a 'jasper' method to the prototype of the object passed to the function your write.", function (fn) {
      function F () {}

      var obj = new F();

      try {
        fn(F);
      } catch (e) {
        return fnError(e);
      }

      return obj.jasper && /function/i.test({}.toString.call(obj.jasper)) && !obj.hasOwnProperty("jasper");
    })
    ,ask("Write a function that will accept two values, if two parameters are passed it will add them together, but if one parameter is passed (x) it will return a function that will expect an other parameter (y) and add the two parameters together (x + y)", function (fn) {
    
        // Prepare the test data, and actual results
        var x = ~~(Math.random()*100),
            y = ~~(Math.random()*100),
            expectedResult = (x+y),
            additionResult = 0,
            fn1Result,
            fn2Result;
       
        try {
            // Case1: pass the 2 parameters
            additionResult = fn(x,y);
        } catch (e) {
            return fnError(e);
        }
        
        try {
            // Case2: First pass only 1 parameter
            fn1Result = fn(x);
            // Now pass the second parameter the the returned function
            fn2Result = fn1Result(y);
        } catch (e) {
            return fnError(e);
        }
        
        // Assert all the reslts
        return (expectedResult === additionResult) && (expectedResult === fn2Result);
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
        if (levels[progress].apply(this, arguments)) {
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