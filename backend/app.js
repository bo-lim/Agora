const express = require('express')
const app = express()
const cors = require('cors');
const routes = require('./routes')
const PORT = process.env.PORT

app.use(cors()); // 모든 출처에서의 요청을 허용합니다.

const users = require('./routes/users')
// const discussions = require('./routes/discussions')

app.use('/', routes)

// Application will fail if environment variables are not set
if(!process.env.PORT) {
  const errMsg = "PORT environment variable is not defined"
  console.error(errMsg)
  throw new Error(errMsg)
}

if(!process.env.GUESTBOOK_DB_ADDR) {
  const errMsg = "GUESTBOOK_DB_ADDR environment variable is not defined"
  console.error(errMsg)
  throw new Error(errMsg)
}

// Connect to MongoDB, will retry only once
users.connectToMongoDB()

// Starts an http server on the $PORT environment variable
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});

module.exports = app
