/* jshint laxcomma:true */

Jasper(
  "ask",
  "Call Jasper with one argument: 'start'.",
  "Executing functions - call the Jasper function passing a string.\n" +
    "All of the exercises will require you to call the 'Jasper' function.",
  function (str) {
    return "start" === str;
  },
);

Jasper(
  "ask",
  "Pass in a function that returns true.",
  "Higher order functions - functions as arguments.",
  function (cb) {
    return true === cb();
  },
);

Jasper(
  "ask",
  "Provide an object with two properties: 'a' and 'b'.",
  "Object Literals - create a simple object with two properties.",
  function (obj) {
    return void 0 !== obj.a && void 0 !== obj.b;
  },
);

Jasper(
  "ask",
  "Pass a function that throws an error with message 'up'",
  "Errors - throw an actual Error object.",
  function (fn) {
    try {
      fn();
    } catch (e) {
      return "up" === e.message && e instanceof Error;
    }

    return false;
  },
);

Jasper(
  "ask",
  "Send a JSON string that has a property 'do' with the value 'good'",
  "Data interchange format - create a valid JSON string.",
  function (json) {
    return "good" === JSON.parse(json)["do"];
  },
);

Jasper(
  "ask",
  "Write a function to sum any number of number arguments.",
  "Use the 'arguments' object in a function like an array even though it's not.",
  function (fn) {
    var inputs,
      sum = 0;

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
  },
);

Jasper(
  "ask",
  "Write a function that takes an argument and returns a function that returns that argument.",
  "Closures - use a closure to return a value scoped to a newly constructed function's scope.",
  function (fn) {
    return [42, "good stuff", /asdf/].reduce(function (acc, arg) {
      return acc && fn(arg)() === arg;
    }, true);
  },
);

Jasper(
  "ask",
  "Execute Jasper with a context that matches its argument.",
  "Function contexts - the 'this' keyword is the context a function executes in.",
  function (arg) {
    return this == arg;
  },
);

Jasper(
  "ask",
  "Add a 'jasper' method to the prototype of the object passed to the function you write.",
  "Prototype chain - methods on the prototype of an object are available to all instances.",
  function (fn) {
    function F() {}

    var obj = new F();

    fn(F);

    return (
      obj.jasper &&
      /function/i.test({}.toString.call(obj.jasper)) &&
      !obj.hasOwnProperty("jasper")
    );
  },
);

Jasper(
  "ask",
  "Pass in a function that will execute the functions passed in as arguments after 1s",
  "Asynchronous execution + scopes.",
  function (done, cb) {
    var execs = 0;

    function fn() {
      ++execs === 3 && done();
    }

    cb(fn, fn, fn);

    return null;
  },
  2000,
);

// Jasper("ask", "", function () {});

Jasper("ask"); // lock the list of asks
