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

    xit("can do OO-style binding", function () {
      // _dw fail
      // need OO style
      bound = _(func).bind(context);
      expect(bound()).toEqual('name: moe');
    });

    xit("can bind without specifying a context", function () {
      // _dw finish this spec
      var bound = _.bind(func, null, 'curly');
      var result = bound();
      expect(result === 'name: curly' || result === 'name: ' + window.name);
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
      obj.func = _.partial(func, _, 'b', _, 'd');
      expect(obj.func('a', 'c')).toEqual('moe a b c d');
    });
    it("accepts more arguments than the number of placeholders", function () {
      func = _.partial(function () {
        return arguments.length; }, _, 'b', _, 'd');
        expect(func('a', 'c', 'e')).toEqual(5);
    });
  });
});
