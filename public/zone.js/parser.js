
var fs = require('fs');
var out = console.log.bind(console);

var types = {};

function getType (type) {
  try {
    return types[type] ||
        (types[type] = require('./parsed-idl/' + type + '.idl.json'));
  } catch (e) {}
}

//var windowIdl = require('./parsed-idl/Window.idl.json');
//windowIdl.members = [];

fs.readdirSync('./parsed-idl').
  filter(function (file) {
    return file.substr(-5) === '.json';
  }).
  map(function (file) {
    return {
      name: file.substr(0, file.length - 9),
      parse: require('./parsed-idl/' + file)
    };
  }).
  forEach(function (idl) {
    parsify([idl.name], idl.parse);
    //windowIdl.members = windowIdl.members.concat(idl.members);
  });


//var nodeIdl = require('./parsed-idl/Node.idl.json');


// returns a bool representing wether or not the api is interesting
function parsify (parentPath, idl) {

  var path = [idl.name];

  while (idl && idl.inheritance) {
    path.unshift(idl.inheritance);
    idl = types[idl.inheritance];
  }

  console.log(path.join('.'));

  return;
  if (!idl.members) {
    return;
  }

  idl.members.forEach(function (member) {

    var path = parentPath.slice();
    path.push(member.name);

    /*
     * there are only a few things we care about:
     */

    // EventHandler Attributes
    // For example: "onclick"
    if (member.idlType &&
        member.idlType.idlType === 'EventHandler') {
      console.log('attribute:', path.join('.'));
    }


    // fns that take "handlers" or "callbacks"
    // not all "callbacks" are Async from what I can see.
    // In particular:
    //
    // api: CSSVariablesMap.forEach
    //  arg: 0
    // api: DataTransferItem.getAsString
    //  arg: 0
    /*
    if (member.arguments) {
      member.arguments.forEach(function (arg, i) {
        if (arg.name === 'handler' || arg.name === 'callback') {
          console.log('api:', path.join('.'), '\n', 'arg:' , i);
        }
      });
    }
    */
  });
}

//parsify(['window'], windowIdl);
//parsify(['Node'], nodeIdl);
