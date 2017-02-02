var _ = (function(){
  function _() {};

  var slice = Array.prototype.slice;
  var pop = Array.prototype.pop;


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

  _.compact = function(array) {};

  return _;
}());
