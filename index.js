const express = require('express');
const axios = require('axios');
const app = express();

require('dotenv').config();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;

app.get('/', async (req, res) => {
    const properties = req.query.properties ? req.query.properties : 'name,level,elemental_type';
    const customObjectsUrl = 'https://api.hubapi.com/crm/v3/objects/2-141140260';
    
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        const response = await axios.get(customObjectsUrl, {
            headers,
            params: {
                limit: 10, 
                archived: false,
                properties: properties
            }
        });

        const customObjects = response.data.results;
        console.log('API Response:', customObjects);

        res.render('contacts', { title: 'Homepage | Integrating With HubSpot', customObjects });
    } catch (error) {
        console.error('Error retrieving custom objects:', error.response ? error.response.data : error.message);
        res.status(500).send('Error retrieving custom objects.');
    }
});


app.get('/update-cobj', (req, res) => {
    res.render('updates', { title: 'Update Custom Object Form' });
  });

app.post('/update-cobj', async (req, res) => {
    const { name, elemental_type, level } = req.body;

    const newCustomObject = {
        properties: {
            name,
            elemental_type,
            level
        }
    };

    const apiUrl = 'https://api.hubapi.com/crm/v3/objects/2-141140260'; 
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        await axios.post(apiUrl, newCustomObject, { headers });

        res.redirect('/');
    } catch (error) {
        console.error('Error creating custom object:', error.response ? error.response.data : error.message);
        res.status(500).send('Error creating custom object');
    }
});


app.listen(3000, () => console.log('Server läuft auf http://localhost:3000'));
