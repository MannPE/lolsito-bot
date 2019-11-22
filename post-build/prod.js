const fs = require('fs-extra');
const path = require('path');

fs.copySync(
  path.resolve(__dirname, './../src/auth.json'),
  path.resolve(__dirname, './../build/auth.json')
);

fs.copySync(
  path.resolve(__dirname, './../src/data_dragon'),
  path.resolve(__dirname, './../build/data_dragon')
);
fs.copySync(
  path.resolve(__dirname, './../src/maxshi2sData'),
  path.resolve(__dirname, './../build/maxshi2sData')
);
