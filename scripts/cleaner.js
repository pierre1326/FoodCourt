var FileCleaner = require('cron-file-cleaner').FileCleaner;

function startCleaner() {
  var tmpWatcher = new FileCleaner('./images/', 60 * 60 * 1000,  '00 */15 * * * *', {
    recursive: true,
    timeField: 'ctime'
  });

  tmpWatcher.on('delete', function(file){
    console.log('DELETE');
    console.log(file.name);
    console.log(file.folder);
    console.log(file.path);
  });

  tmpWatcher.on('error', function(err){
    console.log('ERROR');
    console.error(err);
  });

  tmpWatcher.on('stop', function(info){
    console.log('STOP');
    console.log(info.path);
    console.log(info.cronTime);
  });

  tmpWatcher.on('start', function(info){
    console.log('START');
    console.log(info.path);
    console.log(info.cronTime);
  });

  tmpWatcher.start();
  return tmpWatcher;
}

module.exports = { startCleaner };
