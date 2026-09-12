const app = require('./app');
const env = require('./config/env');
const { connectDB } = require('./config/database');

connectDB();
app.listen(env.port, () => {
  console.log(`🚀 Server is running on port ${env.port}`);
});
