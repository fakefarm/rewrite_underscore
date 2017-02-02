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
  });

  describe("initial()", function() {
    it("returns all but last element", function(){
      expect(_.initial([1, 2, 3, 4, 5])).toEqual([1, 2, 3, 4])
    });
  });
});
