

    // Matching an object like _.findWhere.
    var list = [{a: 1, b: 2}, {a: 2, b: 2}, {a: 1, b: 3}, {a: 1, b: 4}, {a: 2, b: 4}];

    assert.deepEqual(_.find(list, {a: 1}), {a: 1, b: 2}, 'can be used as findWhere');

    assert.deepEqual(_.find(list, {b: 4}), {a: 1, b: 4});

    assert.notOk(_.find(list, {c: 1}), 'undefined when not found');

    assert.notOk(_.find([], {c: 1}), 'undefined when searching empty list');

    var result = _.find([1, 2, 3], function(num){ return num * 2 === 4; });

    assert.strictEqual(result, 2, 'found the first "2" and broke the loop');

    var obj = {
      a: {x: 1, z: 3},
      b: {x: 2, z: 2},
      c: {x: 3, z: 4},
      d: {x: 4, z: 1}
    };


    assert.deepEqual(_.find(obj, {x: 2}), {x: 2, z: 2}, 'works on objects');

    assert.deepEqual(_.find(obj, {x: 2, z: 1}), void 0);

    assert.deepEqual(_.find(obj, function(x) {
      return x.x === 4;
    }), {x: 4, z: 1});

    _.findIndex([{a: 1}], function(a, key, o) {

      assert.strictEqual(key, 0);

      assert.deepEqual(o, [{a: 1}]);

      assert.strictEqual(this, _, 'called with context');
    }, _);
  });
  QUnit.test('detect', function(assert) {
    assert.strictEqual(_.detect, _.find, 'is an alias for find');
  });
  QUnit.test('filter', function(assert) {
    var evenArray = [1, 2, 3, 4, 5, 6];
    var evenObject = {one: 1, two: 2, three: 3};
    var isEven = function(num){ return num % 2 === 0; };

    assert.deepEqual(_.filter(evenArray, isEven), [2, 4, 6]);
    assert.deepEqual(_.filter(evenObject, isEven), [2], 'can filter objects');

    assert.deepEqual(_.filter([{}, evenObject, []], 'two'), [evenObject], 'predicate string map to object properties');

    _.filter([1], function() {
      assert.strictEqual(this, evenObject, 'given context');
    }, evenObject);

    // Can be used like _.where.
    var list = [{a: 1, b: 2}, {a: 2, b: 2}, {a: 1, b: 3}, {a: 1, b: 4}];
    assert.deepEqual(_.filter(list, {a: 1}), [{a: 1, b: 2}, {a: 1, b: 3}, {a: 1, b: 4}]);
    assert.deepEqual(_.filter(list, {b: 2}), [{a: 1, b: 2}, {a: 2, b: 2}]);
    assert.deepEqual(_.filter(list, {}), list, 'Empty object accepts all items');
    assert.deepEqual(_(list).filter({}), list, 'OO-filter');
  });
  QUnit.test('select', function(assert) {
    assert.strictEqual(_.select, _.filter, 'is an alias for filter');
  });
  QUnit.test('reject', function(assert) {
    var odds = _.reject([1, 2, 3, 4, 5, 6], function(num){ return num % 2 === 0; });
    assert.deepEqual(odds, [1, 3, 5], 'rejected each even number');

    var context = 'obj';

    var evens = _.reject([1, 2, 3, 4, 5, 6], function(num){
      assert.strictEqual(context, 'obj');
      return num % 2 !== 0;
    }, context);
    assert.deepEqual(evens, [2, 4, 6], 'rejected each odd number');

    assert.deepEqual(_.reject([odds, {one: 1, two: 2, three: 3}], 'two'), [odds], 'predicate string map to object properties');

    // Can be used like _.where.
    var list = [{a: 1, b: 2}, {a: 2, b: 2}, {a: 1, b: 3}, {a: 1, b: 4}];
    assert.deepEqual(_.reject(list, {a: 1}), [{a: 2, b: 2}]);
    assert.deepEqual(_.reject(list, {b: 2}), [{a: 1, b: 3}, {a: 1, b: 4}]);
    assert.deepEqual(_.reject(list, {}), [], 'Returns empty list given empty object');
  });
  QUnit.test('every', function(assert) {
    assert.ok(_.every([], _.identity), 'the empty set');
    assert.ok(_.every([true, true, true], _.identity), 'every true values');
    assert.notOk(_.every([true, false, true], _.identity), 'one false value');
    assert.ok(_.every([0, 10, 28], function(num){ return num % 2 === 0; }), 'even numbers');
    assert.notOk(_.every([0, 11, 28], function(num){ return num % 2 === 0; }), 'an odd number');
    assert.strictEqual(_.every([1], _.identity), true, 'cast to boolean - true');
    assert.strictEqual(_.every([0], _.identity), false, 'cast to boolean - false');
    assert.notOk(_.every([void 0, void 0, void 0], _.identity), 'works with arrays of undefined');

    var list = [{a: 1, b: 2}, {a: 2, b: 2}, {a: 1, b: 3}, {a: 1, b: 4}];
    assert.notOk(_.every(list, {a: 1, b: 2}), 'Can be called with object');
    assert.ok(_.every(list, 'a'), 'String mapped to object property');

    list = [{a: 1, b: 2}, {a: 2, b: 2, c: true}];
    assert.ok(_.every(list, {b: 2}), 'Can be called with object');
    assert.notOk(_.every(list, 'c'), 'String mapped to object property');

    assert.ok(_.every({a: 1, b: 2, c: 3, d: 4}, _.isNumber), 'takes objects');
    assert.notOk(_.every({a: 1, b: 2, c: 3, d: 4}, _.isObject), 'takes objects');
    assert.ok(_.every(['a', 'b', 'c', 'd'], _.hasOwnProperty, {a: 1, b: 2, c: 3, d: 4}), 'context works');
    assert.notOk(_.every(['a', 'b', 'c', 'd', 'f'], _.hasOwnProperty, {a: 1, b: 2, c: 3, d: 4}), 'context works');
  });
  QUnit.test('all', function(assert) {
    assert.strictEqual(_.all, _.every, 'is an alias for every');
  });
  QUnit.test('some', function(assert) {
    assert.notOk(_.some([]), 'the empty set');
    assert.notOk(_.some([false, false, false]), 'all false values');
    assert.ok(_.some([false, false, true]), 'one true value');
    assert.ok(_.some([null, 0, 'yes', false]), 'a string');
    assert.notOk(_.some([null, 0, '', false]), 'falsy values');
    assert.notOk(_.some([1, 11, 29], function(num){ return num % 2 === 0; }), 'all odd numbers');
    assert.ok(_.some([1, 10, 29], function(num){ return num % 2 === 0; }), 'an even number');
    assert.strictEqual(_.some([1], _.identity), true, 'cast to boolean - true');
    assert.strictEqual(_.some([0], _.identity), false, 'cast to boolean - false');
    assert.ok(_.some([false, false, true]));

    var list = [{a: 1, b: 2}, {a: 2, b: 2}, {a: 1, b: 3}, {a: 1, b: 4}];
    assert.notOk(_.some(list, {a: 5, b: 2}), 'Can be called with object');
    assert.ok(_.some(list, 'a'), 'String mapped to object property');

    list = [{a: 1, b: 2}, {a: 2, b: 2, c: true}];
    assert.ok(_.some(list, {b: 2}), 'Can be called with object');
    assert.notOk(_.some(list, 'd'), 'String mapped to object property');

    assert.ok(_.some({a: '1', b: '2', c: '3', d: '4', e: 6}, _.isNumber), 'takes objects');
    assert.notOk(_.some({a: 1, b: 2, c: 3, d: 4}, _.isObject), 'takes objects');
    assert.ok(_.some(['a', 'b', 'c', 'd'], _.hasOwnProperty, {a: 1, b: 2, c: 3, d: 4}), 'context works');
    assert.notOk(_.some(['x', 'y', 'z'], _.hasOwnProperty, {a: 1, b: 2, c: 3, d: 4}), 'context works');
  });
  QUnit.test('any', function(assert) {
    assert.strictEqual(_.any, _.some, 'is an alias for some');
  });
  QUnit.test('invoke', function(assert) {
    assert.expect(13);
    var list = [[5, 1, 7], [3, 2, 1]];
    var result = _.invoke(list, 'sort');
    assert.deepEqual(result[0], [1, 5, 7], 'first array sorted');
    assert.deepEqual(result[1], [1, 2, 3], 'second array sorted');

    _.invoke([{
      method: function() {
        assert.deepEqual(_.toArray(arguments), [1, 2, 3], 'called with arguments');
      }
    }], 'method', 1, 2, 3);

    assert.deepEqual(_.invoke([{a: null}, {}, {a: _.constant(1)}], 'a'), [null, void 0, 1], 'handles null & undefined');

    assert.raises(function() {
      _.invoke([{a: 1}], 'a');
    }, TypeError, 'throws for non-functions');

    var getFoo = _.constant('foo');
    var getThis = function() { return this; };
    var item = {
      a: {
        b: getFoo,
        c: getThis,
        d: null
      },
      e: getFoo,
      f: getThis,
      g: function() {
        return {
          h: getFoo
        };
      }
    };
    var arr = [item];
    assert.deepEqual(_.invoke(arr, ['a', 'b']), ['foo'], 'supports deep method access via an array syntax');
    assert.deepEqual(_.invoke(arr, ['a', 'c']), [item.a], 'executes deep methods on their direct parent');
    assert.deepEqual(_.invoke(arr, ['a', 'd', 'z']), [void 0], 'does not try to access attributes of non-objects');
    assert.deepEqual(_.invoke(arr, ['a', 'd']), [null], 'handles deep null values');
    assert.deepEqual(_.invoke(arr, ['e']), ['foo'], 'handles path arrays of length one');
    assert.deepEqual(_.invoke(arr, ['f']), [item], 'correct uses parent context with shallow array syntax');
    assert.deepEqual(_.invoke(arr, ['g', 'h']), [void 0], 'does not execute intermediate functions');

    arr = [{
      a: function() { return 'foo'; }
    }, {
      a: function() { return 'bar'; }
    }];
    assert.deepEqual(_.invoke(arr, 'a'), ['foo', 'bar'], 'can handle different methods on subsequent objects');
  });
  QUnit.test('invoke w/ function reference', function(assert) {
    var list = [[5, 1, 7], [3, 2, 1]];
    var result = _.invoke(list, Array.prototype.sort);
    assert.deepEqual(result[0], [1, 5, 7], 'first array sorted');
    assert.deepEqual(result[1], [1, 2, 3], 'second array sorted');

    assert.deepEqual(_.invoke([1, 2, 3], function(a) {
      return a + this;
    }, 5), [6, 7, 8], 'receives params from invoke');
  });
  QUnit.test('invoke when strings have a call method', function(assert) {
    String.prototype.call = function() {
      return 42;
    };
    var list = [[5, 1, 7], [3, 2, 1]];
    var s = 'foo';
    assert.strictEqual(s.call(), 42, 'call function exists');
    var result = _.invoke(list, 'sort');
    assert.deepEqual(result[0], [1, 5, 7], 'first array sorted');
    assert.deepEqual(result[1], [1, 2, 3], 'second array sorted');
    delete String.prototype.call;
    assert.strictEqual(s.call, void 0, 'call function removed');
  });
  QUnit.test('pluck', function(assert) {
    var people = [{name: 'moe', age: 30}, {name: 'curly', age: 50}];
    assert.deepEqual(_.pluck(people, 'name'), ['moe', 'curly'], 'pulls names out of objects');
    assert.deepEqual(_.pluck(people, 'address'), [void 0, void 0], 'missing properties are returned as undefined');
    //compat: most flexible handling of edge cases
    assert.deepEqual(_.pluck([{'[object Object]': 1}], {}), [1]);
  });
  QUnit.test('where', function(assert) {
    var list = [{a: 1, b: 2}, {a: 2, b: 2}, {a: 1, b: 3}, {a: 1, b: 4}];
    var result = _.where(list, {a: 1});
    assert.strictEqual(result.length, 3);
    assert.strictEqual(result[result.length - 1].b, 4);
    result = _.where(list, {b: 2});
    assert.strictEqual(result.length, 2);
    assert.strictEqual(result[0].a, 1);
    result = _.where(list, {});
    assert.strictEqual(result.length, list.length);

    function test() {}
    test.map = _.map;
    assert.deepEqual(_.where([_, {a: 1, b: 2}, _], test), [_, _], 'checks properties given function');
  });
  QUnit.test('findWhere', function(assert) {
    var list = [{a: 1, b: 2}, {a: 2, b: 2}, {a: 1, b: 3}, {a: 1, b: 4}, {a: 2, b: 4}];
    var result = _.findWhere(list, {a: 1});
    assert.deepEqual(result, {a: 1, b: 2});
    result = _.findWhere(list, {b: 4});
    assert.deepEqual(result, {a: 1, b: 4});

    result = _.findWhere(list, {c: 1});
    assert.ok(_.isUndefined(result), 'undefined when not found');

    result = _.findWhere([], {c: 1});
    assert.ok(_.isUndefined(result), 'undefined when searching empty list');

    function test() {}
    test.map = _.map;
    assert.strictEqual(_.findWhere([_, {a: 1, b: 2}, _], test), _, 'checks properties given function');

    function TestClass() {
      this.y = 5;
      this.x = 'foo';
    }
    var expect = {c: 1, x: 'foo', y: 5};
    assert.deepEqual(_.findWhere([{y: 5, b: 6}, expect], new TestClass()), expect, 'uses class instance properties');
  });
  QUnit.test('max', function(assert) {
    assert.strictEqual(-Infinity, _.max(null), 'can handle null/undefined');
    assert.strictEqual(-Infinity, _.max(void 0), 'can handle null/undefined');
    assert.strictEqual(-Infinity, _.max(null, _.identity), 'can handle null/undefined');

    assert.strictEqual(_.max([1, 2, 3]), 3, 'can perform a regular Math.max');

    var neg = _.max([1, 2, 3], function(num){ return -num; });
    assert.strictEqual(neg, 1, 'can perform a computation-based max');

    assert.strictEqual(-Infinity, _.max({}), 'Maximum value of an empty object');
    assert.strictEqual(-Infinity, _.max([]), 'Maximum value of an empty array');
    assert.strictEqual(_.max({a: 'a'}), -Infinity, 'Maximum value of a non-numeric collection');

    assert.strictEqual(_.max(_.range(1, 300000)), 299999, 'Maximum value of a too-big array');

    assert.strictEqual(_.max([1, 2, 3, 'test']), 3, 'Finds correct max in array starting with num and containing a NaN');
    assert.strictEqual(_.max(['test', 1, 2, 3]), 3, 'Finds correct max in array starting with NaN');

    assert.strictEqual(_.max([1, 2, 3, null]), 3, 'Finds correct max in array starting with num and containing a `null`');
    assert.strictEqual(_.max([null, 1, 2, 3]), 3, 'Finds correct max in array starting with a `null`');

    assert.strictEqual(_.max([1, 2, 3, '']), 3, 'Finds correct max in array starting with num and containing an empty string');
    assert.strictEqual(_.max(['', 1, 2, 3]), 3, 'Finds correct max in array starting with an empty string');

    assert.strictEqual(_.max([1, 2, 3, false]), 3, 'Finds correct max in array starting with num and containing a false');
    assert.strictEqual(_.max([false, 1, 2, 3]), 3, 'Finds correct max in array starting with a false');

    assert.strictEqual(_.max([0, 1, 2, 3, 4]), 4, 'Finds correct max in array containing a zero');
    assert.strictEqual(_.max([-3, -2, -1, 0]), 0, 'Finds correct max in array containing negative numbers');

    assert.deepEqual(_.map([[1, 2, 3], [4, 5, 6]], _.max), [3, 6], 'Finds correct max in array when mapping through multiple arrays');

    var a = {x: -Infinity};
    var b = {x: -Infinity};
    var iterator = function(o){ return o.x; };
    assert.strictEqual(_.max([a, b], iterator), a, 'Respects iterator return value of -Infinity');

    assert.deepEqual(_.max([{a: 1}, {a: 0, b: 3}, {a: 4}, {a: 2}], 'a'), {a: 4}, 'String keys use property iterator');

    assert.deepEqual(_.max([0, 2], function(c){ return c * this.x; }, {x: 1}), 2, 'Iterator context');
    assert.deepEqual(_.max([[1], [2, 3], [-1, 4], [5]], 0), [5], 'Lookup falsy iterator');
    assert.deepEqual(_.max([{0: 1}, {0: 2}, {0: -1}, {a: 1}], 0), {0: 2}, 'Lookup falsy iterator');
  });
  QUnit.test('min', function(assert) {
    assert.strictEqual(_.min(null), Infinity, 'can handle null/undefined');
    assert.strictEqual(_.min(void 0), Infinity, 'can handle null/undefined');
    assert.strictEqual(_.min(null, _.identity), Infinity, 'can handle null/undefined');

    assert.strictEqual(_.min([1, 2, 3]), 1, 'can perform a regular Math.min');

    var neg = _.min([1, 2, 3], function(num){ return -num; });
    assert.strictEqual(neg, 3, 'can perform a computation-based min');

    assert.strictEqual(_.min({}), Infinity, 'Minimum value of an empty object');
    assert.strictEqual(_.min([]), Infinity, 'Minimum value of an empty array');
    assert.strictEqual(_.min({a: 'a'}), Infinity, 'Minimum value of a non-numeric collection');

    assert.deepEqual(_.map([[1, 2, 3], [4, 5, 6]], _.min), [1, 4], 'Finds correct min in array when mapping through multiple arrays');

    var now = new Date(9999999999);
    var then = new Date(0);
    assert.strictEqual(_.min([now, then]), then);

    assert.strictEqual(_.min(_.range(1, 300000)), 1, 'Minimum value of a too-big array');

    assert.strictEqual(_.min([1, 2, 3, 'test']), 1, 'Finds correct min in array starting with num and containing a NaN');
    assert.strictEqual(_.min(['test', 1, 2, 3]), 1, 'Finds correct min in array starting with NaN');

    assert.strictEqual(_.min([1, 2, 3, null]), 1, 'Finds correct min in array starting with num and containing a `null`');
    assert.strictEqual(_.min([null, 1, 2, 3]), 1, 'Finds correct min in array starting with a `null`');

    assert.strictEqual(_.min([0, 1, 2, 3, 4]), 0, 'Finds correct min in array containing a zero');
    assert.strictEqual(_.min([-3, -2, -1, 0]), -3, 'Finds correct min in array containing negative numbers');

    var a = {x: Infinity};
    var b = {x: Infinity};
    var iterator = function(o){ return o.x; };
    assert.strictEqual(_.min([a, b], iterator), a, 'Respects iterator return value of Infinity');

    assert.deepEqual(_.min([{a: 1}, {a: 0, b: 3}, {a: 4}, {a: 2}], 'a'), {a: 0, b: 3}, 'String keys use property iterator');

    assert.deepEqual(_.min([0, 2], function(c){ return c * this.x; }, {x: -1}), 2, 'Iterator context');
    assert.deepEqual(_.min([[1], [2, 3], [-1, 4], [5]], 0), [-1, 4], 'Lookup falsy iterator');
    assert.deepEqual(_.min([{0: 1}, {0: 2}, {0: -1}, {a: 1}], 0), {0: -1}, 'Lookup falsy iterator');
  });
  QUnit.test('sortBy', function(assert) {
    var people = [{name: 'curly', age: 50}, {name: 'moe', age: 30}];
    people = _.sortBy(people, function(person){ return person.age; });
    assert.deepEqual(_.pluck(people, 'name'), ['moe', 'curly'], 'stooges sorted by age');

    var list = [void 0, 4, 1, void 0, 3, 2];
    assert.deepEqual(_.sortBy(list, _.identity), [1, 2, 3, 4, void 0, void 0], 'sortBy with undefined values');

    list = ['one', 'two', 'three', 'four', 'five'];
    var sorted = _.sortBy(list, 'length');
    assert.deepEqual(sorted, ['one', 'two', 'four', 'five', 'three'], 'sorted by length');

    function Pair(x, y) {
      this.x = x;
      this.y = y;
    }

    var stableArray = [
      new Pair(1, 1), new Pair(1, 2),
      new Pair(1, 3), new Pair(1, 4),
      new Pair(1, 5), new Pair(1, 6),
      new Pair(2, 1), new Pair(2, 2),
      new Pair(2, 3), new Pair(2, 4),
      new Pair(2, 5), new Pair(2, 6),
      new Pair(void 0, 1), new Pair(void 0, 2),
      new Pair(void 0, 3), new Pair(void 0, 4),
      new Pair(void 0, 5), new Pair(void 0, 6)
    ];

    var stableObject = _.object('abcdefghijklmnopqr'.split(''), stableArray);

    var actual = _.sortBy(stableArray, function(pair) {
      return pair.x;
    });

    assert.deepEqual(actual, stableArray, 'sortBy should be stable for arrays');
    assert.deepEqual(_.sortBy(stableArray, 'x'), stableArray, 'sortBy accepts property string');

    actual = _.sortBy(stableObject, function(pair) {
      return pair.x;
    });

    assert.deepEqual(actual, stableArray, 'sortBy should be stable for objects');

    list = ['q', 'w', 'e', 'r', 't', 'y'];
    assert.deepEqual(_.sortBy(list), ['e', 'q', 'r', 't', 'w', 'y'], 'uses _.identity if iterator is not specified');
  });
  QUnit.test('groupBy', function(assert) {
    var parity = _.groupBy([1, 2, 3, 4, 5, 6], function(num){ return num % 2; });
    assert.ok('0' in parity && '1' in parity, 'created a group for each value');
    assert.deepEqual(parity[0], [2, 4, 6], 'put each even number in the right group');

    var list = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
    var grouped = _.groupBy(list, 'length');
    assert.deepEqual(grouped['3'], ['one', 'two', 'six', 'ten']);
    assert.deepEqual(grouped['4'], ['four', 'five', 'nine']);
    assert.deepEqual(grouped['5'], ['three', 'seven', 'eight']);

    var context = {};
    _.groupBy([{}], function(){ assert.strictEqual(this, context); }, context);

    grouped = _.groupBy([4.2, 6.1, 6.4], function(num) {
      return Math.floor(num) > 4 ? 'hasOwnProperty' : 'constructor';
    });
    assert.strictEqual(grouped.constructor.length, 1);
    assert.strictEqual(grouped.hasOwnProperty.length, 2);

    var array = [{}];
    _.groupBy(array, function(value, index, obj){ assert.strictEqual(obj, array); });

    array = [1, 2, 1, 2, 3];
    grouped = _.groupBy(array);
    assert.strictEqual(grouped['1'].length, 2);
    assert.strictEqual(grouped['3'].length, 1);

    var matrix = [
      [1, 2],
      [1, 3],
      [2, 3]
    ];
    assert.deepEqual(_.groupBy(matrix, 0), {1: [[1, 2], [1, 3]], 2: [[2, 3]]});
    assert.deepEqual(_.groupBy(matrix, 1), {2: [[1, 2]], 3: [[1, 3], [2, 3]]});

    var liz = {name: 'Liz', stats: {power: 10}};
    var chelsea = {name: 'Chelsea', stats: {power: 10}};
    var jordan = {name: 'Jordan', stats: {power: 6}};
    var collection = [liz, chelsea, jordan];
    var expected = {
      10: [liz, chelsea],
      6: [jordan]
    };
    assert.deepEqual(_.groupBy(collection, ['stats', 'power']), expected, 'can group by deep properties');
  });
  QUnit.test('indexBy', function(assert) {
    var parity = _.indexBy([1, 2, 3, 4, 5], function(num){ return num % 2 === 0; });
    assert.strictEqual(parity['true'], 4);
    assert.strictEqual(parity['false'], 5);

    var list = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
    var grouped = _.indexBy(list, 'length');
    assert.strictEqual(grouped['3'], 'ten');
    assert.strictEqual(grouped['4'], 'nine');
    assert.strictEqual(grouped['5'], 'eight');

    var array = [1, 2, 1, 2, 3];
    grouped = _.indexBy(array);
    assert.strictEqual(grouped['1'], 1);
    assert.strictEqual(grouped['2'], 2);
    assert.strictEqual(grouped['3'], 3);
  });
  QUnit.test('countBy', function(assert) {
    var parity = _.countBy([1, 2, 3, 4, 5], function(num){ return num % 2 === 0; });
    assert.strictEqual(parity['true'], 2);
    assert.strictEqual(parity['false'], 3);

    var list = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
    var grouped = _.countBy(list, 'length');
    assert.strictEqual(grouped['3'], 4);
    assert.strictEqual(grouped['4'], 3);
    assert.strictEqual(grouped['5'], 3);

    var context = {};
    _.countBy([{}], function(){ assert.strictEqual(this, context); }, context);

    grouped = _.countBy([4.2, 6.1, 6.4], function(num) {
      return Math.floor(num) > 4 ? 'hasOwnProperty' : 'constructor';
    });
    assert.strictEqual(grouped.constructor, 1);
    assert.strictEqual(grouped.hasOwnProperty, 2);

    var array = [{}];
    _.countBy(array, function(value, index, obj){ assert.strictEqual(obj, array); });

    array = [1, 2, 1, 2, 3];
    grouped = _.countBy(array);
    assert.strictEqual(grouped['1'], 2);
    assert.strictEqual(grouped['3'], 1);
  });
  QUnit.test('shuffle', function(assert) {
    assert.deepEqual(_.shuffle([1]), [1], 'behaves correctly on size 1 arrays');
    var numbers = _.range(20);
    var shuffled = _.shuffle(numbers);
    assert.notDeepEqual(numbers, shuffled, 'does change the order'); // Chance of false negative: 1 in ~2.4*10^18
    assert.notStrictEqual(numbers, shuffled, 'original object is unmodified');
    assert.deepEqual(numbers, _.sortBy(shuffled), 'contains the same members before and after shuffle');

    shuffled = _.shuffle({a: 1, b: 2, c: 3, d: 4});
    assert.strictEqual(shuffled.length, 4);
    assert.deepEqual(shuffled.sort(), [1, 2, 3, 4], 'works on objects');
  });
  QUnit.test('sample', function(assert) {
    assert.strictEqual(_.sample([1]), 1, 'behaves correctly when no second parameter is given');
    assert.deepEqual(_.sample([1, 2, 3], -2), [], 'behaves correctly on negative n');
    var numbers = _.range(10);
    var allSampled = _.sample(numbers, 10).sort();
    assert.deepEqual(allSampled, numbers, 'contains the same members before and after sample');
    allSampled = _.sample(numbers, 20).sort();
    assert.deepEqual(allSampled, numbers, 'also works when sampling more objects than are present');
    assert.ok(_.contains(numbers, _.sample(numbers)), 'sampling a single element returns something from the array');
    assert.strictEqual(_.sample([]), void 0, 'sampling empty array with no number returns undefined');
    assert.notStrictEqual(_.sample([], 5), [], 'sampling empty array with a number returns an empty array');
    assert.notStrictEqual(_.sample([1, 2, 3], 0), [], 'sampling an array with 0 picks returns an empty array');
    assert.deepEqual(_.sample([1, 2], -1), [], 'sampling a negative number of picks returns an empty array');
    assert.ok(_.contains([1, 2, 3], _.sample({a: 1, b: 2, c: 3})), 'sample one value from an object');
    var partialSample = _.sample(_.range(1000), 10);
    var partialSampleSorted = partialSample.sort();
    assert.notDeepEqual(partialSampleSorted, _.range(10), 'samples from the whole array, not just the beginning');
  });
  QUnit.test('toArray', function(assert) {
    assert.notOk(_.isArray(arguments), 'arguments object is not an array');
    assert.ok(_.isArray(_.toArray(arguments)), 'arguments object converted into array');
    var a = [1, 2, 3];
    assert.notStrictEqual(_.toArray(a), a, 'array is cloned');
    assert.deepEqual(_.toArray(a), [1, 2, 3], 'cloned array contains same elements');

    var numbers = _.toArray({one: 1, two: 2, three: 3});
    assert.deepEqual(numbers, [1, 2, 3], 'object flattened into array');

    var hearts = '\uD83D\uDC95';
    var pair = hearts.split('');
    var expected = [pair[0], hearts, '&', hearts, pair[1]];
    assert.deepEqual(_.toArray(expected.join('')), expected, 'maintains astral characters');
    assert.deepEqual(_.toArray(''), [], 'empty string into empty array');

    if (typeof document != 'undefined') {
      // test in IE < 9
      var actual;
      try {
        actual = _.toArray(document.childNodes);
      } catch (e) { /* ignored */ }
      assert.deepEqual(actual, _.map(document.childNodes, _.identity), 'works on NodeList');
    }
  });
  QUnit.test('size', function(assert) {
    assert.strictEqual(_.size({one: 1, two: 2, three: 3}), 3, 'can compute the size of an object');
    assert.strictEqual(_.size([1, 2, 3]), 3, 'can compute the size of an array');
    assert.strictEqual(_.size({length: 3, 0: 0, 1: 0, 2: 0}), 3, 'can compute the size of Array-likes');

    var func = function() {
      return _.size(arguments);
    };

    assert.strictEqual(func(1, 2, 3, 4), 4, 'can test the size of the arguments object');

    assert.strictEqual(_.size('hello'), 5, 'can compute the size of a string literal');
    assert.strictEqual(_.size(new String('hello')), 5, 'can compute the size of string object');

    assert.strictEqual(_.size(null), 0, 'handles nulls');
    assert.strictEqual(_.size(0), 0, 'handles numbers');
  });
  QUnit.test('partition', function(assert) {
    var list = [0, 1, 2, 3, 4, 5];
    assert.deepEqual(_.partition(list, function(x) { return x < 4; }), [[0, 1, 2, 3], [4, 5]], 'handles bool return values');
    assert.deepEqual(_.partition(list, function(x) { return x & 1; }), [[1, 3, 5], [0, 2, 4]], 'handles 0 and 1 return values');
    assert.deepEqual(_.partition(list, function(x) { return x - 3; }), [[0, 1, 2, 4, 5], [3]], 'handles other numeric return values');
    assert.deepEqual(_.partition(list, function(x) { return x > 1 ? null : true; }), [[0, 1], [2, 3, 4, 5]], 'handles null return values');
    assert.deepEqual(_.partition(list, function(x) { if (x < 2) return true; }), [[0, 1], [2, 3, 4, 5]], 'handles undefined return values');
    assert.deepEqual(_.partition({a: 1, b: 2, c: 3}, function(x) { return x > 1; }), [[2, 3], [1]], 'handles objects');

    assert.deepEqual(_.partition(list, function(x, index) { return index % 2; }), [[1, 3, 5], [0, 2, 4]], 'can reference the array index');
    assert.deepEqual(_.partition(list, function(x, index, arr) { return x === arr.length - 1; }), [[5], [0, 1, 2, 3, 4]], 'can reference the collection');

    // Default iterator
    assert.deepEqual(_.partition([1, false, true, '']), [[1, true], [false, '']], 'Default iterator');
    assert.deepEqual(_.partition([{x: 1}, {x: 0}, {x: 1}], 'x'), [[{x: 1}, {x: 1}], [{x: 0}]], 'Takes a string');

    // Context
    var predicate = function(x){ return x === this.x; };
    assert.deepEqual(_.partition([1, 2, 3], predicate, {x: 2}), [[2], [1, 3]], 'partition takes a context argument');

    assert.deepEqual(_.partition([{a: 1}, {b: 2}, {a: 1, b: 2}], {a: 1}), [[{a: 1}, {a: 1, b: 2}], [{b: 2}]], 'predicate can be object');

    var object = {a: 1};
    _.partition(object, function(val, key, obj) {
      assert.strictEqual(val, 1);
      assert.strictEqual(key, 'a');
      assert.strictEqual(obj, object);
      assert.strictEqual(this, predicate);
    }, predicate);
  });
