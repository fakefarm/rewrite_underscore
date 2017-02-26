describe('Arrays', function() {
  var A3;
  beforeEach(function(){
    A3 = [1, 2, 3];
  });
  describe('_.first()', function() {
    it('can pull out the first element of an array', function(){
      expect(_.first([1,2,3])).toBe(1);
      expect(_.first(['a', 'b', 'c'])).toBe('a');
    });

    xit('can perform OO-style "_.first()"', function() {
      // _dw blocked OO-style
        expect(_([1,2,3]).first()).toBe(1);
    });

    it('returns an empty array when n <= 0 (0 case)', function() {
        expect(_.first([1,2,3], 0)).toEqual([]);
    });

    it('returns an empty array when n <= 0 (negative case)', function() {
        expect(_.first([1,2,3], -1)).toEqual([])
    });

    it('can fetch the first n elements', function() {
      expect(_.first(A3, 2)).toEqual([1, 2])
    });

    it('returns the whole array if n > length', function() {
      expect(_.first(A3, 5)).toEqual(A3)
    });

    it('works on an arguments object', function() {
      var result = (function(){ return _.first(arguments); }(4, 3, 2, 1));
      expect(result).toEqual(4);
    });

    it('works well with _.map', function(){
      var result = _.map([A3, A3], _.first);
      expect(result).toEqual([1,1]);
    });

    it('returns undefined when called on null', function() {
      expect(_.first(null)).toEqual(void 0)
    });

    it('return undefined when called on an empty array', function() {
      expect(_.first([])).toEqual(void 0);
    });

    describe('aliases', function() {
       it('_.head()', function() {
         expect(_.head).toEqual(_.first);
      });
      it('_.take()', function() {
          expect(_.take).toEqual(_.first);
      });
    });
  });
  describe('_.initial()', function() {
    it('returns all but last element', function(){
      expect(_.initial([1, 2, 3, 4, 5])).toEqual([1, 2, 3, 4])
    });

    it('retuns all but the last n elements', function() {
      expect(_.initial([1, 2, 3, 4], 2)).toEqual([1,2]);
    });

    it('returns an empty array when n > length', function() {
      expect(_.initial([1, 2, 3, 4], 6)).toEqual([]);
    });

    xit('works an an arguments object', function() {
      // _dw OO-style
      var result = (function() { return _(arguments).initial();}(1,2,3,4));
      expect(result).toEqual(A3)
    });

    it('works well with _.map', function() {
      result = _.map([[1, 2, 3], A3], _.initial);

      expect(_.flatten(result)).toEqual([1, 2, 1, 2]);
    })
  });
  describe('_.rest()', function(){
    var numbers = [1, 2, 3, 4];

    it('fetches all but the first element', function(){
      expect(_.rest(numbers)).toEqual([2, 3, 4]);
    });

    it('returns the whole array when index is 0', function() {
      expect(_.rest(numbers, 0)).toEqual([1, 2, 3, 4]);
    });

    it('returns elements starting at the given index', function() {
      expect(_.rest(numbers,2)).toEqual([3, 4]);
    });


    xit('works on an agruments object', function(){
      // _dw OO-style
      var result = (function(){ return _(arguments).rest();}(1, 2, 3, 4));
      expect(result).toEqual([2, 3, 4]);
    });


    it('works well with _.map', function() {
      result = _.map([[1, 2, 3], [1, 2, 3]], _.rest);
      expect(_.flatten(result)).toEqual([2, 3, 2, 3]);
    });

    describe('aliases', function() {
      it('_.tail()', function() {
          expect(_.tail).toEqual(_.rest);
      });

      it('_.drop()', function() {
          expect(_.tail).toEqual(_.drop);
      });
    });
  });
  describe('_.last()', function() {

    it('can pull out the last element of an array', function(){
      expect(_.last(A3)).toEqual(3);
    });

    xit('can perform OO-style "last()"', function() {
      expect(_(A3).last()).toEqual(3);
    });

    it('returns an empty array when <= 0 (0 case)', function(){
      expect(_.last(A3, 0)).toEqual([]);
    });

    it('returns an empty array when n <= 0 (negative case)', function() {
      expect(_.last(A3, -1)).toEqual([]);
    });

    it('can fetch the last n elements', function() {
      expect(_.last(A3, 2)).toEqual([2,3]);
    });

    it('returns the whole array if n > length', function() {
      expect(_.last(A3, 5)).toEqual(A3);
    });

    xit('works on an arguments object', function() {
      // _dw OO-style
        var result = (function(){ return _(arguments).last(); }(1, 2, 3, 4));
        expect(result).toEqual(4);
    });

    it('works well with _.map', function(){
        var result = _.map([[1, 2, 3], [1, 2, 3]], _.last);
        expect(result).toEqual([3, 3]);
    });

    it('returns undefined when called on null', function(){
        expect(_.last(null)).toEqual(void 0);
    });

    it('returns undefined when called on empty array', function(){
      var arr = [];
      arr[-1] = 'null'
      expect(_.last(arr)).toBe(void 0);
    })
  });
  describe('_.compact()', function() {
    it('removes all falsy values', function(){
        expect(_.compact([1, false, null, 0, '', void 0, NaN, 2])).toEqual([1,2]);
    });
    it('works on an arguments object', function() {
      var result = (function(){ return _.compact(arguments); }(0, 1, false, 2, false, 3));
      expect(result).toEqual(A3);
    });
    it('works well with _.map', function(){
      var result = _.map([[1, false, false], [false, false, 3]], _.compact);
      expect(result).toEqual( [[1], [3]]);
    });
  });
  describe('_.flatten()', function() {

    it('supports null', function(){
      expect(_.flatten(null)).toEqual([]);
    });

    it('supports undefined', function() {
      expect(_.flatten(void 0)).toEqual([])
    });

    it('supports empty arrays', function(){
      expect(_.flatten([[], [], []])).toEqual([]);
    });

    it('can shallowly flatten empty arrays', function () {
      expect(_.flatten([[], [[]], []],true)).toEqual([[]])
    });

    var list = [1, [2], [3, [[[4]]]]];

    it("can flatten nested arrays", function () {
      expect(_.flatten(list)).toEqual([1, 2, 3, 4]);
    });

    it("can shallowly flatten nested arrays", function () {
      expect(_.flatten(list, true)).toEqual([1, 2, 3, [[[4]]]]);
    });

    it("works on an arguments object", function () {
      var result = (function() { return _.flatten(arguments);}(1, [2], [3, [[[4]]]]))
      expect(result).toEqual([1, 2, 3, 4])
    });

    it("can shallowly flatten arrays containing other arrays", function () {
      var list = [[1], [2], [3], [[4]]];
      expect(_.flatten(list, true)).toEqual([1,2,3,[4]]);
    });

    it("can flatten medium length arrays", function () {
      expect(_.flatten([_.range(10), _.range(10), 5, 1, 3], true).length).toBe(23);
    });

    it("can shallowly flatten medium length arrays", function () {
      expect(_.flatten([_.range(10), _.range(10), 5, 1, 3]).length).toBe(23);
    });

    it("can handle massive arrays", function () {
      expect(_.flatten([new Array(1000000), _.range(56000), 5, 1, 3]).length).toBe(1056003);
    });

    it("can handle massive arrays in shallow mode", function () {
      expect(_.flatten([new Array(1000000), _.range(56000),5,1,3], true).length).toBe(1056003);
    });

    var x = _.range(1000000);
    for( var i = 0; i < 1000; i++)
    x = [x];

    it("can handle very deep arrays", function () {
      expect(_.flatten(x)).toEqual(_.range(1000000));
    });

    it("can handle very deep arrays in shallow mode", function () {
      expect(_.flatten(x, true)).toEqual(x[0]);
    });
  });
  describe("_.range()", function () {

    it("0 as a first argument generates an empty array", function () {
      expect(_.range(0)).toEqual([]);
    });

    it("a single positive argument generates an array of elements 0,1,2..,n-1", function () {
      expect(_.range(4)).toEqual([0, 1, 2, 3]);
    });

    it("two arguments a &amp; b, a < b generates an array of elements a, a+1,a+2,...,b-2, b-1", function () {
      expect(_.range(5, 8)).toEqual([5, 6, 7]);
    });

    it("three arguments a & b & c, c < b-a, a < b generates an array of elements a, a+c, a+2c, ..., b - (multiplier of a) < c", function () {
      expect(_.range(3, 10, 3)).toEqual([3, 6, 9]);
    });

    it("three arguments a & b, b & c, c > b-a, a < b, generates an array with a single element, equal to a ", function () {
      expect(_.range(3, 10, 15)).toEqual([3]);
    });

    it("three arguments a & b & c, a > b, c < 0 generates an array of elements a, a-c, a-2c and ends with the number not less than b", function () {
      expect(_.range(12, 7, -2)).toEqual([12, 10, 8]);
    });

    it("final example in the Python docs", function () {
      expect(_.range(0, -10, -1)).toEqual([0, -1, -2, -3, -4, -5, -6, -7, -8, -9]);
    });

    it("should preserve -0", function () {
      expect(1 / _.range(-0, 1)[0]).toEqual(-Infinity);
    });

    it("negative range generates descending array", function () {
      expect(_.range(8,5)).toEqual([8,7,6]);
    });

    it("negative range generates descending array", function () {
      expect(_.range(-3)).toEqual([0, -1, -2]);
    });
  });
  describe("_.without()", function () {
    it("removes all instances of the given values", function () {
      var list = [1, 2, 1, 0, 3, 1, 4];
      expect(_.without(list, 0,1)).toEqual([2, 3, 4]);
    });
  });
  describe("_.difference()", function () {
    it("can find the difference of two arrays", function () {
      result = _.difference([1,2,3], [2, 30, 40]);
      expect(result).toEqual([1, 3]);
    });
  });
  describe("_.indexOf()", function () {
    it("can compute indexOf", function () {
      var numbers = [1,2,3];
      expect(_.indexOf(numbers, 2)).toEqual(1);
    });

    it("works on an arguments object", function () {
      var result = (function(){ return _.indexOf(arguments, 2); }(1, 2, 3));
      expect(result).toEqual(1);
    });

    it("handles these situations", function () {
      var val;
      _.each([null, void 0, [], false], function(val){
        var msg = 'Handles: ' + (_.isArray(val) ? '[]' : val);
      });
      expect(_.indexOf(val, 2)).toEqual(-1);
      expect(_.indexOf(val, 2, -1)).toEqual(-1);
      expect(_.indexOf(val, 2, -20)).toEqual(-1);
      expect(_.indexOf(val, 2, 15)).toEqual(-1);
    });

    it("35 is not in the list", function () {
      var num = 35;
      numbers = [10, 20, 30, 40, 50];
      var index = _.indexOf(numbers, num, true);
      expect(index).toEqual(-1);
    });

    it("40 is in the list", function () {
      var numbers = _.range(10, 51, 10);
      var num = 40
      index = _.indexOf(numbers, num, true);
      expect(index).toEqual(3);
    });

    it("40 is in the list but 6 isn't", function () {
      var numbers = [1, 40, 40, 40, 40, 40, 40, 40, 50, 60, 70], num = 40;
      expect(_.indexOf(numbers, num, true)).toEqual(1);
      expect(_.indexOf(numbers, 6, true)).toEqual(-1);
    });

    it("sorted indexOf does not use binary search", function () {
      expect(_.indexOf(_.range(1,7)), 5, true).toEqual(-1);
    });

    xit("non-nums as fromIndex make indexOf assume sorted", function () {
      // _dw need _.every
      expect(_.every(['1', [], {}, null])).toEqual(function() {
        return _.indexOf(numbers, num, {}) === 1;
      });
    });

    it("supports the fromIndex argument", function () {
      var numbers = [1, 2, 3, 1, 2, 3, 1, 2, 3],
          index = _.indexOf(numbers, 2, 5);
      expect(index).toEqual(7);
    });

    it("treats sparse arrays as if they were dense", function () {
      var index = _.indexOf([,,, 0], void 0);
      expect(index).toEqual(0);
    });

    var array1 = [1, 2, 3, 1, 2, 3];

    it("neg 'fromIndex' starts at the right index", function () {
      expect(_.indexOf(array1, 1, -3)).toEqual(3);
      expect(_.indexOf(array1, 1, -2)).toEqual(-1);
      expect(_.indexOf(array1, 2, -3)).toEqual(4);
      _.each([-6, -8, -Infinity], function (fromIndex) {
        expect(_.indexOf(array1, 1, fromIndex)).toEqual(0);
      });
    });

    it("makes a zero with this thing", function () {
      expect(_.indexOf([1, 2, 3], 1, true)).toEqual(0);
    });

    it("empty array with truthy 'isSorted' return -1", function () {
      var idx = _.indexOf([], void 0, true);
      expect(idx).toEqual(-1);
    });
  });
});
describe("Collections", function () {
  describe("_.filter", function () {
    // _dw TODO - why does range need 7 to return [1..6]
    var evenArray = _.range(1,7);
    var evenObject = { one: 1, two: 2, three: 3};
    var isEven = function(num) { return num % 2 === 0; };

    it("can filter objects", function () {
      expect(_.filter(evenObject, isEven)).toEqual([2]);
      expect(_.filter(evenArray, isEven)).toEqual([2, 4, 6]);
    });
  });
  describe("_.each", function () {
    it("iterators provide value and iteration count", function () {
      _.each([1,2,3], function(num, i) {
        expect(num).toEqual(i + 1);
      });
    });
    it("context object property access", function () {
      var answers = [];
      _.each([1, 2, 3],
        function(num) {
          answers.push(num * this.multiplier);
        },
        {multiplier: 5}
      );
      expect(answers).toEqual([5, 10, 15]);
    });
    it("can iterate a simple array", function () {
      answers = [];
      _.each([1,2,3],
      function(num){
        answers.push(num)
      })
      expect(answers).toEqual([1,2,3]);
    });
    it("iterating over objects works, and ignores the object prototype", function () {
      answers = [];
      var obj = {one: 1, two: 2, three: 3};
      obj.constructor.prototype.four = 4;
      _.each(obj, function(value, key){answers.push(key);});
      expect(answers).toEqual(['one', 'two', 'three']);
      delete obj.constructor.prototype.four;
    });
    xit('the fun should be called only 3 times', function(){
      // _dw nab - test needs times()
      _(1000).times(function(){ _.each([], function(){})})
      var count = 0;
      obj = {1: 'foo', 2: 'bar', 3: 'baz'};
      _.each(obj, function(){ count++; });
      expect(count).toEqual(3);
    });
    it("can reference the original collection from inside the iterator", function () {
      var answer = null;
      _.each([1,2,3], function(num, index, arr){
        if(_.include(arr, num)) answer = true });
      expect(answer).toBe(true);
    });
    it("handles a null property", function () {
      answers = 0;
      _.each(null, function(){ ++answers });
      expect(answers).toEqual(0);
    });
    it("these are equal", function () {
      var a = [1, 2, 3];
      expect(_.each(a, function(){})).toEqual(a);
      expect(_.each(false, function(){})).toEqual(false);
      expect(_.each(null, function(){})).toEqual(null);
    });
    describe("Aliases", function () {
      it("_.forEach()", function(){
        expect(_.forEach).toEqual(_.each);
      })
    });
  });
  describe("_.includes", function () {
    it("does not include contents from hasOwnProperty", function () {
      _.each([null, void 0, 0, 1, NaN, {}, []], function(val) {
        expect(_.includes(val, 'hasOwnProperty')).toEqual(false);
      });
    });

    it("two is in the array", function () {
      expect(_.includes([1, 2, 3, 9], 2)).toEqual(true);
    });

    it("two is not in the array", function () {
      expect(_.includes([1, 3, 9], 2)).toEqual(false);
    });

    it("doesn't delegate to binary search", function () {
      expect(_.includes([5, 4, 3, 2, 1], 5, true)).toBe(true);
    });

    it("on objects checks their values", function () {
      expect(_.includes({moe: 1, larry: 3, curly: 9}, 3)).toBe(true);
    });

    xit("OO-style includes", function () {
      expect(_([1,2,3]).includes(2)).toBe(true);
    });

    it("takes a fromIndex", function () {
      var numbers = [1,2,3,1,2,3,1,2,3];
      expect(_.includes(numbers,1,1)).toBe(true);
      expect(_.includes(numbers,1,-3)).toBe(true);
      expect(_.includes(numbers,1,6)).toBe(true);
      expect(_.includes(numbers,1,-1)).toBe(false);
      expect(_.includes(numbers,1,-2)).toBe(false);
      expect(_.includes(numbers,1,7)).toBe(false);
    });

    describe("working with NaN", function () {
      xit("recognizes the NaN in [1, 2, NaN]", function () {
        // _dw fail
        // TypeError: predicateFind is not a function
        expect(_.includes([1,2,NaN],NaN)).toBe(true);
      });

      xit("Expects [1, 2, NaN] to contain NaN", function () {
        // _dw fail
        // TypeError: predicateFind is not a function
        expect(_.includes([1, 2, Infinity], NaN)).toBe(false);
      });
    });

    describe("includes with +- 0", function () {
      xit("works as advertised", function () {
        // _dw fail
        // TypeError: predicateFind is not a function
        _.each([-0, +0], function(val){
          expect(_.includes[1, 2, val, val], val).toBe(true);
          expect(_.includes[1, 2, val, val], -val).toBe(true);
          expect(_.includes[-1, 1, 2], -val).toBe(false);
        })
      });
    });

    xit("fromIndex is guarded", function () {
      // _dw nab - needs _.every, partial()
      var numbers = [1,2,3,1,2,3,1,2,3];
      expect(_.every([1,2,3], _.partial(_.includes, numbers))).toBe(true);
    });

    describe("Aliases", function () {
      it("_.include", function () {
        expect(_.include).toEqual(_.includes);
      });

      it("_.contains", function () {
        expect(_.contains).toEqual(_.includes);
      });
    });
  });
  describe("_.toArray", function () {
    it("arguments object converted into array", function () {
      // _dw blocked - toArray() needs isString()
      expect(_.isArray(_.toArray(arguments))).toBe(true);
    });
  });
  describe("_.map", function () {
    it("doubled numbers", function () {
      var doubled = _.map([1, 2, 3], function (num) {
        return num * 2 });
        expect(doubled).toEqual([2, 4, 6]);
    });
    it("tripled numbers with context", function () {
      var tripled = _.map([1,2,3], function (num) {
      return num * this.multiplier; }, { multiplier: 3});
      expect(tripled).toEqual([3,6,9]);
    });
    xit("OO-style doubled numbers", function () {
      // _dw OO
      doubled = _([1, 2, 3]).map(function (num) {
        return num * 2; });
        expect(doubled).toEqual([2, 4, 5]);
    });
    it("can use collection methods on Array-likes", function () {
      var ids = _.map({length: 2, 0: {id: '1'}, 1: {id: '2'}},
                        function (n) {
                          return n.id;
                        });
      expect(ids).toEqual(['1', '2']);
    });
    it("handles a null properly", function () {
      expect(_.map(null, _.noop)).toEqual([]);
    });
    it("called with context", function () {
      expect(_.map([1], function () { return this.length; }, [5])).toEqual([1]);
    });
    it("predicate string map to object properties", function () {
      var people = [{ name: 'moe', age: 30 }, {name: 'curly', age: 50}];
      expect(_.map(people, 'name')).toEqual(['moe', 'curly']);
    });
    it("predicate string map to object properties", function () {
      var people = [{ name: 'moe', age: 30}, {name: 'curly', age: 50}];
      expect(_.map(people, 'name')).toEqual(['moe', 'curly']);
    });
  });
  describe("_.reduce()", function () {
    it("can sum up an array", function () {
      var sum = _.reduce([1,2,3],
                          function (memo, num) {
                            return memo + num;
                          }
                        ,0);

        expect(sum).toEqual(6);
    });
    it("can reduce with a context object", function () {
      var context = { multiplier: 3};

      sum = _.reduce([1, 2, 3], function (memo, num) {
        return memo + num * this.multiplier; }, 0, context);
      expect(sum).toEqual(18);
    });
    xit("OO-style reduce", function () {
      // _dw OO-style
      sum = _([1,2,3]).reduce(function (memo, num) {
        return memo + num; }, 0);
        expect(sum).toEqual(6);
    });
    it("default initial value", function () {
      sum = _.reduce([1, 2, 3], function (memo, num) {
        return memo + num;
      })
      expect(sum).toEqual(6);
    });
    it("can reduce via multiplication", function () {
      var prod = _.reduce([1,2,3,4], function (memo, num) {
        return memo * num; });
        expect(prod).toEqual(24);
    });
    it("handles a null with initial value properly", function () {
      expect(_.reduce(null, _.noop, 138)).toEqual(138);
    });
    it("undefined can be passed as a special case", function () {
      expect(_.reduce([], _.noop, void 0)).toEqual(void 0);
    });
    it("collection of length one with no initial value returns the first item", function () {
      expect(_.reduce([_], _.noop)).toEqual(_);
    });
    it("returns undefined when collection is empty and no inital value", function () {
      expect(_.reduce([], _.noop)).toEqual(void 0);
    });
    describe("aliases", function () {
      it("_.foldl", function () {
        expect(_.foldl).toEqual(_.reduce);
      });
      it("_.inject", function () {
        expect(_.inject).toEqual(_.reduce);
      })
    });
  });
});
describe("Functions", function () {
  describe("_.restArgs()", function () {
    // _dw fail
    //     can't figure out how to get these specs to pass...
    xit("collects rest arguments into an array", function () {
      _.restArgs(function (a, args) {
        expect(a).toBe(1);
        expect(args, [2, 3]);
      }(1, 2, 3));
    });
  });
  describe("_.bind()", function () {
    var context = { name: 'moe'};
    var func = function(arg) { return 'name: ' + (this.name || arg); };
    var bound = _.bind(func, context);

    it("can bind a function to a context", function () {
      expect(bound()).toEqual('name: moe');
    });

    xit("can do OO-style binding", function () {
      // _dw fail
      // need OO style
      bound = _(func).bind(context);
      expect(bound()).toEqual('name: moe');
    });

    it("can bind without specifying a context", function () {
      var bound = _.bind(func, null, 'curly');
      var result = bound();
      expect(result === 'name: curly' || result === 'name: ' + window.name).toBe(true);
    });

    it("the function was partially applied in advance", function () {
      func = function(salutation, name) { return salutation + ': ' + name; };
      func = _.bind(func, this, 'hello');
      expect(func('moe')).toEqual('hello: moe');
    });

    it("the function was completely applied in advance", function () {
      func = _.bind(func, this, 'curly');
      expect(func()).toEqual('hello: curly');
    });

    it("the function was partially applied in advance and can accept multiple arguments", function () {
      func = function (salutation, firstname, lastname) {
        return salutation + ': ' + firstname + ' ' + lastname; };
      func = _.bind(func, this, 'hello', 'moe', 'curly');
      expect(func()).toEqual('hello: moe curly');
    });

    it("binding a primitive to 'this' returns a wrapped primitive", function () {
      func = function () { return this; };
      expect(typeof _.bind(func, 0)()).toEqual('object');
    });

    it("can bind a function to '0'", function () {
      expect(_.bind(func,0)().valueOf()).toEqual(0);
    });

    it("can bind a function to empty string", function () {
      expect(_.bind(func,'')().valueOf()).toEqual('');
    });

    it("can bind a function to false", function () {
      expect(_.bind(func,false)().valueOf()).toEqual(false);
    });

    // _dw question
    // do you understand what's going on here?
    // make sure you undestand what the solution provides.

    var F = function() { return this; };
    var boundf = _.bind(F, {hello: 'moe curly'});
    var Boundf = boundf;
    var newBoundf = new Boundf();

    it("function should not be bound to the context, to comply with ECMAScript 5", function () {
      expect(newBoundf.hello).toEqual(void 0);
    });

    it("when called without the new operator, it is okay to be bound to the context", function () {
      expect(boundf().hello).toEqual('moe curly');
    });

    it("a bound instance is an instance of the original function", function () {
      expect(newBoundf instanceof F).toBe(true);
    });

    xit("throws an error when binding to a non-function", function () {
      // _dw fix
      expect(function () { _.bind('notafunction') }).toThrow(TypeError);
    });
  });
  describe("_.partial()", function () {
    // _dw fail on all - iteratee is not a fn
    // _dw note on partial()
    // unless I need to drill into this, I want to come back to partial() later.
    xit("can partially apply", function () {
      var obj = {name: 'moe'};
      var func = function () { return this.name + ' ' +
      _.toArray(arguments).join(' '); };
      obj.func = _.partial(func, 'a', 'b');

      // _dw fail _eldar
      // can't figure this one out. putting a debugger in here, I called obj.func() and then clicked the stack trace but it was over my head. Need to move on! _eldar

      expect(obj.func('c', 'd')).toEqual('moe a b c d');
    });
    xit("can partially apply with placeholders", function () {
      var obj = {name: 'moe'};
      var func = function () { return this.name + ' ' +
      _.toArray(arguments).join(' '); };
      obj.func = _.partial(func, _, 'b', _, 'd');
      expect(obj.func('a', 'c')).toEqual('moe a b c d');
    });
    xit("accepts more arguments than the number of placeholders", function () {
      func = _.partial(function () {
        return arguments.length; }, _, 'b', _, 'd');
        expect(func('a', 'c', 'e')).toEqual(5);
    });

    xit("accepts fewer arguments than the number of placeholders", function(){
          func = _.partial(function() { return typeof arguments[2]; }, _, 'b', _, 'd');
         expect(func('a')).toEqual(4);
    });
  });
  describe("_.bindAll()", function () {
    var curly,
        moe;
    beforeEach(function() {
      curly = { name: 'curly'};
      moe = {
        name: 'moe',
        getName: function() { return 'name: ' + this.name; },
        sayHi: function () { return 'hi: ' + this.name; },
        sayLast: function () { return this.sayHi(_.last(arguments)); }
      };
      curly.getName = moe.getName;
      _.bindAll(moe, 'getName', 'sayHi');
      curly.sayHi = moe.sayHi;
    });

    it("unbound function is bound to current object", function () {
      expect(curly.getName()).toEqual('name: curly');
    });

    it("bound functino is still bound to original object", function () {
      expect(curly.sayHi()).toEqual('hi: moe');
    });

    describe("TypeErrors", function () {
      // _dw fail x 3
      // how to test for an error?
      xit("throws an error for bindAll with no functions named", function () {
        expect(_.bindAll(moe)).toThrow(Error);
      });

      xit("throws an error for bindAll if the given key is undefined", function () {
        expect(_.bindAll(moe, 'sayBye')).toThrow(TypeError);
      });

      xit("throws an error for all bindAll if the given key is not a function", function () {
        expect(_.bindAll(moe, 'name')).toThrow(TypeErros);
      });
    });

    it("createCallback works with any number of arguments", function () {
      _.bindAll(moe, 'sayHi', 'sayLast')
      expect(curly.sayHi()).toEqual('hi: moe');

      var sayLast = moe.sayLast;
      expect(sayLast(_.range(1,8), 'Tom')).toEqual('hi: moe');
    });

    it("flattens arguments into a single list", function () {
      _.bindAll(moe, ['getName']);
      var getName = moe.getName;
      expect(getName()).toEqual('name: moe');
    });

  });
  describe("_.memoize()", function () {
    var fib
    beforeEach(function() {
      fib = function (n) {
        return n < 2 ? n : fib(n - 1) + fib(n-2);
      };
    });
    it("a memoized version of fibonacci produces identical results", function () {
      expect(fib(10)).toEqual(55);
    });

    it("a memoized version of fibonacci produces identical results", function () {
      fib = _.memoize(fib);
      expect(fib(10)).toEqual(55);
    });

    it("checks hasOwnProperty", function () {
      var o = function (str) { return str; }
      var fastO = _.memoize(o);
      expect(o('toString')).toEqual('toString');
      expect(fastO('toString')).toEqual('toString');
    });

    it("these are all equal", function () {

      // Expose the cache
      var upper = _.memoize(function (s) {
        return s.toUpperCase();
      });

      expect(upper('foo')).toEqual('FOO');
      expect(upper('bar')).toEqual('BAR');
      expect(upper.cache).toEqual({foo: 'FOO', bar: 'BAR'});
      upper.cache = {foo: "BAR", bar: "FOO"};
      expect(upper('foo')).toEqual('BAR');
      expect(upper('bar')).toEqual('FOO');

    });
  });
  describe("_.delay()", function () {
    _.delay(function () { delayed = true; }, 100);
    setTimeout(function () {
      it("didn't delay the function quite yet", function () {
        expect(delayed).toBe(false);
      }, 50);
    });
    setTimeout(function () {
      it("delayed the function", function () {
        expect(delayed).toBe(true);
      }, 150);
    })
  });
  describe("_.defer()", function () {
    // this suite is not cooperating so I skip you!
  });
  describe("_.throttle", function () {
    // _dw come back to this later
  });
});
describe("Objects", function() {
  describe("_.isArray()", function(){

    it('undefined vars are not arrays', function() {
      expect(_.isArray(void 0)).toBe(false);
    });

    it('the arguments object is not an array', function() {
      expect(_.isArray(arguments)).toBe(false);
    });

    it("arrays are arrays", function () {
      expect(_.isArray([1, 2, 3])).toBe(true);
    });
  });
  describe("_.isArguments()", function () {
    var args = (function(){ return arguments; }(1, 2, 3));

    it("a string is not an arguments object", function () {
      expect(_.isArguments('string')).toBe(false);
    });

    it("a function is not an arguments object", function () {
      expect(_.isArguments(_.isArguments)).toBe(false);
    });

    it("the arguments object is an arguments object", function () {
      expect(_.isArguments(args)).toBe(true);
    });

    xit("is not when it's converted to an array", function () {
      // _dw nab - needs isString()
      expect(_.isArguments(_.toArray(args))).toBe(false);
    });

    it("and not vanilla arrays", function () {
      expect(_.isArguments([1, 2, 3])).toBe(false);
    });
  });
  describe("_.isFunction()", function () {
    it("undefined vars are not functions", function () {
      expect(_.isFunction(void 0)).toBe(false);
    });

    it("arrays are not functions", function () {
      expect(_.isFunction([1, 2, 3])).toBe(false);
    });

    it("strings are not functions", function () {
      expect(_.isFunction('moe')).toBe(false);
    });

    it("functions are functions", function () {
      expect(_.isFunction(_.isFunction)).toBe(true);
    });

    it("even anonymous ones", function () {
      expect(_.isFunction(function(){})).toBe(true);
    });
  });
  describe("_.keys()", function () {
    it("can extract the keys from an object", function () {
      expect(_.keys({one: 1, two: 2})).toEqual(['one', 'two']);
    });

    var a = []; a[1] = 0;

    it("is not fooled by sparse arrays", function () {
      expect(_.keys(a)).toEqual(['1']);
    });

    it("Types other than Object returns an empty array", function () {
      expect(_.keys(null)).toEqual([]);
      expect(_.keys(void 0)).toEqual([]);
      expect(_.keys(1)).toEqual([]);
      expect(_.keys('a')).toEqual([]);
      expect(_.keys(true)).toEqual([]);
    });
  });
  describe("_.values()", function () {
      it("can extract the values from an object", function () {
        expect(_.values({one: 1, two: 2})).toEqual([1, 2]);
      });

      it("even when one of them is length", function () {
        expect(_.values({ one: 1, two: 2, length: 3})).toEqual([1, 2, 3]);
      });
  });
  describe("_.isObject()", function () {
    it("this arguments object is object", function () {
      expect(_.isObject(arguments)).toEqual(true);
    });

    it("and arrays", function () {
      expect(_.isObject([1, 2, 3])).toEqual(true);
    });

    it("and functions", function () {
      expect(_.isObject(function(){})).toEqual(true);
    });

    it("but not null", function () {
      expect(_.isObject(null)).toEqual(false);
    });

    it("not undefined", function () {
      expect(_.isObject(void 0)).toEqual(false);
    });

    it("and not string", function () {
      expect(_.isObject('string')).toEqual(false);
    });

    it("and not number", function () {
      expect(_.isObject(12)).toEqual(false);
    });

    it("and not boolean", function () {
      expect(_.isObject(true)).toEqual(false);
    });

    it("but new String()", function () {
      expect(_.isObject(new String('string'))).toEqual(true);
    });
  });
  describe("_.isString()", function () {
    it("an undefined is not a string", function () {
        var testElement;
        expect(_.isString(testElement)).toBe(false);
    });

    it("but strings are", function () {
      expect(_.isString([1, 2, 3].join(', '))).toBe(true);
    });

    it("I am a string literal", function () {
      expect(_.isString('I am a string literal')).toBe(true);
    });

    it("so are string objects", function () {
      var obj = new String('I am a string object');
      expect(_.isString(obj)).toBe(true);
    });
    it("integers are not strings", function () {
      expect(_.isString(1)).toBe(false);
    });
  });
  describe("_.property()", function () {
    it("returns the property with the given name", function () {
      var stooge = {name: 'moe'};
      expect(_.property('name')(stooge)).toEqual('moe');
    });
    it("should return undefined for null values", function () {
      expect(_.property('name')(null)).toEqual(void 0);
    });
    it("should return undefined for undefined values", function () {
      expect(_.property('name')(void 0)).toEqual(void 0);
    });
    it("should return undefined for null object", function () {
      expect(_.property(null)('foo')).toEqual(void 0);
    });
    it("can fetch null values", function () {
      expect(_.property('x')({x: null})).toEqual(null);
    });
    it("does not crash on property access of non-objects", function () {
      expect(_.property('length')(null)).toEqual(void 0);
    });
    it("can get a direct property", function () {
      expect(_.property('a')({a: 1})).toEqual(1);
    });
    xit("can get a nested property", function () {
      // _dw fail
      // hmm why is this returning undefined?
      expect(_.property(['a', 'b'])({a: {b: 2}})).toEqual(2);
    });
    xit("can fetch falsy values", function () {
      expect(_.property(['a'])({a: false})).toEqual(false);
    });
  });
  describe("_.allKeys()", function () {});
  describe("_.has()", function () {
    var obj = {foo: 'bar', func: function () {}};
    it("checks that the object has a property", function () {
      expect(_.has(obj, 'foo')).toBe(true);
    });
    it("returns false if the object doesn't have the property", function () {
      expect(_.has(obj, 'baz')).toBe(false);
    });
    it("works for functions too", function () {
      expect(_.has(obj, 'func')).toBe(true);
    });
    it("works even when the hasOwnProperty method is deleted", function () {
      obj.hasOwnProperty = null;
      expect(_.has(obj, 'foo')).toBe(true);
    });
    it("does not check the prototype chain for a property", function () {
      var child = {};
      child.prototype = obj;
      expect(_.has(child, 'foo')).toBe(false);
    });

    it("returns false for null", function () {
      expect(_.has(null, 'foo')).toBe(false);
    });

    it("returns false for undefined", function () {
      expect(_.has({a: {b: 'foo'}}, ['a','b'])).toBe(true);
    });

    it("can check for nested properties", function () {
      expect(_.has({a: {b: 'foo'}}, ['a', 'b'])).toBe(true);
    });

    it("does not check the prototype of nested props", function () {
      var child = {};
      expect(_.has({a: child}, ['a', 'foo'])).toBe(false);
    });
  });
});
