/*jshint laxcomma:true*/

var Jasper = (function () {
  var API
    , levels
    , progress = 0
    , slice = [].slice
    , toString = {}.toString
    ;

  API = {
    callback: function (cb) {
      var result;

      try {
        result = cb();
        return true === result && "Great, now we start getting more difficult.";
      } catch (e) {
        return "Ooops, did you pass a function?";
      }
    },

    reset: function () {
      progress = 0;
      return "All set; go again?";
    },

    skip: function (num) {
      progress += (~~num || 1);
    },

    start: function () {
      return "Very good; now pass 'callback' and a function that returns true.";
    }
  };

  levels = "start callback".split(" ");

  function jasper (name) {
    var response;

    if (0 === arguments.length || !/string/i.test(toString.call(name))) {
      return "You have to tell me what to do.";
    }

    if (~levels.indexOf(name)) {
      response = API[name].apply(null, slice.call(arguments, 1));
    } else {
      return "Sorry '%' not available at this time.".replace("%", name);
    }

    if (name === levels[progress]) {
      if (response) {
        progress++;
        return response;
      } else {
        return "Not quite try again.";
      }
    } else {
      if (progress === levels.length) {
        return "You're done; start over with Jasper('reset').";
      } else {
        return "Come on now, no skipping around; you're at: " +
          levels[progress];
      }
    }
  }

  console.log("Interested in teh JavaScripts? Run, Jasper('start') to see what you are made of.");

  return jasper;
}());