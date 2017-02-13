var _ = (function(){
  function _() {};

  var slice = Array.prototype.slice,
      pop = Array.prototype.pop,
      nativeIsArray = Array.isArray,
      nativeKeys = Object.keys,
      nativeCreate = Object.create,
      getLength = shallowProperty('length'),
      MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;

  var optimizeCb = function(func, context, argCount) {
  // _dw study
    if(context === void 0) return func;
    switch (argCount) {
      case 1: return function(value) {
        return func.call(context, value);
      };
      // The 2-parameter case has been omitted only because no current consumers made use of it.
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

  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
    var self = baseCreate(sourceFunc.prototype);
    var result = sourceFunc.apply(self, args);
    if (_.isObject(result)) return result;
    return self;
  }
  
  // _dw question
  // what is a shallow property?
  function shallowProperty(key) {
    return function(obj) {
      return obj == null ? void 0 : obj[key];
    };
  }

  function isArrayLike(collection) {
    var length = getLength(collection);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  }

  var baseCreate = function (prototype) {
    // _dw study
    if(!_.isObject(prototype)) return {};
    if (nativeCreate) return nativeCreate(prototype);
    Ctor.prototype = prototype;
    var result = new Ctor;
    Ctor.prototype = null;
    return result;
  }

  var restArgs = function(func, startIndex) {
    startIndex = startIndex == null ? func.length - 1 : +startIndex;
    return function() {
      var length = Math.max(arguments.length - startIndex, 0),
          rest = Array(length),
          index = 0;
      for (; index < length; index++) {
        rest[index] = arguments[index + startIndex];
      }
      switch (startIndex) {
        case 0: return func.call(this, rest);
        case 1: return func.call(this, arguments[0], rest);
        case 2: return func.call(this, arguments[0], arguments[1], rest);
      }
      var args = Array(startIndex + 1);
      for (index = 0; index < startIndex; index++) {
        args[index] = arguments[index];
      }
      args[startIndex] = rest;
      return func.apply(this, args);
    };
  };

  // An internal function to generate callbacks that can be applied to each element in a collection, returning the desired result - either `identity`, an arbitrary callback, a property matcher, or a property accessor

  var cb = function(value, context, argCount) {
    if(_.iteratee !== builtinIteratee) return _.iteratee(value, context);
    if (value == null) return _.identity;
    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
    if (_.isObject(value) && !_.isArray(value)) return _.matcher(value);
    // _dw how was map able to work before using this?
    return _.property(value);
  }
  _.difference = restArgs(function(array, rest){
    rest = flatten(rest, true, true);
    return _.filter(array, function(value) {
      return !_.contains(rest, value);
    });
  });

  // _dw note
  // seems the difference in first() & initial() is how they deal with N. With first(), use N to declare that you want 'the first N of an array'. With initial, you are using N to declare that you want all of the array execpt 'N'

  _.first = _.head = _.take = function(array, n, guard) {
    if( array == null || array.length < 1 ) return void 0;
    if(n == null || guard ) return array[0];
    return _.initial(array, array.length - n);
  };

  _.initial = function(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  };

  _.rest = _.tail = _.drop = function(array, n) {
    // _dw note
    // seems that slice's api works that the second argument can either be a boolean or a number.
    // if it's a boolean (true) then it will slice the first element
    // if it's false, then it does not slice first element
    // if it's a number, then it will slice the number of elements off the front and go until the end.
    var num = ( n == null || n );
    return slice.call(array, num);
  };

  _.last = function(array, n, guard) {
    if (array == null || array.length < 1) return void 0;
    // _dw note
    // returns undefined rather than blowing up. Nice!
    if (n == null || guard) return array[array.length - 1];
    return _.rest(array, Math.max(0, array.length - n));
  };

  _.compact = function(array) {};

  var flatten = function(input, shallow, strict, output) {
    // _dw study

    output = output || [];
    var idx = output.length;
    for ( var i = 0, length = getLength(input); i < length; i++) {
      var value = input[i];
      if(isArrayLike(value) && (_.isArray(value) || _.isArguments(value))){
        if(shallow) {
          var j = 0, len = value.length;
          while(j < len) output[idx++] = value[j++];
        } else {
          flatten(value, shallow, strict, output);
          idx = output.length;
        }
      } else if (!strict) {
        output[idx++] = value;
      }
    }
    return output;
  }

  _.flatten = function(array, shallow){
    if (array == null) return [];
    return flatten(array, shallow, false)
  };

  _.range = function(start, stop, step) {
    // _dw study
    if (stop == null) {
      stop = start || 0;
      start = 0;
    }
    if(!step) {
      step = stop < start ? -1 : 1;
    }
    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }
    return range;
  };

  _.without = restArgs(function(array, otherArrays){
      return _.difference(array, otherArrays);
  });

  var createIndexFinder = function(dir, predicateFind, sortedIndex) {
    return function(array, item, idx) {
      var i = 0, length = getLength(array);
      if (typeof idx == 'number' ) {
        if (dir > 0) {
          i = idx >= 0 ? idx : Math.max(idx + length, i);
        } else {
          length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
        }
      } else if (sortedIndex && idx && length ) {
        idx = sortedIndex(array, item);
        return array[idx] === item ? idx : -1;
      }
      if (item !== item) {
        // _dw fail
        // TypeError: predicateFind is not a function when running the pending include specs. I need to dig into this one!
        idx = predicateFind(slice.call(array, i, length), _.isNaN);
        return idx >= 0 ? idx + i : -1;
      }
      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
        if (array[idx] === item) return idx;
      }
      return -1;
    };
  };

  _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);

  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
  };

  _.isArguments = function(obj) {
    return toString.call(obj) === '[object Arguments]';
  };

  _.restArgs = restArgs;

  _.isFunction = function(obj) {
    return typeof obj == 'function' || false
  }

  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // External wrapper for our callback generator. Users may customize `_.iteratee` if they want additional predicate/iteratee shorthand styles. This abstraction hides the internal-only argCount argument.

  _.iteratee = builtinIteratee = function(value, context) {
    return cb(value, context, Infinity);
  }

  _.filter = function(obj, predicate, context) {
    var results = [];
    predicate = cb(predicate, context);
    _.each(obj, function(value, index, list) {
      if(predicate(value, index, list)) results.push(value);
    });
    return results;
  }

  _.each = _.forEach = function(obj, iteratee, context) {
    iteratee = optimizeCb(iteratee, context);
    var i, length;
    if (isArrayLike(obj)) {
      for ( i = 0, length = obj.length; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      var keys = _.keys(obj);
      for (i = 0, length = keys.length; i < length; i++) {
        iteratee(obj[keys[i]], keys[i], obj);
      }
    };
    return obj;
  };

  _.map = function (obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length,
        results = Array(length);
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    return keys;
  };

  _.isObject = function (obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  }

  _.contains = _.includes = _.include =  function (obj, item, fromIndex, guard) {
    if (!isArrayLike(obj)) obj = _.values(obj);
    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
    return _.indexOf(obj, item, fromIndex) >= 0;
  };

  _.toArray = function (obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (_.isString(obj)) {
      return obj.match(reStrStymbol);
    }
    if (isArrayLike(obj)) return _.map(obj, _.identity);
    return _.values(obj);
  }

  // Add some isType methods: isAgruments, isFunction, isString, isNumber, isDate, isRegExp, isError, isMap, isWeakMap, isSet, isWeakSet.

  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error', 'Symbol', 'Map', 'WeakMap', 'Set', 'WeakSet'], function (name) {
    _['is' + name] = function (obj) {
      return toString.call(obj) === '[object ' + name + ']';
    };
  });

  _.bind = restArgs(function(func, context, args) {
    if(!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
    var bound = restArgs(function(callArgs) {
      return executeBound(func, bound, context, this, args.concat(callArgs));
    });
    return bound;
  });

  // Partially apply a function by creating a version that has had some of its arguments pre-filled, without changing its dynamic 'this' context. _ acts as a placeholder by default, allowing any combination of argumennts to be pre-filled. Set _.partial.placeholder for a custom placeholder argument

  _.partial = restArgs(function (func, boundArgs) {
    var placeholder = _.partial.placeholder;
    var bound = function () {
      var position = 0, length = boundArgs.length;
      var args = Array(length);
      for (var i = 0; i <  length; i++) {
        // _dw study
        args[i] = boundArgs[i] === placeholder ? arguments[position++] : boundArgs[i]
      }
      while (position < arguments.length)
      args.push(arguments[position++]);
      return executeBound(func, bound, this, this, args);
    };
    return bound;
  })

  return _;
}());
