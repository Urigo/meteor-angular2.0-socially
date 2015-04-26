var POSITION_NAME = ['', '1st', '2nd', '3rd'];
function argPositionName(i) {
  var position = (i / 2) + 1;
  return POSITION_NAME[position] || (position + 'th');
}
var primitives = $traceurRuntime.type;
function assertArgumentTypes(...params) {
  var actual,
    type;
  var currentArgErrors;
  var errors = [];
  var msg;
  for (var i = 0,
         l = params.length; i < l; i = i + 2) {
    actual = params[i];
    type = params[i + 1];
    currentArgErrors = [];
    if (!isType(actual, type, currentArgErrors)) {
      errors.push(argPositionName(i) + ' argument has to be an instance of ' + prettyPrint(type) + ', got ' + prettyPrint(actual));
      if (currentArgErrors.length) {
        errors.push(currentArgErrors);
      }
    }
  }
  if (errors.length) {
    throw new Error('Invalid arguments given!\n' + formatErrors(errors));
  }
}
function prettyPrint(value) {
  if (typeof value === 'undefined') {
    return 'undefined';
  }
  if (typeof value === 'string') {
    return '"' + value + '"';
  }
  if (typeof value === 'boolean') {
    return value.toString();
  }
  if (value === null) {
    return 'null';
  }
  if (typeof value === 'object') {
    if (value.map) {
      return '[' + value.map(prettyPrint).join(', ') + ']';
    }
    var properties = Object.keys(value);
    return '{' + properties.map((p) => p + ': ' + prettyPrint(value[p])).join(', ') + '}';
  }
  return value.__assertName || value.name || value.toString();
}
function isType(value, T, errors) {
  if (T === primitives.void) {
    return typeof value === 'undefined';
  }
  if (T === primitives.any || value === null) {
    return true;
  }
  if (T === primitives.string) {
    return typeof value === 'string';
  }
  if (T === primitives.number) {
    return typeof value === 'number';
  }
  if (T === primitives.boolean) {
    return typeof value === 'boolean';
  }
  if (typeof T.assert === 'function') {
    var parentStack = currentStack;
    var isValid;
    currentStack = errors;
    try {
      isValid = T.assert(value);
    } catch (e) {
      fail(e.message);
      isValid = false;
    }
    currentStack = parentStack;
    if (typeof isValid === 'undefined') {
      isValid = errors.length === 0;
    }
    return isValid;
  }
  return value instanceof T;
}
function formatErrors(errors, indent = '  ') {
  return errors.map((e) => {
    if (typeof e === 'string')
    return indent + '- ' + e;
  return formatErrors(e, indent + '  ');
}).join('\n');
}
function type(actual, T) {
  var errors = [];
  if (!isType(actual, T, errors)) {
    var msg = 'Expected an instance of ' + prettyPrint(T) + ', got ' + prettyPrint(actual) + '!';
    if (errors.length) {
      msg += '\n' + formatErrors(errors);
    }
    throw new Error(msg);
  }
}
function returnType(actual, T) {
  var errors = [];
  if (!isType(actual, T, errors)) {
    var msg = 'Expected to return an instance of ' + prettyPrint(T) + ', got ' + prettyPrint(actual) + '!';
    if (errors.length) {
      msg += '\n' + formatErrors(errors);
    }
    throw new Error(msg);
  }
  return actual;
}
var string = define('string', function(value) {
  return typeof value === 'string';
});
var boolean = define('boolean', function(value) {
  return typeof value === 'boolean';
});
var number = define('number', function(value) {
  return typeof value === 'number';
});
function arrayOf(...types) {
  return assert.define('array of ' + types.map(prettyPrint).join('/'), function(value) {
    if (assert(value).is(Array)) {
      for (var item of value) {
        assert(item).is(...types);
      }
    }
  });
}
function structure(definition) {
  var properties = Object.keys(definition);
  return assert.define('object with properties ' + properties.join(', '), function(value) {
    if (assert(value).is(Object)) {
      for (var property of properties) {
        assert(value[property]).is(definition[property]);
      }
    }
  });
}
var currentStack = [];
function fail(message) {
  currentStack.push(message);
}
function define(classOrName, check) {
  var cls = classOrName;
  if (typeof classOrName === 'string') {
    cls = function() {};
    cls.__assertName = classOrName;
  }
  cls.assert = function(value) {
    return check(value);
  };
  return cls;
}
function assert(value) {
  return {is: function is(...types) {
    var allErrors = [];
    var errors;
    for (var type of types) {
      errors = [];
      if (isType(value, type, errors)) {
        return true;
      }
      allErrors.push(prettyPrint(value) + ' is not instance of ' + prettyPrint(type));
      if (errors.length) {
        allErrors.push(errors);
      }
    }
    currentStack.push(...allErrors);
    return false;
  }};
}
assert.type = type;
assert.argumentTypes = assertArgumentTypes;
assert.returnType = returnType;
assert.define = define;
assert.fail = fail;
assert.string = string;
assert.number = number;
assert.boolean = boolean;
assert.arrayOf = arrayOf;
assert.structure = structure;
export {assert};
