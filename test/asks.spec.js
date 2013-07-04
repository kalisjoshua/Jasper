describe('User ', function() {

  'use strict';

  beforeEach(function() {
    Jasper('start');
  });

  afterEach(function() {
    Jasper('reset');
  });

  it('should provide answer to initial question', function() {
    var feedback = Jasper(function() {
      return true;
    });

    expect(feedback).not.toBe('Not quite try again.');
  });

  it('should provide answer to question 1', function() {
    Jasper('skip', 1);
    var feedback = Jasper({
      a: 1,
      b: 1
    });

    expect(feedback).not.toBe('Not quite try again.');
  });

  it('should provide answer to question 2', function() {
    Jasper('skip', 2);
    var feedback = Jasper(function() {
      throw new Error('up');
    });

    expect(feedback).not.toBe('Not quite try again.');
  });

  it('should provide answer to question 3', function() {
    Jasper('skip', 3);
    var json = JSON.stringify({
      'do': 'good'
    });
    var feedback = Jasper(json);

    expect(feedback).not.toBe('Not quite try again.');
  });

  it('should provide answer to question 4', function() {
    Jasper('skip', 4);
    var feedback = Jasper(function() {
      var sum = 0;
      for(var i = 0; i < arguments.length; i++) {
        sum += arguments[i];
      }

      return sum;
    });

    expect(feedback).not.toBe('Not quite try again.');
  });

  it('should provide answer to question 5', function() {
    Jasper('skip', 5);
    var feedback = Jasper(function(arg) {
      return function() {
        return arg;
      };
    });

    expect(feedback).not.toBe('Not quite try again.');
  });

  it('should provide answer to question 6', function() {
    Jasper('skip', 6);
    var context = {
      a: 1
    };

    var feedback = Jasper.call(context, context);

    expect(feedback).not.toBe('Not quite try again.');
  });

  it('should provide answer to question 7', function() {
    Jasper('skip', 7);

    var feedback = Jasper(function(object) {
      object.prototype.jasper = function() {};
    });

    expect(feedback).not.toBe('Not quite try again.');
  });

});