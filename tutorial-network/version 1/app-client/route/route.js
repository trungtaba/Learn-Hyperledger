var express = require('express');
var router = express.Router();
var Composer = require('../model/composer');
var bodyParser = require('body-parser');
// create application/json parser
var jsonParser = bodyParser.json();

var composer = new Composer();

router.get('/commodity/all', jsonParser, function (req, res) {
    var value;
    res.setHeader('Content-Type', 'application/json');
    composer.getAllCommodities()
        .then((table) => {
            res.status(200).send(JSON.stringify({ "code": 200, "message": table }));
        }).catch((err) => {
            res.status(400).send(JSON.stringify({ "code": 400, "message": err.toString() }));
        });
});

router.get('/trader/all', jsonParser, function (req, res) {
    var value;
    res.setHeader('Content-Type', 'application/json');
    composer.getAllTraders()
        .then((table) => {
            res.status(200).send(JSON.stringify({ "code": 200, "message": table }));
        }).catch((err) => {
            res.status(400).send(JSON.stringify({ "code": 400, "message": err.toString() }));
        });
});

router.get('/trader/get/:tradeid', jsonParser, function (req, res) {
    let tradeid = req.params.tradeid;
    res.setHeader('Content-Type', 'application/json');
    if (!tradeid) {
        res.status(404).send(JSON.stringify({ "code": 404, "message": "Trader Id not found" }));
    } else {
        composer.getTrader(tradeid)
            .then((trader) => {
                if (trader == null) {
                    res.status(404).send(JSON.stringify({ "code": 404, "message": "Trader with tradeid= " + tradeid + "not found" }));
                } else {
                    res.status(200).send(JSON.stringify({ "code": 200, "message": trader }));
                }
            }).catch((err) => {
                res.status(400).send(JSON.stringify({ "code": 400, "message": err.toString() }));
            });
    }
});

router.get('/commodity/get/:tradingSymbol', jsonParser, function (req, res) {
    let tradingSymbol = req.params.tradingSymbol;
    console.log(tradingSymbol);
    res.setHeader('Content-Type', 'application/json');
    if (!tradingSymbol) {
        res.status(404).send(JSON.stringify({ "code": 404, "message": "TradingSymbol not found" }));
    } else {
        composer.getCommodityBySymbol(tradingSymbol)
            .then((commodity) => {
                if (commodity == null) {
                    res.status(404).send(JSON.stringify({ "code": 404, "message": "Commodity with tradingSymbol= " + tradingSymbol + "not found" }));
                } else {
                    res.status(200).send(JSON.stringify({ "code": 200, "message": commodity }));
                }
            }).catch((err) => {
                res.status(400).send(JSON.stringify({ "code": 400, "message": err.toString() }));
            });
    }
});

router.get('/commodity/getByTrader/:tradeid', jsonParser,async function (req, res) {
    let tradeid = req.params.tradeid;
    res.setHeader('Content-Type', 'application/json');
    if (!tradeid) {
        res.status(404).send(JSON.stringify({ "code": 404, "message": "TradingSymbol not found" }));
    } else {
        var commodities=await composer.getCommoditiesByTrader(tradeid);
        if(commodities === null){
            res.status(404).send(JSON.stringify({ "code": 404, "message": "Commodity with tradeid= " + tradeid + "not found" }));
        }else{
            res.status(200).send(JSON.stringify({ "code": 200, "message": commodities }));
        }
    }
});

router.post('/trader/create', jsonParser, async function (req, res) {
    let tradeid = req.body.tradeid;
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;

    res.setHeader('Content-Type', 'application/json');
    if (tradeid == null || tradeid === '') {
        res.status(400).send(JSON.stringify({ "code": 40, "message": "TradeId null" }));
    } else if (firstName == null || firstName === '') {
        res.status(400).send(JSON.stringify({ "code": 400, "message": "FirstName null" }));
    }
    else if (lastName == null || lastName === '') {
        res.status(400).send(JSON.stringify({ "code": 400, "message": "LastName null" }));
    } else {
        var result = await composer.createTrader(tradeid, firstName, lastName);
        if (result === false) {
            res.status(400).send(JSON.stringify({ "code": 400, "message": "create trader error"}));
        } else
            res.status(200).send(JSON.stringify({ "code": 200, "message": "create trader successfullly" }));
    }
});

router.post('/commodity/create/', jsonParser, async function (req, res) {
    let tradingSymbol = req.body.tradingSymbol;
    let tradeid = req.body.tradeid;
    let quantity = req.body.quantity;
    let mainExchange = req.body.mainExchange;
    let description = req.body.description;

    res.setHeader('Content-Type', 'application/json');
    if (tradeid == null || tradeid === '') {
        res.status(400).send(JSON.stringify({ "code": 400, "message": "TradeId null" }));
    } else if (tradingSymbol == null || tradingSymbol === '') {
        res.status(400).send(JSON.stringify({ "code": 400, "message": "TradingSymbol null" }));
    } else if (mainExchange == null || mainExchange === '') {
        res.status(400).send(JSON.stringify({ "code": 400, "message": "MainExchange null" }));
    } else if (quantity == null || Number(quantity) !== quantity) {
        res.status(400).send(JSON.stringify({ "code": 400, "message": "Quatity null or not a double value" }));
    } else {
        var result = await composer.createCommodity(tradingSymbol, description, mainExchange, quantity, tradeid);
        if (result === true)
            res.status(200).send(JSON.stringify({ "code": 200, "message": "create commodity successfullly" }));
        else
            res.status(400).send(JSON.stringify({ "code": 400, "message": "error" }));
    }
});

router.post('/createTrade', jsonParser, async function(req,res){
    let tradingSymbol = req.body.tradingSymbol;
    let tradeid = req.body.tradeid;
    res.setHeader('Content-Type', 'application/json');
    if (tradeid == null || tradeid === '') {
        res.status(400).send(JSON.stringify({ "code": 400, "message": "TradeId null" }));
    } else if (tradingSymbol == null || tradingSymbol === '') {
        res.status(400).send(JSON.stringify({ "code": 400, "message": "TradingSymbol null" }));
    }else{
        var result = await composer.createTrade(tradeid,tradingSymbol);
        if (result === true)
            res.status(200).send(JSON.stringify({ "code": 200, "message": "create commodity successfullly" }));
        else
            res.status(400).send(JSON.stringify({ "code": 400, "message": "error" }));
    }
});

module.exports = router;