// 7.
// welcome to the declaration of _. Here, we learn that _ is a function. We could also have as easily discovered that by
typeof _
// > "function"

  var _ = function(obj) {

    // if obj is already a function, which would be an underscore instance function.

    if (obj instanceof _) return obj;

    // if what is passed as return new underscore
    if (!(this instanceof _)) return new _(obj);

    this._wrapped = obj;
  };

// _dw question
// how or when is this function fired? I suppose I can debugger.
// per comment in source code;
//  Create a safe reference to the Underscore object for use below.
