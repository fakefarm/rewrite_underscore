describe("Arrays", function() {
  describe("first()", function() {
    it('can pull out the first element of an array', function(){
      expect(_.first([1,2,3])).toBe(1);
      expect(_.first(['a', 'b', 'c'])).toBe('a');
    });

    xit('can perform OO-style "first()"', function() {
        expect(_([1,2,3]).first()).toBe(1);
    });

    it('returns an empty array when n <= 0 (0 case)', function() {
        expect(_.first([1,2,3], 0)).toEqual([]);
    });

    it('returns an empty array when n <= 0 (negative case)', function() {
        expect(_.first([1,2,3], -1)).toEqual([])
    });

    it('can fetch the first n elements', function() {
      expect(_.first([1, 2, 3], 2)).toEqual([1, 2])
    });

    it('returns the whole array if n > length', function() {
      expect(_.first([1, 2, 3], 5)).toEqual([1, 2, 3])
    });

    it('works on an arguments object', function() {
      var result = (function(){ return _.first(arguments); }(4, 3, 2, 1));
      expect(result).toEqual(4);
    });

    xit('works well with _.map', function(){
      var result = _.map([[1, 2, 3], [1, 2, 3]], _.first);
      expect(result).toEqual([1,1]);
    });

    it('returns undefined when called on null', function() {
      expect(_.first(null)).toEqual(void 0)
    });

    it('return undefined when called on an empty array', function() {
      expect(_.first([])).toEqual(void 0);
    })
  });

  describe("initial()", function() {
    it("returns all but last element", function(){
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
      expect(result).toEqual([1, 2, 3])
    });

    xit('works well with _.map', function() {
      result = _.map([[1, 2, ,3], [1, 2, 3]], _.initial);
      expect(_.flatten(result)).toEqual([1, 2, 1, 2]);
    })
  });

  describe('head', function() {
     it('is an alias for first()', function() {
       expect(_.head).toEqual(_.first);
     });
  });
});
