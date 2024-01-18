import express, { Express, Request, Response } from 'express';
const cors = require("cors");
const app: Express = express();
const port = process.env.PORT || 3000;
const axios = require('axios');
import bodyParser from 'body-parser';
require("dotenv").config();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
// Middlewares here 
app.use(express.json()); 
app.use(cors()); 


const RapidAPIKey = "2c0387dc3amsh6a10f83163c9f0cp1ff47ejsn9c370237d1b6";
const headers = {
    'X-RapidAPI-Key': `${RapidAPIKey}`,
    'X-RapidAPI-Host': 'car-api2.p.rapidapi.com'
}
const rapidAPIUrl = 'https://car-api2.p.rapidapi.com/api/';
const apiByNinjaUrl = 'https://cars-by-api-ninjas.p.rapidapi.com/v1/';

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

//API Ninjas Cars API endpoint.
//Get car data from given parameters. Returns a list of car models (and their information) that satisfy the parameters.
// Parameters
// make (optional) - vehicle manufacturer (e.g. audi or toyota).
// model (optional) - vehicle manufacturer (e.g. a4 or corolla).
// fuel_type (optional) - type of fuel used. Possible values: gas, diesel, electricity.
// drive (optional) - drive transmission. Possible values: fwd (front-wheel drive), rwd (rear-wheel drive), awd (all-wheel drive), 4wd (four-wheel drive).
// cylinders (optional) - number of cylinders in engine. Possible values: 2, 3 4, 5, 6, 8, 10, 12, 16.
// transmission (optional) - type of transmission. Possible values: manual, automatic.
// year (optional) - vehicle model year (e.g. 2018).
// min_city_mpg (optional) - minimum city fuel consumption (in miles per gallon).
// max_city_mpg (optional) - maximum city fuel consumption (in miles per gallon).
// min_hwy_mpg (optional) - minimum highway fuel consumption (in miles per gallon).
// max_hwy_mpg (optional) - maximum highway fuel consumption (in miles per gallon).
// min_comb_mpg (optional) - minimum combination (city and highway) fuel consumption (in miles per gallon).
// max_comb_mpg (optional) - maximum combination (city and highway) fuel consumption (in miles per gallon).
// limit (optional) - How many results to return. Must be between 1 and 50. Default is 5.
app.get('/api/v1/cars', async (req: Request, res: Response) => {
    let params = req.body || { model: 'corolla' };
    const options = {
        method: 'GET',
        url:  `${apiByNinjaUrl}cars`,
        params,
        headers: {
            'X-RapidAPI-Key': `${RapidAPIKey}`,
            'X-RapidAPI-Host': 'cars-by-api-ninjas.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        res.json({ status: 'success', data: response.data });
    } catch (error) {
        res.json({ status: 'failed', msg: error });
    }
});


app.post("/api/v1/create-checkout-session", async (req, res) => { 
    const { product } = req.body; 
    //console.log(product);
    const session = await stripe.checkout.sessions.create({ 
        payment_method_types: ["card"], 
        line_items: [ 
            { 
            price_data: { 
                currency: "inr", 
                product_data: { 
                    name: product.name, 
                }, 
                unit_amount: product.price * 100, 
            }, 
            quantity: product.quantity, 
            }, 
        ], 
        mode: "payment", 
        success_url: `http://localhost:${port}/success`, 
        cancel_url: `http://localhost:${port}/cancel`, 
    }); 
    res.json({ id: session.id }); 
}); 

app.listen(port, () => {
    console.log(`Server running at port ${port}`);
});