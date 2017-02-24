  QUnit.test('partial', function(assert) {
    // _dw wait on partial()
    assert.strictEqual(func('a'), 4, 'accepts fewer arguments than the number of placeholders');

    func = _.partial(function() { return typeof arguments[2]; }, _, 'b', _, 'd');
    assert.strictEqual(func('a'), 'undefined', 'unfilled placeholders are undefined');

    // passes context
    function MyWidget(name, options) {
      this.name = name;
      this.options = options;
    }
    MyWidget.prototype.get = function() {
      return this.name;
    };
    var MyWidgetWithCoolOpts = _.partial(MyWidget, _, {a: 1});
    var widget = new MyWidgetWithCoolOpts('foo');
    assert.ok(widget instanceof MyWidget, 'Can partially bind a constructor');
    assert.strictEqual(widget.get(), 'foo', 'keeps prototype');
    assert.deepEqual(widget.options, {a: 1});

    _.partial.placeholder = obj;
    func = _.partial(function() { return arguments.length; }, obj, 'b', obj, 'd');
    assert.strictEqual(func('a'), 4, 'allows the placeholder to be swapped out');

    _.partial.placeholder = {};
    func = _.partial(function() { return arguments.length; }, obj, 'b', obj, 'd');
    assert.strictEqual(func('a'), 5, 'swapping the placeholder preserves previously bound arguments');

    _.partial.placeholder = _;
  });



  QUnit.test('throttle', function(assert) {
    assert.expect(2);
    var done = assert.async();
    var counter = 0;
    var incr = function(){ counter++; };
    var throttledIncr = _.throttle(incr, 32);
    throttledIncr(); throttledIncr();

    assert.strictEqual(counter, 1, 'incr was called immediately');
    _.delay(function(){ assert.strictEqual(counter, 2, 'incr was throttled'); done(); }, 64);
  });

  QUnit.test('throttle arguments', function(assert) {
    assert.expect(2);
    var done = assert.async();
    var value = 0;
    var update = function(val){ value = val; };
    var throttledUpdate = _.throttle(update, 32);
    throttledUpdate(1); throttledUpdate(2);
    _.delay(function(){ throttledUpdate(3); }, 64);
    assert.strictEqual(value, 1, 'updated to latest value');
    _.delay(function(){ assert.strictEqual(value, 3, 'updated to latest value'); done(); }, 96);
  });

  QUnit.test('throttle once', function(assert) {
    assert.expect(2);
    var done = assert.async();
    var counter = 0;
    var incr = function(){ return ++counter; };
    var throttledIncr = _.throttle(incr, 32);
    var result = throttledIncr();
    _.delay(function(){
      assert.strictEqual(result, 1, 'throttled functions return their value');
      assert.strictEqual(counter, 1, 'incr was called once'); done();
    }, 64);
  });

  QUnit.test('throttle twice', function(assert) {
    assert.expect(1);
    var done = assert.async();
    var counter = 0;
    var incr = function(){ counter++; };
    var throttledIncr = _.throttle(incr, 32);
    throttledIncr(); throttledIncr();
    _.delay(function(){ assert.strictEqual(counter, 2, 'incr was called twice'); done(); }, 64);
  });

  QUnit.test('more throttling', function(assert) {
    assert.expect(3);
    var done = assert.async();
    var counter = 0;
    var incr = function(){ counter++; };
    var throttledIncr = _.throttle(incr, 30);
    throttledIncr(); throttledIncr();
    assert.strictEqual(counter, 1);
    _.delay(function(){
      assert.strictEqual(counter, 2);
      throttledIncr();
      assert.strictEqual(counter, 3);
      done();
    }, 85);
  });

  QUnit.test('throttle repeatedly with results', function(assert) {
    assert.expect(6);
    var done = assert.async();
    var counter = 0;
    var incr = function(){ return ++counter; };
    var throttledIncr = _.throttle(incr, 100);
    var results = [];
    var saveResult = function() { results.push(throttledIncr()); };
    saveResult(); saveResult();
    _.delay(saveResult, 50);
    _.delay(saveResult, 150);
    _.delay(saveResult, 160);
    _.delay(saveResult, 230);
    _.delay(function() {
      assert.strictEqual(results[0], 1, 'incr was called once');
      assert.strictEqual(results[1], 1, 'incr was throttled');
      assert.strictEqual(results[2], 1, 'incr was throttled');
      assert.strictEqual(results[3], 2, 'incr was called twice');
      assert.strictEqual(results[4], 2, 'incr was throttled');
      assert.strictEqual(results[5], 3, 'incr was called trailing');
      done();
    }, 300);
  });

  QUnit.test('throttle triggers trailing call when invoked repeatedly', function(assert) {
    assert.expect(2);
    var done = assert.async();
    var counter = 0;
    var limit = 48;
    var incr = function(){ counter++; };
    var throttledIncr = _.throttle(incr, 32);

    var stamp = new Date;
    while (new Date - stamp < limit) {
      throttledIncr();
    }
    var lastCount = counter;
    assert.ok(counter > 1);

    _.delay(function() {
      assert.ok(counter > lastCount);
      done();
    }, 96);
  });

  QUnit.test('throttle does not trigger leading call when leading is set to false', function(assert) {
    assert.expect(2);
    var done = assert.async();
    var counter = 0;
    var incr = function(){ counter++; };
    var throttledIncr = _.throttle(incr, 60, {leading: false});

    throttledIncr(); throttledIncr();
    assert.strictEqual(counter, 0);

    _.delay(function() {
      assert.strictEqual(counter, 1);
      done();
    }, 96);
  });

  QUnit.test('more throttle does not trigger leading call when leading is set to false', function(assert) {
    assert.expect(3);
    var done = assert.async();
    var counter = 0;
    var incr = function(){ counter++; };
    var throttledIncr = _.throttle(incr, 100, {leading: false});

    throttledIncr();
    _.delay(throttledIncr, 50);
    _.delay(throttledIncr, 60);
    _.delay(throttledIncr, 200);
    assert.strictEqual(counter, 0);

    _.delay(function() {
      assert.strictEqual(counter, 1);
    }, 250);

    _.delay(function() {
      assert.strictEqual(counter, 2);
      done();
    }, 350);
  });

  QUnit.test('one more throttle with leading: false test', function(assert) {
    assert.expect(2);
    var done = assert.async();
    var counter = 0;
    var incr = function(){ counter++; };
    var throttledIncr = _.throttle(incr, 100, {leading: false});

    var time = new Date;
    while (new Date - time < 350) throttledIncr();
    assert.ok(counter <= 3);

    _.delay(function() {
      assert.ok(counter <= 4);
      done();
    }, 200);
  });

  QUnit.test('throttle does not trigger trailing call when trailing is set to false', function(assert) {
    assert.expect(4);
    var done = assert.async();
    var counter = 0;
    var incr = function(){ counter++; };
    var throttledIncr = _.throttle(incr, 60, {trailing: false});

    throttledIncr(); throttledIncr(); throttledIncr();
    assert.strictEqual(counter, 1);

    _.delay(function() {
      assert.strictEqual(counter, 1);

      throttledIncr(); throttledIncr();
      assert.strictEqual(counter, 2);

      _.delay(function() {
        assert.strictEqual(counter, 2);
        done();
      }, 96);
    }, 96);
  });

  QUnit.test('throttle continues to function after system time is set backwards', function(assert) {
    assert.expect(2);
    var done = assert.async();
    var counter = 0;
    var incr = function(){ counter++; };
    var throttledIncr = _.throttle(incr, 100);
    var origNowFunc = _.now;

    throttledIncr();
    assert.strictEqual(counter, 1);
    _.now = function() {
      return new Date(2013, 0, 1, 1, 1, 1);
    };

    _.delay(function() {
      throttledIncr();
      assert.strictEqual(counter, 2);
      done();
      _.now = origNowFunc;
    }, 200);
  });

  QUnit.test('throttle re-entrant', function(assert) {
    assert.expect(2);
    var done = assert.async();
    var sequence = [
      ['b1', 'b2'],
      ['c1', 'c2']
    ];
    var value = '';
    var throttledAppend;
    var append = function(arg){
      value += this + arg;
      var args = sequence.pop();
      if (args) {
        throttledAppend.call(args[0], args[1]);
      }
    };
    throttledAppend = _.throttle(append, 32);
    throttledAppend.call('a1', 'a2');
    assert.strictEqual(value, 'a1a2');
    _.delay(function(){
      assert.strictEqual(value, 'a1a2c1c2b1b2', 'append was throttled successfully');
      done();
    }, 100);
  });

  QUnit.test('throttle cancel', function(assert) {
    var done = assert.async();
    var counter = 0;
    var incr = function(){ counter++; };
    var throttledIncr = _.throttle(incr, 32);
    throttledIncr();
    throttledIncr.cancel();
    throttledIncr();
    throttledIncr();

    assert.strictEqual(counter, 2, 'incr was called immediately');
    _.delay(function(){ assert.strictEqual(counter, 3, 'incr was throttled'); done(); }, 64);
  });

  QUnit.test('throttle cancel with leading: false', function(assert) {
    var done = assert.async();
    var counter = 0;
    var incr = function(){ counter++; };
    var throttledIncr = _.throttle(incr, 32, {leading: false});
    throttledIncr();
    throttledIncr.cancel();

    assert.strictEqual(counter, 0, 'incr was throttled');
    _.delay(function(){ assert.strictEqual(counter, 0, 'incr was throttled'); done(); }, 64);
  });

  QUnit.test('debounce', function(assert) {
    assert.expect(1);
    var done = assert.async();
    var counter = 0;
    var incr = function(){ counter++; };
    var debouncedIncr = _.debounce(incr, 32);
    debouncedIncr(); debouncedIncr();
    _.delay(debouncedIncr, 16);
    _.delay(function(){ assert.strictEqual(counter, 1, 'incr was debounced'); done(); }, 96);
  });

  QUnit.test('debounce cancel', function(assert) {
    assert.expect(1);
    var done = assert.async();
    var counter = 0;
    var incr = function(){ counter++; };
    var debouncedIncr = _.debounce(incr, 32);
    debouncedIncr();
    debouncedIncr.cancel();
    _.delay(function(){ assert.strictEqual(counter, 0, 'incr was not called'); done(); }, 96);
  });

  QUnit.test('debounce asap', function(assert) {
    assert.expect(6);
    var done = assert.async();
    var a, b, c;
    var counter = 0;
    var incr = function(){ return ++counter; };
    var debouncedIncr = _.debounce(incr, 64, true);
    a = debouncedIncr();
    b = debouncedIncr();
    assert.strictEqual(a, 1);
    assert.strictEqual(b, 1);
    assert.strictEqual(counter, 1, 'incr was called immediately');
    _.delay(debouncedIncr, 16);
    _.delay(debouncedIncr, 32);
    _.delay(debouncedIncr, 48);
    _.delay(function(){
      assert.strictEqual(counter, 1, 'incr was debounced');
      c = debouncedIncr();
      assert.strictEqual(c, 2);
      assert.strictEqual(counter, 2, 'incr was called again');
      done();
    }, 128);
  });

  QUnit.test('debounce asap cancel', function(assert) {
    assert.expect(4);
    var done = assert.async();
    var a, b;
    var counter = 0;
    var incr = function(){ return ++counter; };
    var debouncedIncr = _.debounce(incr, 64, true);
    a = debouncedIncr();
    debouncedIncr.cancel();
    b = debouncedIncr();
    assert.strictEqual(a, 1);
    assert.strictEqual(b, 2);
    assert.strictEqual(counter, 2, 'incr was called immediately');
    _.delay(debouncedIncr, 16);
    _.delay(debouncedIncr, 32);
    _.delay(debouncedIncr, 48);
    _.delay(function(){ assert.strictEqual(counter, 2, 'incr was debounced'); done(); }, 128);
  });

  QUnit.test('debounce asap recursively', function(assert) {
    assert.expect(2);
    var done = assert.async();
    var counter = 0;
    var debouncedIncr = _.debounce(function(){
      counter++;
      if (counter < 10) debouncedIncr();
    }, 32, true);
    debouncedIncr();
    assert.strictEqual(counter, 1, 'incr was called immediately');
    _.delay(function(){ assert.strictEqual(counter, 1, 'incr was debounced'); done(); }, 96);
  });

  QUnit.test('debounce after system time is set backwards', function(assert) {
    assert.expect(2);
    var done = assert.async();
    var counter = 0;
    var origNowFunc = _.now;
    var debouncedIncr = _.debounce(function(){
      counter++;
    }, 100, true);

    debouncedIncr();
    assert.strictEqual(counter, 1, 'incr was called immediately');

    _.now = function() {
      return new Date(2013, 0, 1, 1, 1, 1);
    };

    _.delay(function() {
      debouncedIncr();
      assert.strictEqual(counter, 2, 'incr was debounced successfully');
      done();
      _.now = origNowFunc;
    }, 200);
  });

  QUnit.test('debounce re-entrant', function(assert) {
    assert.expect(2);
    var done = assert.async();
    var sequence = [
      ['b1', 'b2']
    ];
    var value = '';
    var debouncedAppend;
    var append = function(arg){
      value += this + arg;
      var args = sequence.pop();
      if (args) {
        debouncedAppend.call(args[0], args[1]);
      }
    };
    debouncedAppend = _.debounce(append, 32);
    debouncedAppend.call('a1', 'a2');
    assert.strictEqual(value, '');
    _.delay(function(){
      assert.strictEqual(value, 'a1a2b1b2', 'append was debounced successfully');
      done();
    }, 100);
  });

  QUnit.test('once', function(assert) {
    var num = 0;
    var increment = _.once(function(){ return ++num; });
    increment();
    increment();
    assert.strictEqual(num, 1);

    assert.strictEqual(increment(), 1, 'stores a memo to the last value');
  });

  QUnit.test('Recursive onced function.', function(assert) {
    assert.expect(1);
    var f = _.once(function(){
      assert.ok(true);
      f();
    });
    f();
  });

  QUnit.test('wrap', function(assert) {
    var greet = function(name){ return 'hi: ' + name; };
    var backwards = _.wrap(greet, function(func, name){ return func(name) + ' ' + name.split('').reverse().join(''); });
    assert.strictEqual(backwards('moe'), 'hi: moe eom', 'wrapped the salutation function');

    var inner = function(){ return 'Hello '; };
    var obj = {name: 'Moe'};
    obj.hi = _.wrap(inner, function(fn){ return fn() + this.name; });
    assert.strictEqual(obj.hi(), 'Hello Moe');

    var noop = function(){};
    var wrapped = _.wrap(noop, function(){ return Array.prototype.slice.call(arguments, 0); });
    var ret = wrapped(['whats', 'your'], 'vector', 'victor');
    assert.deepEqual(ret, [noop, ['whats', 'your'], 'vector', 'victor']);
  });

  QUnit.test('negate', function(assert) {
    var isOdd = function(n){ return n & 1; };
    assert.strictEqual(_.negate(isOdd)(2), true, 'should return the complement of the given function');
    assert.strictEqual(_.negate(isOdd)(3), false, 'should return the complement of the given function');
  });

  QUnit.test('compose', function(assert) {
    var greet = function(name){ return 'hi: ' + name; };
    var exclaim = function(sentence){ return sentence + '!'; };
    var composed = _.compose(exclaim, greet);
    assert.strictEqual(composed('moe'), 'hi: moe!', 'can compose a function that takes another');

    composed = _.compose(greet, exclaim);
    assert.strictEqual(composed('moe'), 'hi: moe!', 'in this case, the functions are also commutative');

    // f(g(h(x, y, z)))
    function h(x, y, z) {
      assert.strictEqual(arguments.length, 3, 'First function called with multiple args');
      return z * y;
    }
    function g(x) {
      assert.strictEqual(arguments.length, 1, 'Composed function is called with 1 argument');
      return x;
    }
    function f(x) {
      assert.strictEqual(arguments.length, 1, 'Composed function is called with 1 argument');
      return x * 2;
    }
    composed = _.compose(f, g, h);
    assert.strictEqual(composed(1, 2, 3), 12);
  });

  QUnit.test('after', function(assert) {
    var testAfter = function(afterAmount, timesCalled) {
      var afterCalled = 0;
      var after = _.after(afterAmount, function() {
        afterCalled++;
      });
      while (timesCalled--) after();
      return afterCalled;
    };

    assert.strictEqual(testAfter(5, 5), 1, 'after(N) should fire after being called N times');
    assert.strictEqual(testAfter(5, 4), 0, 'after(N) should not fire unless called N times');
    assert.strictEqual(testAfter(0, 0), 0, 'after(0) should not fire immediately');
    assert.strictEqual(testAfter(0, 1), 1, 'after(0) should fire when first invoked');
  });

  QUnit.test('before', function(assert) {
    var testBefore = function(beforeAmount, timesCalled) {
      var beforeCalled = 0;
      var before = _.before(beforeAmount, function() { beforeCalled++; });
      while (timesCalled--) before();
      return beforeCalled;
    };

    assert.strictEqual(testBefore(5, 5), 4, 'before(N) should not fire after being called N times');
    assert.strictEqual(testBefore(5, 4), 4, 'before(N) should fire before being called N times');
    assert.strictEqual(testBefore(0, 0), 0, 'before(0) should not fire immediately');
    assert.strictEqual(testBefore(0, 1), 0, 'before(0) should not fire when first invoked');

    var context = {num: 0};
    var increment = _.before(3, function(){ return ++this.num; });
    _.times(10, increment, context);
    assert.strictEqual(increment(), 2, 'stores a memo to the last value');
    assert.strictEqual(context.num, 2, 'provides context');
  });

  QUnit.test('iteratee', function(assert) {
    var identity = _.iteratee();
    assert.strictEqual(identity, _.identity, '_.iteratee is exposed as an external function.');

    function fn() {
      return arguments;
    }
    _.each([_.iteratee(fn), _.iteratee(fn, {})], function(cb) {
      assert.strictEqual(cb().length, 0);
      assert.deepEqual(_.toArray(cb(1, 2, 3)), _.range(1, 4));
      assert.deepEqual(_.toArray(cb(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)), _.range(1, 11));
    });

    var deepProperty = _.iteratee(['a', 'b']);
    assert.strictEqual(deepProperty({a: {b: 2}}), 2, 'treats an array as a deep property accessor');

    // Test custom iteratee
    var builtinIteratee = _.iteratee;
    _.iteratee = function(value) {
      // RegEx values return a function that returns the number of matches
      if (_.isRegExp(value)) return function(obj) {
        return (obj.match(value) || []).length;
      };
      return value;
    };

    var collection = ['foo', 'bar', 'bbiz'];

    // Test all methods that claim to be transformed through `_.iteratee`
    assert.deepEqual(_.countBy(collection, /b/g), {0: 1, 1: 1, 2: 1});
    assert.strictEqual(_.every(collection, /b/g), false);
    assert.deepEqual(_.filter(collection, /b/g), ['bar', 'bbiz']);
    assert.strictEqual(_.find(collection, /b/g), 'bar');
    assert.strictEqual(_.findIndex(collection, /b/g), 1);
    assert.strictEqual(_.findKey(collection, /b/g), '1');
    assert.strictEqual(_.findLastIndex(collection, /b/g), 2);
    assert.deepEqual(_.groupBy(collection, /b/g), {0: ['foo'], 1: ['bar'], 2: ['bbiz']});
    assert.deepEqual(_.indexBy(collection, /b/g), {0: 'foo', 1: 'bar', 2: 'bbiz'});
    assert.deepEqual(_.map(collection, /b/g), [0, 1, 2]);
    assert.strictEqual(_.max(collection, /b/g), 'bbiz');
    assert.strictEqual(_.min(collection, /b/g), 'foo');
    assert.deepEqual(_.partition(collection, /b/g), [['bar', 'bbiz'], ['foo']]);
    assert.deepEqual(_.reject(collection, /b/g), ['foo']);
    assert.strictEqual(_.some(collection, /b/g), true);
    assert.deepEqual(_.sortBy(collection, /b/g), ['foo', 'bar', 'bbiz']);
    assert.strictEqual(_.sortedIndex(collection, 'blah', /b/g), 1);
    assert.deepEqual(_.uniq(collection, /b/g), ['foo', 'bar', 'bbiz']);

    var objCollection = {a: 'foo', b: 'bar', c: 'bbiz'};
    assert.deepEqual(_.mapObject(objCollection, /b/g), {a: 0, b: 1, c: 2});

    // Restore the builtin iteratee
    _.iteratee = builtinIteratee;
  });

  QUnit.test('restArgs', function(assert) {
    assert.expect(10);
    _.restArgs(function(a, args) {
      assert.strictEqual(a, 1);
      assert.deepEqual(args, [2, 3], 'collects rest arguments into an array');
    })(1, 2, 3);

    _.restArgs(function(a, args) {
      assert.strictEqual(a, void 0);
      assert.deepEqual(args, [], 'passes empty array if there are not enough arguments');
    })();

    _.restArgs(function(a, b, c, args) {
      assert.strictEqual(arguments.length, 4);
      assert.deepEqual(args, [4, 5], 'works on functions with many named parameters');
    })(1, 2, 3, 4, 5);

    var obj = {};
    _.restArgs(function() {
      assert.strictEqual(this, obj, 'invokes function with this context');
    }).call(obj);

    _.restArgs(function(array, iteratee, context) {
      assert.deepEqual(array, [1, 2, 3, 4], 'startIndex can be used manually specify index of rest parameter');
      assert.strictEqual(iteratee, void 0);
      assert.strictEqual(context, void 0);
    }, 0)(1, 2, 3, 4);
  });

}());
