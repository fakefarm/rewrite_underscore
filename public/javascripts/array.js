var _ = (function(){
  function _() {};

  var slice = Array.prototype.slice;

  _.first = function(array, n) {
    if( array == null || array.length < 1 ) return void 0;
    if(n == null) return array[0];
    if(n == 0) return [];
  };

  _.initial = function(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  };

  return _;
}());
