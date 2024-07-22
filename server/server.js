const express = require('express');
const bodyParser = require('body-parser');
const animationRoutes = require('./routes/animation.routes');
const errorMiddleWare = require('./middleware/errorMiddleware');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

//middleware
app.use(bodyParser.json());

//routes
app.use('/animations', animationRoutes);

app.use(errorMiddleWare);

//start serverrr
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});