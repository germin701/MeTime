// radio
const axios = require('axios');

const querystr = `https://de1.api.radio-browser.info/json/stations/bycountry/Malaysia`;
const app = require('express')
app.use(express.json())

// app.get('/myapi'