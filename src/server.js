const app = require('./app');
require('./socket')
const { BasicConfig } = require('./config/env');

init();

async function init() {
  try {
    app.listen(BasicConfig.port, () => {
      console.log('Express App Listening on Port 3001');
    });
  } catch (error) {
    console.error(`An error occurred: ${JSON.stringify(error)}`);
    process.exit(1);
  }
}
