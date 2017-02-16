// 3.
// Seems to be shorthand of prototypes

    var ArrayProto = Array.prototype,

          ObjProto = Object.prototype,

          // _dw Question - why would this var be better as a 'null' than underfined?
          SymbolProto =
            typeof Symbol !== 'undefined'
              ?
            Symbol.prototype
              :
            null;


// 4.
// this makes the methods even more user friendly by moving the native prototypes, into local variables.

  var push = ArrayProto.push,
      slice = ArrayProto.slice,
      toString = ObjProto.toString,
      hasOwnProperty = ObjProto.hasOwnProperty;


var ArrayProto = Array.prototype,
push = ArrayProto.push;

// now, you can use push in either way;
// toys = ['bike', 'bat']
// toys.push('ball');
// push.call(toys, 'scooter');


// 5.
// assign isArray, keys and create.
  var nativeIsArray = Array.isArray,
      nativeKeys = Object.keys,
      nativeCreate = Object.create;

/*

  What's intersting about these functions is they are stand alone. In that they are not chained.

  var shirt = {size: 'large', color: 'blue'};
  nativeKeys(shirt); // works
  nativeKeys.shirt; // doesn't work

  This makes me realize how many syntax gotchas there are to be aware of. Depending on the situation. I think this is probably why underscore helps by having a consistent API.
*/
