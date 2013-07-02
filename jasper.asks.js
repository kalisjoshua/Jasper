
Jasper("ask", "Call Jasper with one argument: 'start'.", function (str) {
  return "start" === str;
});

Jasper("ask", "Pass in a function that returns true.", function (cb) {
  return true === cb();
});

Jasper("ask", "Provide an object with two properties: 'a' and 'b'.", function (obj) {
  return ((void 0) !== obj.a && (void 0) !== obj.b);
});

Jasper("ask", "Pass a function that throws an error with message 'up'", function (fn) {
  var message = 'up';

  try {
    fn();
  } catch (e) {
    return message === e;
  }

  return false;
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