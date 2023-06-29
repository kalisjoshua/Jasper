// TODO: add a new ask to test for
//    generator ???
//    recursion ???

const asks = [
  [
    "Call jasper with one argument: 'start'.",
    "Executing functions - call the jasper function passing a string.\n" +
      "All of the exercises will require you to call the 'jasper' function.",
    function (str) {
      return "start" === str;
    },
  ],

  [
    "Pass in a function that returns true.",
    "Higher order functions - functions as arguments.",
    function (cb) {
      return true === cb();
    },
  ],

  [
    "Provide an object with two properties: 'a' and 'b'.",
    "Object Literals - create a simple object with two properties.",
    function (obj) {
      return void 0 !== obj.a && void 0 !== obj.b;
    },
  ],

  [
    "Provide a function that throws an error with message 'down'",
    "Errors - throw an Error instance.",
    function (fn) {
      try {
        fn();
      } catch (e) {
        return "down" === e.message && e instanceof Error;
      }

      return false;
    },
  ],

  [
    "Send a JSON string that has a property 'do' with the value 'good'",
    "Data interchange format - create a valid JSON string.",
    function (json) {
      return "good" === JSON.parse(json)["do"];
    },
  ],

  [
    "Write a function to sum any number of arguments.",
    "Use the rest operator, or the 'arguments' object like an array to loop over multiple arguments.",
    function (fn) {
      const randomInt = (limit = 32) => ~~(Math.random() * limit);
      const length = randomInt() + 3;

      const [sum, args] = Array(length)
        .fill(0)
        .reduce(
          ([sum, args]) => {
            const num = randomInt(1024);

            return [sum + num, args.concat(num)];
          },
          [0, []],
        );

      return sum === fn.apply(null, args);
    },
  ],

  [
    "Write a function that takes an argument and returns a function that returns that argument.",
    "Closures - use a closure to return a value scoped to a newly constructed function; loosely similar to currying.",
    function (fn) {
      return [42, "good stuff", /asdf/].reduce(function (acc, arg) {
        return acc && fn(arg)() === arg;
      }, true);
    },
  ],

  [
    "Execute jasper with a context that matches its argument.",
    "Function context - the 'this' keyword is the context of function execution; there are three methods for altering this.",
    function (arg) {
      return this == arg;
    },
  ],

  [
    "Add a 'jasper' method to the prototype of the object passed to the function you provide.",
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
  ],

  [
    "Pass in a function that will return a Promise; the Promise should reject if the function argument is falsey and resolve if truthy.",
    "Promises - async operations accept callbacks for resolved (`.then`) and rejected (`.catch`) statuses.",
    function (fn) {
      const run = (ans) =>
        fn(ans)
          .then(() => true)
          .catch(() => false)
          .then((result) => ans === result);

      return Promise.all([run(true), run(false)]).then((all) =>
        all.every((result) => true === result),
      );
    },
  ],
];

export { asks };
