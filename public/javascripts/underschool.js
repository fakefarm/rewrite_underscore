var _ = (function(){
  function _() {};

  var slice = Array.prototype.slice,
      pop = Array.prototype.pop,
      nativeIsArray = Array.isArray,
      nativeKeys = Object.keys,
      getLength = shallowProperty('length'),
      MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;

var optimizeCb = function(func, context, argCount) {
// _dw take some time to tinker with this one!
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


// Helper methods of some kind...
// _dw what is a shallow property?
  function shallowProperty(key) {
    return function(obj) {
      return obj == null ? void 0 : obj[key];
    };
  }

  function isArrayLike(collection) {
    var length = getLength(collection);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  }

  //- _function functions --------------
  //----------------------------------------------------

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

  _.difference = restArgs(function(array, rest){
    rest = flatten(rest, true, true);
    return _.filter(array, function(value) {
      return !_.contains(rest, value);
    });
  });


 //- _Array functions -----------------
 //----------------------------------------------------

  // _dw - seems the difference in first() & initial() is how they deal with N. With first(), use N to declare that you want 'the first N of an array'. With initial, you are using N to declare that you want all of the array execpt 'N'

  _.first = _.head = _.take = function(array, n, guard) {
    if( array == null || array.length < 1 ) return void 0;
    if(n == null || guard ) return array[0];
    return _.initial(array, array.length - n);
  };

  _.initial = function(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  };

  _.rest = _.tail = _.drop = function(array, n) {
    // _dw seems that slice's api works that the second argument can either be a boolean or a number.
    // if it's a boolean (true) then it will slice the first element
    // if it's false, then it does not slice first element
    // if it's a number, then it will slice the number of elements off the front and go until the end.
    var num = ( n == null || n );
    return slice.call(array, num);
  };

  _.last = function(array, n, guard) {
    if (array == null || array.length < 1) return void 0; // _dw returns undefined rather than blowing up. Nice!
    if (n == null || guard) return array[array.length - 1];
    return _.rest(array, Math.max(0, array.length - n));
  };

  // _dw coming back to compact
  _.compact = function(array) {};

  var flatten = function(input, shallow, strict, output) {
    // _dw this is some meat! I need to study this function...
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
    // _dw review this one.
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
  }

  _.without = restArgs(function(array, otherArrays){
      return _.difference(array, otherArrays);
  })


  //- _Object functions ----------------
  //----------------------------------------------------

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

  //- _Collection functions ----------------------------
  //----------------------------------------------------

  var builtinIteratee;

  // An internal function to generate callbacks that can be applied to each element in a collection, returning the desired result - either `identity`, an arbitrary callback, a property matcher, or a property accessor
  var cb = function(value, context, argCount) {
    if(_.iteratee !== builtinIteratee) return _.iteratee(value, context);
    if (value == null) return _.identity;
    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
    if (_.isObject(value) && !_.isArray(value)) return _.matcher(value);
    return _.property(value);
  }

  // External wrapper for our callback generator. Users may customize `_.iteratee` if they want additional predicate/iteratee shorthand styles. This abstraction hides the internal-only argCount argument.

  _.iteratee = builtinIteratee = function(value, context) {
    return cb(value, context, Infinity);
  }

  // _filter
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

  // _keys
  // Retrieve the names of an object's own properties. Delegates to ES5's native Object.keys

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

  return _;
}());
