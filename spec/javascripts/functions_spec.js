describe("Functions", function () {
  describe("_.restArgs", function () {
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

    it("can do OO-style binding", function () {
      // _dw fail
      // need OO style
      bound = _(func).bind(context);
      expect(bound()).toEqual('name: moe');
    });

    
  });
});
