//require packages
const express = require('express');
const fs = require('fs');

const app = express();

const PORT = process.env.PORT || 3001;

//middleware to process json and urls
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//static resources in public folder
app.use(express.static('public'));

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
