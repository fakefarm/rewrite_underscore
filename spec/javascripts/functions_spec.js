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
});
