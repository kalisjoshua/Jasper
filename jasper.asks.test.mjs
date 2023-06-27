import { asks } from "./jasper.asks.mjs";

const NON_ANSWER = Symbol("invalid");

describe("Asks", function () {
  // convert array of challenges to an object keyed by the title of the challenge
  const asksMap = asks.reduce((acc, [title, helper, fn]) => {
    acc[title] = fn;

    return acc;
  }, {});

  const allTests = [
    [
      "Call jasper with one argument: 'start'.",
      ["start", true],
      [undefined, false],
      [NON_ANSWER, false],
      [1234567890, false],
    ],

    [
      "Pass in a function that returns true.",
      [() => true, true],
      ["nope", false],
      [NON_ANSWER, false],
    ],

    [
      "Provide an object with two properties: 'a' and 'b'.",
      [{ a: 1, b: 2 }, true],
      [NON_ANSWER, false],
    ],

    [
      "Provide a function that throws an error with message 'down'",
      [
        () => {
          throw new Error("down");
        },
        true,
      ],
      [() => {}, false],
      [NON_ANSWER, false],
    ],

    [
      "Send a JSON string that has a property 'do' with the value 'good'",
      [JSON.stringify({ do: "good" }), true],
      [NON_ANSWER, false],
    ],

    [
      "Write a function to sum any number of arguments.",
      [(...nums) => nums.reduce((a, b) => a + b), true],
      [(a, b) => a + b, false],
      [NON_ANSWER, false],
    ],

    [
      "Write a function that takes an argument and returns a function that returns that argument.",
      [(a) => () => a, true],
      [NON_ANSWER, false],
    ],

    [
      "Execute jasper with a context that matches its argument.",
      [1, true, 1],
      ["hello", true, "hello"],
      [allTests, true, allTests],

      [{}, false, {}],
      [[], false, []],
      [NON_ANSWER, false],
    ],

    [
      "Add a 'jasper' method to the prototype of the object passed to the function you provide.",
      [(obj) => (obj.prototype.jasper = () => {}), true],
      [NON_ANSWER, false],
    ],

    [
      "Pass in a function that will return a Promise; the Promise should reject if the function argument is falsey and resolve if truthy.",
      [(bool) => (bool ? Promise.resolve() : Promise.reject()), true],
      [NON_ANSWER, false],
    ],
  ];

  allTests.forEach(([title, ...tests]) => {
    it(`should exercise "${title}"`, () => {
      const fn = asksMap[title];

      tests.forEach(async ([arg, expected, context]) => {
        let result;

        try {
          result = await Promise.resolve(fn.call(context, arg));
          expect(result).toBe(expected);
        } catch (e) {
          expect(expected).toBe(false);
        }
      });
    });
  });
});
