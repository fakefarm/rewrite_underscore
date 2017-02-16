// 1.
/*
In the spirit of studying underscore, I'm taking a break from copying specs and simply reading the sourc code. It's another way to get comfortable with the many parts of this library.
*/

// # JS Assignment
// At first pass I would not have been able to tell you what the following method does. Lots of &&'s, ||'s, and ==/==='s. So I broke down each of the since those are the seams of the conditionals.

// ## JS will take the first || statement that is truthy.

var happy =
  false
  ||
  true
  ||
  false;

// even though this || ends with false, the assignment wants the firs true. This means anything after the first true will not be evaluated.

// && on the otherhand needs all the comments to be true or it will respond with false.

var sad =
  false
  && false
  && true;

// And (&&) needs everything to be true. It is not tolerant of anything false.

// &&'s assignment is not based on first true, the way || or is. If all things are true, then assignment will be the last value or content. So order matters of && statements...

  var root1 =
    typeof self == 'object' // true
      &&
    self.self === self // true
      &&
    self; // Window

// assigns to the last &&, which is self
// so, root = Window {}

// whereas, this && statement is the same content just rearranged, root1 is true. and not self.

  var root2 =
    self
      &&
    typeof self == 'object'
      &&
    self.self === self


// With that in mind, i can see that underscore has 4 || statments. The first two are concerned with attaching the root to the proper environment - be it Window, which goes by 'self', or to Node, which uses `global` instead. The third || grasps onto whatever 'this' is and if there is still uncertaninty, make root be an empty object. While it's difficult to imagine the context not attaching to 'window' or global, it seems a good defensive measure to have root be an object rather than an undefined variable.

var root = typeof self == 'object' && self.self === self && self
|| typeof global == 'object' && global.global === global && global
|| this
|| {};



// 8.
  if (typeof exports != 'undefined' && !exports.nodeType) {
    if (typeof module != 'undefined' && !module.nodeType && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // based on the environment, this will attached '_' with the proper environment.

  
