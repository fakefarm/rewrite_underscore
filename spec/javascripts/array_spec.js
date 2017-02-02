describe("Arrays", function() {
  var _ = typeof require == 'function' ? require('..') : window._;
  describe("first", function() {
    it('can pull out the first element of an array', function(){
      expect(_.first([1,2,3])).toBe(1);
    });
    it('can perform OO-style "first()"', function() {
        expect(_([1,2,3].first())).toBe(1);
    });
  })
});

  // assert.deepEqual(_.first([1, 2, 3], 0), [], 'returns an empty array when n <= 0 (0 case)');
  // assert.deepEqual(_.first([1, 2, 3], -1), [], 'returns an empty array when n <= 0 (negative case)');
  // assert.deepEqual(_.first([1, 2, 3], 2), [1, 2], 'can fetch the first n elements');
  // assert.deepEqual(_.first([1, 2, 3], 5), [1, 2, 3], 'returns the whole array if n > length');
  // var result = (function(){ return _.first(arguments); }(4, 3, 2, 1));
  // assert.strictEqual(result, 4, 'works on an arguments object');
  // result = _.map([[1, 2, 3], [1, 2, 3]], _.first);
  // assert.deepEqual(result, [1, 1], 'works well with _.map');
  // assert.strictEqual(_.first(null), void 0, 'returns undefined when called on null');
