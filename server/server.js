const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config({ path: "./config.env" });

const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

app.use(require("./routes/record"));
app.use(require("./routes/registration"));
app.use(require("./routes/autorisation"));
app.use(require("./routes/token"));
app.use(require("./routes/telegram"));

// get driver connection
const dbo = require("./db/conn");
app.listen(port, async () => {
  // database connection when server starts
  await dbo.connectToServer(function (err) {
    if (err) console.error(err);
   });
  console.log(`Server is running on port: ${port}`);
});
app.use((err, req, res, next) => {
  console.error('Unexpected error:', err.stack); // Логування помилки
  res.status(500).json({ message: 'Internal server error' });
});
      

  
