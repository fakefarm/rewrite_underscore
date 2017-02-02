var _ = (function(){
  var _ = function() {}

  _.first = function(array, n) {
    if( array == null || array.length < 1 ) return void 0;
    if(n == null) return array[0];
    if(n == 0) return [];
  }
  return _;
}());
