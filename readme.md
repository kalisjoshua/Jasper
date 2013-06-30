# API for JavaScript Candidate Assessment

* provide a function to run methods on an api through a command pattern interface to test user code.
* send user code to nodejs app to evaluate
* user iframe to load testing code
* instruct the candidate to build the API so that it is useful
* allow the candidate to hack into the API and bypass parts

```
var candidate = (function () {
  var API = {},
      slice = [].slice,
      test = 0;
  return {
    test: function (name) {
      var passes;
      passes = api[name].apply(null, slice.call(arguments, 1));
      if (passes === true) {
        test++;
      }
    }
  };
}());
```

**level one**

1. open the console
2. call a function
3. pass a function as an argument

**level two**

1. write a function to accept an unknown number of arguments and sum them
2. pass an object with a specific method available
3. provide a JSON string with some properties

**level three**

1. handle an async event
2. change the context of a function’s execution
3. add a method to an object’s prototype
