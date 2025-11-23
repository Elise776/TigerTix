const express = require('express');
const cors = require('cors');
const app = express();
const routes = require('./routes/authenticationRoutes');
const cookieParser = require('cookie-parser');
app.use(express.json());
app.use(cookieParser());
const allowedOrigins = ["http://localhost:3000", "tiger-tix-nine.vercel.app"];
app.use(cors({origin: allowedOrigins,credentials: true,}));

app.use('/api/authentication', routes);
const PORT = process.env.PORT || 8001;
app.listen(PORT, () =>
  console.log(`Client Server running at
http://localhost:${PORT}`)
);
