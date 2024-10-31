const app = require('./app.js');
require('./wsServer.js');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`\x1b[36mServer running in ${process.env.NODE_ENV} mode on port ${PORT}\x1b[0m`);
});
