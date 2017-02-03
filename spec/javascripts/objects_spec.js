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
      // _dw need to implement _.toArray
      expect(_.isArguments(_.toArray(args))).toBe(false);
    });

    it("and not vanilla arrays", function () {
      expect(_.isArguments([1, 2, 3])).toBe(false);
    });
  });
});
