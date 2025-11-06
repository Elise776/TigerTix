const express = require('express');
const cors = require('cors');
const app = express();
const routes = require('./routes/authenticationRoutes');
const cookieParser = require('cookie-parser');
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use('/api/authentication', routes);
const PORT = 8001;
app.listen(PORT, () =>
  console.log(`Client Server running at
http://localhost:${PORT}`)
);
