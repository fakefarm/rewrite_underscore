//     Underscore.js 1.8.3
//     http://underscorejs.org
//     (c) 2009-2017 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` (`self`) in the browser, `global`
  // on the server, or `this` in some virtual machines. We use `self`
  // instead of `window` for `WebWorker` support.
  // _dw vars
  var root = typeof self == 'object' && self.self === self && self ||
            typeof global == 'object' && global.global === global && global ||
            this ||
            {};

// _dw vars
  // Save the previous value of the `_` variable.
  // _dw vars
  var previousUnderscore = root._;

  // Save bytes in the minified (but not gzipped) version:
  // _dw vars
  var ArrayProto = Array.prototype, ObjProto = Object.prototype;
  // _dw vars
  var SymbolProto = typeof Symbol !== 'undefined' ? Symbol.prototype : null;

// _dw vars
  // Create quick reference variables for speed access to core prototypes.
  // _dw vars
  var push = ArrayProto.push,
      slice = ArrayProto.slice,
      toString = ObjProto.toString,
      hasOwnProperty = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  // _dw vars
  var nativeIsArray = Array.isArray,
      nativeKeys = Object.keys,
      nativeCreate = Object.create;

  // Naked function reference for surrogate-prototype-swapping.
  // _dw vars
  // _dw func definitions
  var Ctor = function(){};

  // Create a safe reference to the Underscore object for use below.
  // _dw vars
  // _dw func definitions
  var _ = function(obj) {
    // _dw ifs
    if (obj instanceof _) return obj;
    // _dw ifs
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for their old module API. If we're in
  // the browser, add `_` as a global object.
  // (`nodeType` is checked to ensure that `module`
  // and `exports` are not HTML elements.)
  // _dw ifs
  if (typeof exports != 'undefined' && !exports.nodeType) {
    // _dw ifs
    if (typeof module != 'undefined' && !module.nodeType && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.8.3';

  // Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other Underscore
  // functions.
  // _dw vars
  // _dw func definitions
  var optimizeCb = function(func, context, argCount) {
    // _dw ifs
    if (context === void 0) return func;
    switch (argCount) {
      case 1: return function(value) {
        return func.call(context, value);
      };
      // The 2-parameter case has been omitted only because no current consumers
      // made use of it.
      case null:
      case 3: return function(value, index, collection) {
        return func.call(context, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
    }
    return function() {
      return func.apply(context, arguments);
    };
  };

// _dw vars
  var builtinIteratee;

  // An internal function to generate callbacks that can be applied to each
  // element in a collection, returning the desired result — either `identity`,
  // an arbitrary callback, a property matcher, or a property accessor.
  // _dw vars
  // _dw func definitions
  var cb = function(value, context, argCount) {
    // _dw ifs
    if (_.iteratee !== builtinIteratee) return _.iteratee(value, context);
    // _dw ifs
    if (value == null) return _.identity;
    // _dw ifs
    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
    // _dw ifs
    if (_.isObject(value) && !_.isArray(value)) return _.matcher(value);
    return _.property(value);
  };

  // External wrapper for our callback generator. Users may customize
  // `_.iteratee` if they want additional predicate/iteratee shorthand styles.
  // This abstraction hides the internal-only argCount argument.
  // _dw func definitions
  _.iteratee = builtinIteratee = function(value, context) {
    return cb(value, context, Infinity);
  };

  // Similar to ES6's rest param (http://ariya.ofilabs.com/2013/03/es6-and-rest-parameter.html)
  // This accumulates the arguments passed into an array, after a given index.
  // _dw vars
  // _dw func definitions
  var restArgs = function(func, startIndex) {
    startIndex = startIndex == null ? func.length - 1 : +startIndex;
    return function() {
      // _dw vars
      var length = Math.max(arguments.length - startIndex, 0),
          rest = Array(length),
          index = 0;
          // _dw for loops
      for (; index < length; index++) {
        rest[index] = arguments[index + startIndex];
      }
      switch (startIndex) {
        case 0: return func.call(this, rest);
        case 1: return func.call(this, arguments[0], rest);
        case 2: return func.call(this, arguments[0], arguments[1], rest);
      }
      // _dw vars
      var args = Array(startIndex + 1);
      // _dw for loops
      for (index = 0; index < startIndex; index++) {
        args[index] = arguments[index];
      }
      args[startIndex] = rest;
      return func.apply(this, args);
    };
  };

  // An internal function for creating a new object that inherits from another.
  // _dw vars
  // _dw func definitions
  var baseCreate = function(prototype) {
    // _dw ifs
    if (!_.isObject(prototype)) return {};
    // _dw ifs
    if (nativeCreate) return nativeCreate(prototype);
    Ctor.prototype = prototype;
    // _dw vars
    var result = new Ctor;
    Ctor.prototype = null;
    return result;
  };

// _dw vars
// _dw func definitions
  var shallowProperty = function(key) {
    return function(obj) {
      return obj == null ? void 0 : obj[key];
    };
  };

// _dw vars
// _dw func definitions
  var deepGet = function(obj, path) {
    // _dw vars
    var length = path.length;
    // _dw for loops
    // _dw vars
    for (var i = 0; i < length; i++) {
      // _dw ifs
      if (obj == null) return void 0;
      obj = obj[path[i]];
    }
    return length ? obj : void 0;
  };

  // Helper for collection methods to determine whether a collection
  // should be iterated as an array or as an object.
  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
  // _dw vars
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  // _dw vars
  var getLength = shallowProperty('length');
  // _dw vars
  // _dw func definitions
  var isArrayLike = function(collection) {
    // _dw vars
    var length = getLength(collection);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  };

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles raw objects in addition to array-likes. Treats all
  // sparse array-likes as if they were dense.
  // _dw func definitions
  _.each = _.forEach = function(obj, iteratee, context) {
    iteratee = optimizeCb(iteratee, context);
    // _dw vars
    var i, length;
    // _dw ifs
    if (isArrayLike(obj)) {
      // _dw for loops
      for (i = 0, length = obj.length; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      // _dw vars
      var keys = _.keys(obj);
      // _dw for loops
      for (i = 0, length = keys.length; i < length; i++) {
        iteratee(obj[keys[i]], keys[i], obj);
      }
    }
    return obj;
  };

  // Return the results of applying the iteratee to each element.
  // _dw func definitions
  _.map = _.collect = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    // _dw vars
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length,
        results = Array(length);
        // _dw for loops
        // _dw vars
    for (var index = 0; index < length; index++) {
      // _dw vars
      var currentKey = keys ? keys[index] : index;
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  // Create a reducing function iterating left or right.
  // _dw vars
  // _dw func definitions
  var createReduce = function(dir) {
    // _dw vars
    // Wrap code that reassigns argument variables in a separate function than
    // the one that accesses `arguments.length` to avoid a perf hit. (#1991)
    // _dw vars
    // _dw func definitions
    var reducer = function(obj, iteratee, memo, initial) {
      // _dw vars
      var keys = !isArrayLike(obj) && _.keys(obj),
          length = (keys || obj).length,
          index = dir > 0 ? 0 : length - 1;
          // _dw ifs
      if (!initial) {
        memo = obj[keys ? keys[index] : index];
        index += dir;
      }
      // _dw for loops
      for (; index >= 0 && index < length; index += dir) {
        // _dw vars
        var currentKey = keys ? keys[index] : index;
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
      }
      return memo;
    };

    return function(obj, iteratee, memo, context) {
      // _dw vars
      var initial = arguments.length >= 3;
      return reducer(obj, optimizeCb(iteratee, context, 4), memo, initial);
    };
  };

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`.
  _.reduce = _.foldl = _.inject = createReduce(1);

  // The right-associative version of reduce, also known as `foldr`.
  _.reduceRight = _.foldr = createReduce(-1);

  // Return the first value which passes a truth test. Aliased as `detect`.
  // _dw func definitions
  _.find = _.detect = function(obj, predicate, context) {
    // _dw vars
    var keyFinder = isArrayLike(obj) ? _.findIndex : _.findKey;
    // _dw vars
    var key = keyFinder(obj, predicate, context);
    // _dw ifs
    if (key !== void 0 && key !== -1) return obj[key];
  };

  // Return all the elements that pass a truth test.
  // Aliased as `select`.
  // _dw func definitions
  _.filter = _.select = function(obj, predicate, context) {
    // _dw vars
    var results = [];
    predicate = cb(predicate, context);
    _.each(obj, function(value, index, list) {
      // _dw ifs
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  // _dw func definitions
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, _.negate(cb(predicate)), context);
  };

  // Determine whether all of the elements match a truth test.
  // Aliased as `all`.
  // _dw func definitions
  _.every = _.all = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    // _dw vars
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
        // _dw for loops
        // _dw vars
    for (var index = 0; index < length; index++) {
      // _dw vars
      var currentKey = keys ? keys[index] : index;
      // _dw ifs
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  };

  // Determine if at least one element in the object matches a truth test.
  // Aliased as `any`.
  // _dw func definitions
  _.some = _.any = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    // _dw vars
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
        // _dw for loops
        // _dw vars
    for (var index = 0; index < length; index++) {
      // _dw vars
      var currentKey = keys ? keys[index] : index;
      // _dw ifs
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  };

  // Determine if the array or object contains a given item (using `===`).
  // Aliased as `includes` and `include`.
  // _dw func definitions
  _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
    // _dw ifs
    if (!isArrayLike(obj)) obj = _.values(obj);
    // _dw ifs
    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
    return _.indexOf(obj, item, fromIndex) >= 0;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = restArgs(function(obj, path, args) {
    // _dw vars
    var contextPath, func;
    // _dw ifs
    if (_.isFunction(path)) {
      func = path;
      // _dw ifs
    } else if (_.isArray(path)) {
      contextPath = path.slice(0, -1);
      path = path[path.length - 1];
    }
    return _.map(obj, function(context) {
      // _dw vars
      var method = func;
      // _dw ifs
      if (!method) {
        // _dw ifs
        if (contextPath && contextPath.length) {
          context = deepGet(context, contextPath);
        }
        // _dw ifs
        if (context == null) return void 0;
        method = context[path];
      }
      return method == null ? method : method.apply(context, args);
    });
  });

  // Convenience version of a common use case of `map`: fetching a property.
  // _dw func definitions
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  // _dw func definitions
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matcher(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  // _dw func definitions
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matcher(attrs));
  };

  // Return the maximum element (or element-based computation).
  // _dw func definitions
  _.max = function(obj, iteratee, context) {
    // _dw vars
    var result = -Infinity, lastComputed = -Infinity,
        value, computed;
        // _dw ifs
    if (iteratee == null || (typeof iteratee == 'number' && typeof obj[0] != 'object') && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      // _dw for loops
      // _dw vars
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        // _dw ifs
        if (value != null && value > result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(v, index, list) {
        computed = iteratee(v, index, list);
        // _dw ifs
        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
          result = v;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Return the minimum element (or element-based computation).
  // _dw func definitions
  _.min = function(obj, iteratee, context) {
    // _dw vars
    var result = Infinity, lastComputed = Infinity,
        value, computed;
        // _dw ifs
    if (iteratee == null || (typeof iteratee == 'number' && typeof obj[0] != 'object') && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      // _dw for loops
      // _dw vars
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        // _dw ifs
        if (value != null && value < result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(v, index, list) {
        computed = iteratee(v, index, list);
        // _dw ifs
        if (computed < lastComputed || computed === Infinity && result === Infinity) {
          result = v;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Shuffle a collection.
  // _dw func definitions
  _.shuffle = function(obj) {
    return _.sample(obj, Infinity);
  };

  // Sample **n** random values from a collection using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  // _dw func definitions
  _.sample = function(obj, n, guard) {
    // _dw ifs
    if (n == null || guard) {
      // _dw ifs
      if (!isArrayLike(obj)) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    // _dw vars
    var sample = isArrayLike(obj) ? _.clone(obj) : _.values(obj);
    // _dw vars
    var length = getLength(sample);
    n = Math.max(Math.min(n, length), 0);
    // _dw vars
    var last = length - 1;
    // _dw for loops
    // _dw vars
    for (var index = 0; index < n; index++) {
      // _dw vars
      var rand = _.random(index, last);
      // _dw vars
      var temp = sample[index];
      sample[index] = sample[rand];
      sample[rand] = temp;
    }
    return sample.slice(0, n);
  };

  // Sort the object's values by a criterion produced by an iteratee.
  // _dw func definitions
  _.sortBy = function(obj, iteratee, context) {
    // _dw vars
    var index = 0;
    iteratee = cb(iteratee, context);
    return _.pluck(_.map(obj, function(value, key, list) {
      return {
        value: value,
        index: index++,
        criteria: iteratee(value, key, list)
      };
    }).sort(function(left, right) {
      // _dw vars
      var a = left.criteria;
      // _dw vars
      var b = right.criteria;
      // _dw ifs
      if (a !== b) {
        // _dw ifs
        if (a > b || a === void 0) return 1;
        // _dw ifs
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  // _dw vars
  // _dw func definitions
  var group = function(behavior, partition) {
    return function(obj, iteratee, context) {
      // _dw vars
      var result = partition ? [[], []] : {};
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index) {
        // _dw vars
        var key = iteratee(value, index, obj);
        behavior(result, value, key);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, value, key) {
    // _dw ifs
    if (_.has(result, key)) result[key].push(value); else result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, value, key) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, value, key) {
    // _dw ifs
    if (_.has(result, key)) result[key]++; else result[key] = 1;
  });

// _dw vars
  var reStrSymbol = /[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g;
  // Safely create a real, live array from anything iterable.
  // _dw func definitions
  _.toArray = function(obj) {
    // _dw ifs
    if (!obj) return [];
    // _dw ifs
    if (_.isArray(obj)) return slice.call(obj);
    // _dw ifs
    if (_.isString(obj)) {
      // Keep surrogate pair characters together
      return obj.match(reStrSymbol);
    }
    // _dw ifs
    if (isArrayLike(obj)) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  // _dw func definitions
  _.size = function(obj) {
    // _dw ifs
    if (obj == null) return 0;
    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
  };

  // Split a collection into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = group(function(result, value, pass) {
    result[pass ? 0 : 1].push(value);
  }, true);

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  // _dw func definitions
  _.first = _.head = _.take = function(array, n, guard) {
    // _dw ifs
    if (array == null || array.length < 1) return void 0;
    // _dw ifs
    if (n == null || guard) return array[0];
    return _.initial(array, array.length - n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N.
  // _dw func definitions
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array.
  // _dw func definitions
  _.last = function(array, n, guard) {
    // _dw ifs
    if (array == null || array.length < 1) return void 0;
    // _dw ifs
    if (n == null || guard) return array[array.length - 1];
    return _.rest(array, Math.max(0, array.length - n));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array.
  // _dw func definitions
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  // _dw func definitions
  _.compact = function(array) {
    return _.filter(array, Boolean);
  };

  // Internal implementation of a recursive `flatten` function.
  // _dw vars
  // _dw func definitions
  var flatten = function(input, shallow, strict, output) {
    output = output || [];
    // _dw vars
    var idx = output.length;
    // _dw for loops
    // _dw vars
    for (var i = 0, length = getLength(input); i < length; i++) {
      // _dw vars
      var value = input[i];
      // _dw ifs
      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
        // Flatten current level of array or arguments object.
        // _dw ifs
        if (shallow) {
          // _dw vars
          var j = 0, len = value.length;
          while (j < len) output[idx++] = value[j++];
        } else {
          flatten(value, shallow, strict, output);
          idx = output.length;
        }
        // _dw ifs
      } else if (!strict) {
        output[idx++] = value;
      }
    }
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  // _dw func definitions
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, false);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = restArgs(function(array, otherArrays) {
    return _.difference(array, otherArrays);
  });

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  // _dw func definitions
  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
    // _dw ifs
    if (!_.isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }
    // _dw ifs
    if (iteratee != null) iteratee = cb(iteratee, context);
    // _dw vars
    var result = [];
    // _dw vars
    var seen = [];
    // _dw for loops
    // _dw vars
    for (var i = 0, length = getLength(array); i < length; i++) {
      // _dw vars
      var value = array[i],
          computed = iteratee ? iteratee(value, i, array) : value;
          // _dw ifs
      if (isSorted) {
        // _dw ifs
        if (!i || seen !== computed) result.push(value);
        seen = computed;
        // _dw ifs
      } else if (iteratee) {
        // _dw ifs
        if (!_.contains(seen, computed)) {
          seen.push(computed);
          result.push(value);
        }
        // _dw ifs
      } else if (!_.contains(result, value)) {
        result.push(value);
      }
    }
    return result;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = restArgs(function(arrays) {
    return _.uniq(flatten(arrays, true, true));
  });

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  // _dw func definitions
  _.intersection = function(array) {
    // _dw vars
    var result = [];
    // _dw vars
    var argsLength = arguments.length;
    // _dw for loops
    // _dw vars
    for (var i = 0, length = getLength(array); i < length; i++) {
      // _dw vars
      var item = array[i];
      // _dw ifs
      if (_.contains(result, item)) continue;
      // _dw vars
      var j;
      // _dw for loops
      for (j = 1; j < argsLength; j++) {
        // _dw ifs
        if (!_.contains(arguments[j], item)) break;
      }
      // _dw ifs
      if (j === argsLength) result.push(item);
    }
    return result;
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = restArgs(function(array, rest) {
    rest = flatten(rest, true, true);
    return _.filter(array, function(value){
      return !_.contains(rest, value);
    });
  });

  // Complement of _.zip. Unzip accepts an array of arrays and groups
  // each array's elements on shared indices.
  // _dw func definitions
  _.unzip = function(array) {
    // _dw vars
    var length = array && _.max(array, getLength).length || 0;
    // _dw vars
    var result = Array(length);

// _dw for loops
// _dw vars
    for (var index = 0; index < length; index++) {
      result[index] = _.pluck(array, index);
    }
    return result;
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = restArgs(_.unzip);

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values. Passing by pairs is the reverse of _.pairs.
  // _dw func definitions
  _.object = function(list, values) {
    // _dw vars
    var result = {};
    // _dw for loops
    // _dw vars
    for (var i = 0, length = getLength(list); i < length; i++) {
      // _dw ifs
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // Generator function to create the findIndex and findLastIndex functions.
  // _dw vars
  // _dw func definitions
  var createPredicateIndexFinder = function(dir) {
    return function(array, predicate, context) {
      predicate = cb(predicate, context);
      // _dw vars
      var length = getLength(array);
      // _dw vars
      var index = dir > 0 ? 0 : length - 1;
      // _dw for loops
      for (; index >= 0 && index < length; index += dir) {
        // _dw ifs
        if (predicate(array[index], index, array)) return index;
      }
      return -1;
    };
  };

  // Returns the first index on an array-like that passes a predicate test.
  _.findIndex = createPredicateIndexFinder(1);
  _.findLastIndex = createPredicateIndexFinder(-1);

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  // _dw func definitions
  _.sortedIndex = function(array, obj, iteratee, context) {
    iteratee = cb(iteratee, context, 1);
    // _dw vars
    var value = iteratee(obj);
    // _dw vars
    var low = 0, high = getLength(array);
    while (low < high) {
      // _dw vars
      var mid = Math.floor((low + high) / 2);
      // _dw ifs
      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
    }
    return low;
  };

  // Generator function to create the indexOf and lastIndexOf functions.
  // _dw vars
  // _dw func definitions
  var createIndexFinder = function(dir, predicateFind, sortedIndex) {
    return function(array, item, idx) {
      // _dw vars
      var i = 0, length = getLength(array);
      // _dw ifs
      if (typeof idx == 'number') {
        // _dw ifs
        if (dir > 0) {
          i = idx >= 0 ? idx : Math.max(idx + length, i);
        } else {
          length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
        }
        // _dw ifs
      } else if (sortedIndex && idx && length) {
        idx = sortedIndex(array, item);
        return array[idx] === item ? idx : -1;
      }
      // _dw ifs
      if (item !== item) {
        idx = predicateFind(slice.call(array, i, length), _.isNaN);
        return idx >= 0 ? idx + i : -1;
      }
      // _dw for loops
      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
        // _dw ifs
        if (array[idx] === item) return idx;
      }
      return -1;
    };
  };

  // Return the position of the first occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
  _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  // _dw func definitions
  _.range = function(start, stop, step) {
    // _dw ifs
    if (stop == null) {
      stop = start || 0;
      start = 0;
    }
    // _dw ifs
    if (!step) {
      step = stop < start ? -1 : 1;
    }

// _dw vars
    var length = Math.max(Math.ceil((stop - start) / step), 0);
    // _dw vars
    var range = Array(length);

// _dw for loops
// _dw vars
    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }

    return range;
  };

  // Split an **array** into several arrays containing **count** or less elements
  // of initial array.
  // _dw func definitions
  _.chunk = function(array, count) {
    // _dw ifs
    if (count == null || count < 1) return [];

// _dw vars
    var result = [];
    // _dw vars
    var i = 0, length = array.length;
    while (i < length) {
      result.push(slice.call(array, i, i += count));
    }
    return result;
  };

  // Function (ahem) Functions
  // ------------------

  // Determines whether to execute a function as a constructor
  // or a normal function with the provided arguments.
  // _dw vars
  // _dw func definitions
  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
    // _dw ifs
    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
    // _dw vars
    var self = baseCreate(sourceFunc.prototype);
    // _dw vars
    var result = sourceFunc.apply(self, args);
    // _dw ifs
    if (_.isObject(result)) return result;
    return self;
  };

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = restArgs(function(func, context, args) {
    // _dw ifs
    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
    // _dw vars
    var bound = restArgs(function(callArgs) {
      return executeBound(func, bound, context, this, args.concat(callArgs));
    });
    return bound;
  });

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder by default, allowing any combination of arguments to be
  // pre-filled. Set `_.partial.placeholder` for a custom placeholder argument.
  _.partial = restArgs(function(func, boundArgs) {
    // _dw vars
    var placeholder = _.partial.placeholder;
    // _dw vars
    // _dw func definitions
    var bound = function() {
      // _dw vars
      var position = 0, length = boundArgs.length;
      // _dw vars
      var args = Array(length);
      // _dw for loops
      // _dw vars
      for (var i = 0; i < length; i++) {
        args[i] = boundArgs[i] === placeholder ? arguments[position++] : boundArgs[i];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return executeBound(func, bound, this, this, args);
    };
    return bound;
  });

  _.partial.placeholder = _;

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = restArgs(function(obj, keys) {
    keys = flatten(keys, false, false);
    // _dw vars
    var index = keys.length;
    // _dw ifs
    if (index < 1) throw new Error('bindAll must be passed function names');
    while (index--) {
      // _dw vars
      var key = keys[index];
      obj[key] = _.bind(obj[key], obj);
    }
  });

  // Memoize an expensive function by storing its results.
  // _dw func definitions
  _.memoize = function(func, hasher) {
    // _dw vars
    // _dw func definitions
    var memoize = function(key) {
      // _dw vars
      var cache = memoize.cache;
      // _dw vars
      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
      // _dw ifs
      if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = restArgs(function(func, wait, args) {
    return setTimeout(function() {
      return func.apply(null, args);
    }, wait);
  });

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = _.partial(_.delay, _, 1);

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  // _dw func definitions
  _.throttle = function(func, wait, options) {
    // _dw vars
    var timeout, context, args, result;
    // _dw vars
    var previous = 0;
    // _dw ifs
    if (!options) options = {};

// _dw vars
// _dw func definitions
    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      // _dw ifs
      if (!timeout) context = args = null;
    };

// _dw vars
// _dw func definitions
    var throttled = function() {
      // _dw vars
      var now = _.now();
      // _dw ifs
      if (!previous && options.leading === false) previous = now;
      // _dw vars
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      // _dw ifs
      if (remaining <= 0 || remaining > wait) {
        // _dw ifs
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        // _dw ifs
        if (!timeout) context = args = null;
        // _dw ifs
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };

// _dw func definitions
    throttled.cancel = function() {
      clearTimeout(timeout);
      previous = 0;
      timeout = context = args = null;
    };

    return throttled;
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  // _dw func definitions
  _.debounce = function(func, wait, immediate) {
    // _dw vars
    var timeout, result;

// _dw vars
// _dw func definitions
    var later = function(context, args) {
      timeout = null;
      // _dw ifs
      if (args) result = func.apply(context, args);
    };

// _dw vars
    var debounced = restArgs(function(args) {
      // _dw ifs
      if (timeout) clearTimeout(timeout);
      // _dw ifs
      if (immediate) {
        // _dw vars
        var callNow = !timeout;
        timeout = setTimeout(later, wait);
        // _dw ifs
        if (callNow) result = func.apply(this, args);
      } else {
        timeout = _.delay(later, wait, this, args);
      }

      return result;
    });

// _dw func definitions
    debounced.cancel = function() {
      clearTimeout(timeout);
      timeout = null;
    };

    return debounced;
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  // _dw func definitions
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a negated version of the passed-in predicate.
  // _dw func definitions
  _.negate = function(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  // _dw func definitions
  _.compose = function() {
    // _dw vars
    var args = arguments;
    // _dw vars
    var start = args.length - 1;
    return function() {
      // _dw vars
      var i = start;
      // _dw vars
      var result = args[start].apply(this, arguments);
      while (i--) result = args[i].call(this, result);
      return result;
    };
  };

  // Returns a function that will only be executed on and after the Nth call.
  // _dw func definitions
  _.after = function(times, func) {
    return function() {
      // _dw ifs
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Returns a function that will only be executed up to (but not including) the Nth call.
  // _dw func definitions
  _.before = function(times, func) {
    // _dw vars
    var memo;
    return function() {
      // _dw ifs
      if (--times > 0) {
        memo = func.apply(this, arguments);
      }
      // _dw ifs
      if (times <= 1) func = null;
      return memo;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = _.partial(_.before, 2);

  _.restArgs = restArgs;

  // Object Functions
  // ----------------

  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
  // _dw vars
  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
  // _dw vars
  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
                      'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

// _dw vars
// _dw func definitions
  var collectNonEnumProps = function(obj, keys) {
    // _dw vars
    var nonEnumIdx = nonEnumerableProps.length;
    // _dw vars
    var constructor = obj.constructor;
    // _dw vars
    var proto = _.isFunction(constructor) && constructor.prototype || ObjProto;

    // Constructor is a special case.
    // _dw vars
    var prop = 'constructor';
    // _dw ifs
    if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

    while (nonEnumIdx--) {
      prop = nonEnumerableProps[nonEnumIdx];
      // _dw ifs
      if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
        keys.push(prop);
      }
    }
  };

  // Retrieve the names of an object's own properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`.
  // _dw func definitions
  _.keys = function(obj) {
    // _dw ifs
    if (!_.isObject(obj)) return [];
    // _dw ifs
    if (nativeKeys) return nativeKeys(obj);
    // _dw vars
    var keys = [];
    // _dw for loops
    // _dw vars
    // _dw ifs
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    // Ahem, IE < 9.
    // _dw ifs
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve all the property names of an object.
  // _dw func definitions
  _.allKeys = function(obj) {
    // _dw ifs
    if (!_.isObject(obj)) return [];
    // _dw vars
    var keys = [];
    // _dw for loops
    // _dw vars
    for (var key in obj) keys.push(key);
    // Ahem, IE < 9.
    // _dw ifs
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve the values of an object's properties.
  // _dw func definitions
  _.values = function(obj) {
    // _dw vars
    var keys = _.keys(obj);
    // _dw vars
    var length = keys.length;
    // _dw vars
    var values = Array(length);
    // _dw for loops
    // _dw vars
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Returns the results of applying the iteratee to each element of the object.
  // In contrast to _.map it returns an object.
  // _dw func definitions
  _.mapObject = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    // _dw vars
    var keys = _.keys(obj),
        length = keys.length,
        results = {};
        // _dw for loops
        // _dw vars
    for (var index = 0; index < length; index++) {
      // _dw vars
      var currentKey = keys[index];
      results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  // Convert an object into a list of `[key, value]` pairs.
  // The opposite of _.object.
  // _dw func definitions
  _.pairs = function(obj) {
    // _dw vars
    var keys = _.keys(obj);
    // _dw vars
    var length = keys.length;
    // _dw vars
    var pairs = Array(length);
    // _dw for loops
    // _dw vars
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  // _dw func definitions
  _.invert = function(obj) {
    // _dw vars
    var result = {};
    // _dw vars
    var keys = _.keys(obj);
    // _dw for loops
    // _dw vars
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`.
  // _dw func definitions
  _.functions = _.methods = function(obj) {
    // _dw vars
    var names = [];
    // _dw for loops
    // _dw vars
    for (var key in obj) {
      // _dw ifs
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // An internal function for creating assigner functions.
  // _dw vars
  // _dw func definitions
  var createAssigner = function(keysFunc, defaults) {
    return function(obj) {
      // _dw vars
      var length = arguments.length;
      // _dw ifs
      if (defaults) obj = Object(obj);
      // _dw ifs
      if (length < 2 || obj == null) return obj;
      // _dw for loops
      // _dw vars
      for (var index = 1; index < length; index++) {
        // _dw vars
        var source = arguments[index],
            keys = keysFunc(source),
            l = keys.length;
            // _dw for loops
            // _dw vars
        for (var i = 0; i < l; i++) {
          // _dw vars
          var key = keys[i];
          // _dw ifs
          if (!defaults || obj[key] === void 0) obj[key] = source[key];
        }
      }
      return obj;
    };
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = createAssigner(_.allKeys);

  // Assigns a given object with all the own properties in the passed-in object(s).
  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
  _.extendOwn = _.assign = createAssigner(_.keys);

  // Returns the first key on an object that passes a predicate test.
  // _dw func definitions
  _.findKey = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    // _dw vars
    var keys = _.keys(obj), key;
    // _dw for loops
    // _dw vars
    for (var i = 0, length = keys.length; i < length; i++) {
      key = keys[i];
      // _dw ifs
      if (predicate(obj[key], key, obj)) return key;
    }
  };

  // Internal pick helper function to determine if `obj` has key `key`.
  // _dw vars
  // _dw func definitions
  var keyInObj = function(value, key, obj) {
    return key in obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = restArgs(function(obj, keys) {
    // _dw vars
    var result = {}, iteratee = keys[0];
    // _dw ifs
    if (obj == null) return result;
    // _dw ifs
    if (_.isFunction(iteratee)) {
      // _dw ifs
      if (keys.length > 1) iteratee = optimizeCb(iteratee, keys[1]);
      keys = _.allKeys(obj);
    } else {
      iteratee = keyInObj;
      keys = flatten(keys, false, false);
      obj = Object(obj);
    }
    // _dw for loops
    // _dw vars
    for (var i = 0, length = keys.length; i < length; i++) {
      // _dw vars
      var key = keys[i];
      // _dw vars
      var value = obj[key];
      // _dw ifs
      if (iteratee(value, key, obj)) result[key] = value;
    }
    return result;
  });

  // Return a copy of the object without the blacklisted properties.
  _.omit = restArgs(function(obj, keys) {
    // _dw vars
    var iteratee = keys[0], context;
    // _dw ifs
    if (_.isFunction(iteratee)) {
      iteratee = _.negate(iteratee);
      // _dw ifs
      if (keys.length > 1) context = keys[1];
    } else {
      keys = _.map(flatten(keys, false, false), String);
      // _dw func definitions
      iteratee = function(value, key) {
        return !_.contains(keys, key);
      };
    }
    return _.pick(obj, iteratee, context);
  });

  // Fill in a given object with default properties.
  _.defaults = createAssigner(_.allKeys, true);

  // Creates an object that inherits from the given prototype object.
  // If additional properties are provided then they will be added to the
  // created object.
  // _dw func definitions
  _.create = function(prototype, props) {
    // _dw vars
    var result = baseCreate(prototype);
    // _dw ifs
    if (props) _.extendOwn(result, props);
    return result;
  };

  // Create a (shallow-cloned) duplicate of an object.
  // _dw func definitions
  _.clone = function(obj) {
    // _dw ifs
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  // _dw func definitions
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Returns whether an object has a given set of `key:value` pairs.
  // _dw func definitions
  _.isMatch = function(object, attrs) {
    // _dw vars
    var keys = _.keys(attrs), length = keys.length;
    // _dw ifs
    if (object == null) return !length;
    // _dw vars
    var obj = Object(object);
    // _dw for loops
    // _dw vars
    for (var i = 0; i < length; i++) {
      // _dw vars
      var key = keys[i];
      // _dw ifs
      if (attrs[key] !== obj[key] || !(key in obj)) return false;
    }
    return true;
  };


  // Internal recursive comparison function for `isEqual`.
  // _dw vars
  var eq, deepEq;
  // _dw func definitions
  eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    // _dw ifs
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // `null` or `undefined` only equal to itself (strict comparison).
    // _dw ifs
    if (a == null || b == null) return false;
    // `NaN`s are equivalent, but non-reflexive.
    // _dw ifs
    if (a !== a) return b !== b;
    // Exhaust primitive checks
    // _dw vars
    var type = typeof a;
    // _dw ifs
    if (type !== 'function' && type !== 'object' && typeof b != 'object') return false;
    return deepEq(a, b, aStack, bStack);
  };

  // Internal recursive comparison function for `isEqual`.
  // _dw func definitions
  deepEq = function(a, b, aStack, bStack) {
    // Unwrap any wrapped objects.
    // _dw ifs
    if (a instanceof _) a = a._wrapped;
    // _dw ifs
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    // _dw vars
    var className = toString.call(a);
    // _dw ifs
    if (className !== toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
      case '[object RegExp]':
      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return '' + a === '' + b;
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN.
        // _dw ifs
        if (+a !== +a) return +b !== +b;
        // An `egal` comparison is performed for other numeric values.
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
      case '[object Symbol]':
        return SymbolProto.valueOf.call(a) === SymbolProto.valueOf.call(b);
    }

// _dw vars
    var areArrays = className === '[object Array]';
    // _dw ifs
    if (!areArrays) {
      // _dw ifs
      if (typeof a != 'object' || typeof b != 'object') return false;

      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
      // from different frames are.
      // _dw vars
      var aCtor = a.constructor, bCtor = b.constructor;
      // _dw ifs
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
                               _.isFunction(bCtor) && bCtor instanceof bCtor)
                          && ('constructor' in a && 'constructor' in b)) {
        return false;
      }
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    aStack = aStack || [];
    bStack = bStack || [];
    // _dw vars
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      // _dw ifs
      if (aStack[length] === a) return bStack[length] === b;
    }

    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);

    // Recursively compare objects and arrays.
    // _dw ifs
    if (areArrays) {
      // Compare array lengths to determine if a deep comparison is necessary.
      length = a.length;
      // _dw ifs
      if (length !== b.length) return false;
      // Deep compare the contents, ignoring non-numeric properties.
      while (length--) {
        // _dw ifs
        if (!eq(a[length], b[length], aStack, bStack)) return false;
      }
    } else {
      // Deep compare objects.
      // _dw vars
      var keys = _.keys(a), key;
      length = keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      // _dw ifs
      if (_.keys(b).length !== length) return false;
      while (length--) {
        // Deep compare each member
        key = keys[length];
        // _dw ifs
        if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
  };

  // Perform a deep comparison to check if two objects are equal.
  // _dw func definitions
  _.isEqual = function(a, b) {
    return eq(a, b);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  // _dw func definitions
  _.isEmpty = function(obj) {
    // _dw ifs
    if (obj == null) return true;
    // _dw ifs
    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
    return _.keys(obj).length === 0;
  };

  // Is a given value a DOM element?
  // _dw func definitions
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
  };

// _dw vars
  // Is a given variable an object?
  // _dw func definitions
  _.isObject = function(obj) {
    // _dw vars
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError, isMap, isWeakMap, isSet, isWeakSet.
  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error', 'Symbol', 'Map', 'WeakMap', 'Set', 'WeakSet'], function(name) {
    // _dw func definitions
    _['is' + name] = function(obj) {
      return toString.call(obj) === '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE < 9), where
  // there isn't any inspectable "Arguments" type.
  // _dw ifs
  if (!_.isArguments(arguments)) {
    // _dw func definitions
    _.isArguments = function(obj) {
      return _.has(obj, 'callee');
    };
  }

  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
  // IE 11 (#1621), Safari 8 (#1929), and PhantomJS (#2236).
  // _dw vars
  var nodelist = root.document && root.document.childNodes;
  // _dw ifs
  if (typeof /./ != 'function' && typeof Int8Array != 'object' && typeof nodelist != 'function') {
    // _dw func definitions
    _.isFunction = function(obj) {
      return typeof obj == 'function' || false;
    };
  }

  // Is a given object a finite number?
  // _dw func definitions
  _.isFinite = function(obj) {
    return !_.isSymbol(obj) && isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`?
  // _dw func definitions
  _.isNaN = function(obj) {
    return _.isNumber(obj) && isNaN(obj);
  };

  // Is a given value a boolean?
  // _dw func definitions
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
  };

  // Is a given value equal to null?
  // _dw func definitions
  _.isNull = function(obj) {
    return obj === null;
  };

// _dw vars
  // Is a given variable undefined?
  // _dw func definitions
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  // _dw func definitions
  _.has = function(obj, path) {
    // _dw ifs
    if (!_.isArray(path)) {
      return obj != null && hasOwnProperty.call(obj, path);
    }
    // _dw vars
    var length = path.length;
    // _dw for loops
    // _dw vars
    for (var i = 0; i < length; i++) {
      // _dw vars
      var key = path[i];
      // _dw ifs
      if (obj == null || !hasOwnProperty.call(obj, key)) {
        return false;
      }
      obj = obj[key];
    }
    return !!length;
  };

  // Utility Functions
  // -----------------

// _dw vars
  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  // _dw func definitions
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iteratees.
  // _dw func definitions
  _.identity = function(value) {
    return value;
  };

  // Predicate-generating functions. Often useful outside of Underscore.
  // _dw func definitions
  _.constant = function(value) {
    return function() {
      return value;
    };
  };

// _dw func definitions
  _.noop = function(){};

// _dw func definitions
  _.property = function(path) {
    // _dw ifs
    if (!_.isArray(path)) {
      return shallowProperty(path);
    }
    return function(obj) {
      return deepGet(obj, path);
    };
  };

  // Generates a function for a given object that returns a given property.
  // _dw func definitions
  _.propertyOf = function(obj) {
    // _dw ifs
    if (obj == null) {
      return function(){};
    }
    return function(path) {
      return !_.isArray(path) ? obj[path] : deepGet(obj, path);
    };
  };

  // Returns a predicate for checking whether an object has a given set of
  // `key:value` pairs.
  // _dw func definitions
  _.matcher = _.matches = function(attrs) {
    attrs = _.extendOwn({}, attrs);
    return function(obj) {
      return _.isMatch(obj, attrs);
    };
  };

  // Run a function **n** times.
  // _dw func definitions
  _.times = function(n, iteratee, context) {
    // _dw vars
    var accum = Array(Math.max(0, n));
    iteratee = optimizeCb(iteratee, context, 1);
    // _dw for loops
    // _dw vars
    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  // _dw func definitions
  _.random = function(min, max) {
    // _dw ifs
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  _.now = Date.now || function() {
    return new Date().getTime();
  };

  // List of HTML entities for escaping.
  // _dw vars
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };
  // _dw vars
  var unescapeMap = _.invert(escapeMap);

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  // _dw vars
  // _dw func definitions
  var createEscaper = function(map) {
    // _dw vars
    // _dw func definitions
    var escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped.
    // _dw vars
    var source = '(?:' + _.keys(map).join('|') + ')';
    // _dw vars
    var testRegexp = RegExp(source);
    // _dw vars
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  };
  _.escape = createEscaper(escapeMap);
  _.unescape = createEscaper(unescapeMap);

  // Traverses the children of `obj` along `path`. If a child is a function, it
  // is invoked with its parent as context. Returns the value of the final
  // child, or `fallback` if any child is undefined.
  // _dw func definitions
  _.result = function(obj, path, fallback) {
    // _dw ifs
    if (!_.isArray(path)) path = [path];
    // _dw vars
    var length = path.length;
    // _dw ifs
    if (!length) {
      return _.isFunction(fallback) ? fallback.call(obj) : fallback;
    }
    // _dw for loops
    // _dw vars
    for (var i = 0; i < length; i++) {
      // _dw vars
      var prop = obj == null ? void 0 : obj[path[i]];
      // _dw ifs
      if (prop === void 0) {
        prop = fallback;
        i = length; // Ensure we don't continue iterating.
      }
      obj = _.isFunction(prop) ? prop.call(obj) : prop;
    }
    return obj;
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  // _dw vars
  var idCounter = 0;
  // _dw func definitions
  _.uniqueId = function(prefix) {
    // _dw vars
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate: /<%([\s\S]+?)%>/g,
    interpolate: /<%=([\s\S]+?)%>/g,
    escape: /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  // _dw vars
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  // _dw vars
  var escapes = {
    "'": "'",
    '\\': '\\',
    '\r': 'r',
    '\n': 'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

// _dw vars
  var escapeRegExp = /\\|'|\r|\n|\u2028|\u2029/g;

// _dw vars
// _dw func definitions
  var escapeChar = function(match) {
    return '\\' + escapes[match];
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  // NB: `oldSettings` only exists for backwards compatibility.
  // _dw func definitions
  _.template = function(text, settings, oldSettings) {
    // _dw ifs
    if (!settings && oldSettings) settings = oldSettings;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    // _dw vars
    var matcher = RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    // _dw vars
    var index = 0;
    // _dw vars
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escapeRegExp, escapeChar);
      index = offset + match.length;

// _dw ifs
      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
        // _dw ifs
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
        // _dw ifs
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offset.
      return match;
    });
    source += "';\n";

// _dw vars
    // If a variable is not specified, place data values in local scope.
    // _dw vars
    // _dw ifs
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

// _dw vars
    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

// _dw vars
    var render;
    try {
      // _dw vars
      render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

// _dw vars
// _dw func definitions
    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled source as a convenience for precompilation.
    // _dw vars
    var argument = settings.variable || 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function. Start chaining a wrapped Underscore object.
  // _dw func definitions
  _.chain = function(obj) {
    // _dw vars
    var instance = _(obj);
    instance._chain = true;
    return instance;
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  // _dw vars
  // _dw func definitions
  var chainResult = function(instance, obj) {
    return instance._chain ? _(obj).chain() : obj;
  };

  // Add your own custom functions to the Underscore object.
  // _dw func definitions
  _.mixin = function(obj) {
    _.each(_.functions(obj), function(name) {
      // _dw vars
      var func = _[name] = obj[name];
      // _dw func definitions
      _.prototype[name] = function() {
        // _dw vars
        var args = [this._wrapped];
        push.apply(args, arguments);
        return chainResult(this, func.apply(_, args));
      };
    });
    return _;
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    // _dw vars
    var method = ArrayProto[name];
    // _dw func definitions
    _.prototype[name] = function() {
      // _dw vars
      var obj = this._wrapped;
      method.apply(obj, arguments);
      // _dw ifs
      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
      return chainResult(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  _.each(['concat', 'join', 'slice'], function(name) {
    // _dw vars
    var method = ArrayProto[name];
    // _dw func definitions
    _.prototype[name] = function() {
      return chainResult(this, method.apply(this._wrapped, arguments));
    };
  });

  // Extracts the result from a wrapped and chained object.
  // _dw func definitions
  _.prototype.value = function() {
    return this._wrapped;
  };

  // Provide unwrapping proxy for some methods used in engine operations
  // such as arithmetic and JSON stringification.
  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

// _dw func definitions
  _.prototype.toString = function() {
    return String(this._wrapped);
  };

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  // _dw ifs
  if (typeof define == 'function' && define.amd) {
    define('underscore', [], function() {
      return _;
    });
  }
}());
