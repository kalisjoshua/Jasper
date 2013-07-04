describe('Jasper engine', function() {

  'use strict';

  afterEach(function() {
    Jasper('reset');
  });

  it('should show start message if empty call', function() {
    expect(Jasper()).toBe("Call Jasper with one argument: 'start'.");
  });

  it('should tell when answer is wrong', function() {
    Jasper('start');
    expect(Jasper(function() {
      return false;
    })).toBe('Not quite try again.');
  });

  it('should show first question when calling with \'start\' argument', function() {
    expect(Jasper('start')).toBe('Pass in a function that returns true.');
  });

  it('should go to before last question if skip is negative', function() {
    var feedBack = Jasper('skip', -10);
    expect(feedBack).toBe("Add a 'jasper' method to the prototype of the object passed to the function your write.");
  });

  it('should tell when it is over', function() {
    var finalFeedBack = 'Congratulations you\'re done; start over with Jasper(\'reset\').';
    var actualFeedBack, finiteLoop = 999;
    Jasper('start');
    while(finalFeedBack != actualFeedBack && finiteLoop > 0) {
      actualFeedBack = Jasper('skip');
      finiteLoop--;
    }

    expect(finiteLoop).toBeGreaterThan(0);
  });

  it('should forbid adding new question when started', function() {
    expect(function() {
      Jasper('ask', 'test', function() {})
    }).toThrow();
  });

});