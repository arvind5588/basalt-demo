import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
const app: Express = express();
const port = process.env.PORT || 3000;
const axios = require('axios');
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

const headers = {
    'X-RapidAPI-Key': '2c0387dc3amsh6a10f83163c9f0cp1ff47ejsn9c370237d1b6',
    'X-RapidAPI-Host': 'car-api2.p.rapidapi.com'
}
const rapidAPIUrl = 'https://car-api2.p.rapidapi.com/api/';

const defaultParams = {sort: 'id', direction: 'asc', year: '2021', verbose: 'yes' };

//get Vehicle Identification Numbers
app.get('/api/v1/vin', async (req: Request, res: Response) => {
    const options = {
        method: 'GET',
        url: `${rapidAPIUrl}vin/1GTG6CEN0L1139305`,
        headers
    };
    try {
        const response = await axios.request(options);
        res.json({ status: 'success', data: response.data });
    } catch (error) {
        res.json({ status: 'failed', msg: error });
    }
});

//Search models by year, make, model, trim or make_id.
app.get('/api/v1/models', async (req: Request, res: Response) => {
    //set the default params, if no request present
    let params = req.body || defaultParams;
    const options = {
        method: 'GET',
        url: `${rapidAPIUrl}models`,
        params,
        headers
    };

    try {
        const response = await axios.request(options);
        res.json({ status: 'success', data: response.data });
    } catch (error) {
        res.json({ status: 'failed', msg: error });
    }
});


//To include additional information about the body (such as year, make, model and trim) 
app.get('/api/v1/bodies', async (req: Request, res: Response) => {
    let params = req.body || defaultParams;
    
    const options = {
        method: 'GET',
        url: `${rapidAPIUrl}bodies`,
        params,
        headers
    };

    try {
        const response = await axios.request(options);
        res.json({ status: 'success', data: response.data });
    } catch (error) {
        res.json({ status: 'failed', msg: error });
    }
});

app.listen(port, () => {
    console.log(`Server running at port ${port}`);
});