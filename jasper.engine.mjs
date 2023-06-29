import * as tps from "./tinyPubSub.mjs";

/**
 * Test an object type against a string as a regex
 *
 * @param  {string}  type
 *         A string to be tested against the object type
 *
 * @param  {Object}  obj
 *         Any object to be inspected
 *
 * @return {Boolean}
 */
const isType = (type, obj) => new RegExp(type, "i").test({}.toString.call(obj));
const isFunction = isType.bind(null, "function");
/**
 * Deterime if argument is a number
 *
 * @param  {anything}  n
 *
 * @return {Boolean}
 *
 */
const isNumber = (n) => !isNaN(parseFloat(n)) && isFinite(n);
const isString = isType.bind(null, "string");

let answered = [];
// challenges will hold all asks given to Jasper
let challenges = [];
// all of the functions registered to be notified of events
let listeners = [];
// lock indicates if asks can be added or not
let lock = false;
// progress is the current position of the user within the challenges array
let progress = 0;

/**
 * Randomize a list of congratulatory adjectives
 *
 * @return {String}
 */
const adjectives = (() => {
  let words = [
    "Admirable",
    "Awesome",
    "Brilliant",
    "Capital",
    "Excellent",
    "Fabulous",
    "Fantabulous",
    "Glorious",
    "Good",
    "Great",
    "Impressive",
    "Keen",
    "Magnificent",
    "Outstanding",
    "Resplendent",
    "Splendid",
    "Splendiferous",
    "Superb",
    "Superior",
    "Swanky",
  ];

  const rand = (limit = 2) => ~~(Math.random() * limit);

  return () => `${words[rand(words.length)]}${["!", "."][rand()]}`;
})();

/**
 * Namespace for the API allowing for lookup in Jasper
 *
 * @type {Object}
 */
const API = {
  /**
   * Register a new ask (challenge) with Jasper to extend the fun
   *
   * @param  {String}   intro
   *         An introductory (ambiguous) description of what the ask is asking
   *
   * @param  {String}   hint
   *         A more explicit text to describe the ask specifically
   *
   * @param  {Function} fn
   *         The body of the challenge
   *
   * @return undefined
   */
  ask(intro, hint, fn, async) {
    if (!!lock) {
      throw new Error("Jasper has been locked, no new asks may be added.");
    }

    var length = arguments.length;

    if (length > 0) {
      // Make second parameter optional
      if (2 === length) {
        fn = hint;
        hint = "";
      }

      if (!isString(intro)) {
        throw new Error("Intro text must be a String.");
      }

      if (!isString(hint)) {
        throw new Error("Hint text must be a String.");
      }

      if (!isFunction(fn)) {
        throw new Error("Challenge must be a Function.");
      }

      fn.intro = intro;
      fn.hint = hint;
      // Asks are synchronous by default
      fn.async = async || 0;
      challenges.push(fn);
    } else {
      // no arguments passed
      // lock the implementation so no more asks can be added
      lock = true;
    }
  },

  /**
   * Remove all asks to start from scratch; helpful primarily for testing.
   * This must be executed with an arg of 'true' to prevent accidental call
   *
   * @param  {true}         arg
   *         Passing anything other than true will throw an error
   *
   * @param  {true|falsey}  atticToo
   *         Passing truthy will empty the attic array; testing only probably
   *
   * @return undefined
   */
  empty(arg) {
    if (true === arg) {
      challenges = [];
      lock = false;
      API.restart();
    } else {
      throw new Error("Empty must be passed first_argument === 'true'.");
    }
  },

  /**
   * Show the current level's intro text
   *
   * @return {String}
   *         The intro text of the current level, or the end text
   */
  help(prepend) {
    return progress < challenges.length && false !== answered[progress]
      ? challenges[progress].intro.replace("#", 1 + progress)
      : "\n Congratulations you're done; start over with Jasper('restart').";
  },

  /**
   * Show the current level's hint text
   *
   * @param  {String} prepend
   *         Optional addition text to add to the output to be more explanatory
   *
   * @return {String}
   *         The resulting string to be output
   */
  hint(prepend) {
    return (
      (prepend || "") +
      challenges[progress].hint +
      (prepend ? "\n " + API.help() : "")
    );
  },

  listen(fn) {
    tps.sub(fn);
  },

  /**
   * Start the asks/challenges over again
   *
   * @return {String}
   *         Message telling the user they are ready to go again
   */
  restart() {
    answered = [];
    progress = 0;
    return "All clear; go for it!\n " + API.help();
  },

  /**
   * Skip an ask (challenge) without completing
   *
   * @param  {Integer} num
   *         A positive number skips forward from the current location -
   *         'progress', negative moves backward
   *
   * @return {String}
   *         The help text for the next ask/challenge
   */
  skip(search) {
    var len;

    if (void 0 === search || isNumber(search)) {
      if (0 === +search) {
        throw new Error(
          "Why would you want to skip to where you are? " +
            "Zero passed to Jasper('skip').",
        );
      }

      // default to 'skipping' one ask forward
      search = search || 1;

      // if previously answered dont't penalize for skipping
      answered[progress] = answered[progress] || false;

      // make sure to skip in bounds
      progress = (progress + ~~search) % challenges.length;
    } else {
      throw new Error(
        "Skip needs a number to skip to, " +
          "or a string to search for; '%' doesn't work.".replace("%", search),
      );
    }

    return API.help();
  },
};

/** Command Pattern - Manager
 * Process user interactions and manage state
 *
 * @param  {String} command
 *         API method to invoke or (attempted) answer to level
 *
 * @param  {[anything?]} arg
 *         The first additional argument
 *
 * @return {String}
 *         Prompt for the user to take next steps
 *
 */
function Jasper(command, ...args) {
  // default to the 'help' util method
  command = command ?? "help";

  // run a util method if asked for or no arguments
  if (API[command] || 0 === arguments.length) {
    // only pass the arguments if provided; zero is a valid argument sometimes
    return Promise.resolve(API[command].apply(this, args)).then((result) => {
      tps.pub({
        invocation: { command, args },
        challenge: { level: progress, info: challenges[progress] },
      });

      return result;
    });
  }

  let result = false;

  try {
    result = Promise.resolve(challenges[progress].apply(this, arguments));
  } catch (error) {
    let message;

    if (/not\sa\sfunction/i.test(error.message)) {
      message = "Remember that time you were asked to pass a function?";
    } else if (/JSON/i.test(error.message)) {
      message = "The JSON string needs to be properly formatted.";
    } else {
      message = "It's a little unclear what you are trying to do.";
    }

    result = Promise.reject({ error, message });
  }

  return result.then((result) => {
    tps.pub({
      invocation: { command, args },
      challenge: { level: progress, info: challenges[progress] },
      result,
    });

    if (result) {
      progress += 1;

      const result = challenges[progress]
        ? API.hint(`${adjectives()} \n Level ${progress}: `) +
          `\n\nNext Task: ${API.help()}`
        : API.help();

      answered[progress] = true;

      return result;
    } else {
      return `Not quite try again.\n\n${API.help()}`;
    }
  });
}

// hints to help people find the path to enlightenment
Jasper.help = Jasper.start = Jasper.toString = Jasper;

export { Jasper };
