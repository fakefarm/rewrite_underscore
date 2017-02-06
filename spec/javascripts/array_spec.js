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

    xit('works well with _.map', function(){
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
      var result = (function() { return _(arguments).initial();}(1,2,3,4));
      expect(result).toEqual(A3)
    });

    xit('works well with _.map', function() {
      result = _.map([[1, 2, ,3], A3], _.initial);
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

    // var result = (function(){ return _(arguments).rest();}(1, 2, 3, 4));

    xit('works on an agruments object', function(){
      expect(result).toEqual([2, 3, 4]);
    });

    // result = _.map([A3, A3], _.rest);

    xit('works well with _.map', function() {
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
        var result = (function(){ return _(arguments).last(); }(1, 2, 3, 4));
        expect(result).toEqual(4);
    });

    xit('works well with _.map', function(){
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

    xit('removes all falsy values', function(){
        expect(_.compact([1, false, null, 0, '', void 0, NaN, 2])).toEqual([1,2]);
    });

    xit('works on an arguments object', function() {
      var result = (function(){ return _.compact(arguments); }(0, 1, false, 2, false, 3));
      expect(result).toEqual(A3);
    });

    xit('works well with _.map', function(){
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

    xit("can flatten medium length arrays", function () {
      // _dw need range()
      expect(_.flatten([_.range(10), _.range(10), 5, 1, 3], true).length).toBe(23);
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
  });
});
