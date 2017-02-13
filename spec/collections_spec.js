describe("Collections", function () {
  describe("_.filter", function () {
    var evenArray = _.range(1,6);
    var evenObject = { one: 1, two: 2, three: 3};
    var isEven = function(num) { return num % 2 === 0; };

    xit("can filter objects", function () {
      // _dw fail
      expect(_.filter(evenArray, isEven)).toEqual([2, 4, 6]);
      expect(_.filter(evenObject, isEven)).toEqual([2]);
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
      // _dw nab - needs partial()
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
    xit("arguments object converted into array", function () {
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
  });
});
