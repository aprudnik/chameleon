var csv = require('csv');
var fs = require('fs');

var parser = csv.parse();
var parsedObject = {};

csvPath = "../test_dialog.csv"
intentsPath = '../intents.csv'



parser.on('readable', function(){
    while(data = parser.read()){
      console.log(data);
    }
  });

  fs.createReadStream(csvPath).pipe(parser);