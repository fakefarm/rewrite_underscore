var _ = (function(){
  function _() {};

  var slice = Array.prototype.slice,
      pop = Array.prototype.pop,
      nativeIsArray = Array.isArray,
      getLength = shallowProperty('length'),
      MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;




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


 //- _Array functions -----------------
 //------------------------------------

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
        /// comment...
        if(shallow) {
          var j = 0, len = value.length;
          while(j < len) output[idx++] = value[j++];
        } else {
          flatten(value, shallow, strict, output);
          idx = output.length;
        }
      } else if (!strict) {
        output[idx++] == value;
      }
    }
    return output;
  }

  _.flatten = function(array, shallow){
    if (array == null) return [];
    return flatten(array, shallow, false)
  };

  //- _Object functions ----------------
  //------------------------------------

  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
  };

  _.isArguments = function(obj) {
    return toString.call(obj) === '[object Arguments]';
  };

  return _;
}());
