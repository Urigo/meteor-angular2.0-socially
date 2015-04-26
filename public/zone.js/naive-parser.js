var WebIDL2 = require('webidl2');
var fs = require('fs');

function identity (x) {
  return x;
}


var successful = 0,
    firstError,
    firstFile,
    classes = {};


fs.readdirSync('./blink-idl').
  filter(function (file) {
    return file.substr('-4') === '.idl';
  }).
  map(function (file) {
    return {
      name: file,
      contents: fs.readFileSync('./blink-idl/' + file, 'utf-8')
    };
  }).
  map(function (idl) {
    try {
      idl.parse = WebIDL2.parse(idl.contents)[0];
      successful += 1;
      return idl;
    } catch (e) {
      if (!firstError) {
        firstError = e;
        firstFile = idl.name;
      }
    }
  }).
  forEach(function (idl) {
    fs.writeFileSync('./parsed-idl/' + idl.name + '.json', JSON.stringify(idl.parse, null, 2));
    classes[idl.parse.name] = idl.parse;
  });

Object.keys(classes).forEach(function (className) {
  var ancestor = classes[className].inheritance;
  if (ancestor) {
    classes[className].parent = classes[ancestor];
  }
});

//console.log(JSON.stringify(classes, null, 2));

console.log('Processed:', successful);

if (firstError) {
  console.log(firstError);
  console.log('Issue with', firstFile);
} else {
  console.log('✓ excellent work everyone');
}



Object.keys(classes).forEach(function (className) {
  if (classes[className].members && classes[className].members.some(function (member) {
    return member.idlType && member.idlType.idlType === 'EventHandler';
  })) {
    console.log(classes[className])
  }
});

  /*
  filter(identity).
  map(function (parsed) {
    console.log(JSON.stringify(parsed, null, 2));
  });
  */
