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
  describe("_.keys", function () {
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
  describe("_.isObject", function () {
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
  describe("isString", function () {
    xit("an element is not a string", function () {
      if (testElement) {
        // _dw fail
        expect(_.isString(testElement)).not.toBe(defined);
      }
    });

    it("but strings are", function () {
      expect(_.isString([1, 2, 3].join(', '))).toBe(true);
    });

    it("I am a string literal", function () {
      expect(_.isString('I am a string literal')).toBe(true);
    });

    it("so are string objects", function () {
      var obj = new String('I am a string object');
      expect(_.isString(obj))toBe(true);
    });
    it("integers are not strings", function () {
      expect(_.isString(1)).toBe(false);
    });
  });
});
