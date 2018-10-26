var express = require('express');
var router = express.Router();
var Composer = require('../model/composer');
var bodyParser = require('body-parser');
// create application/json parser
var jsonParser = bodyParser.json();

var composer = new Composer();

router.get('/commodities', jsonParser, function (req, res) {
    var value;
    res.setHeader('Content-Type', 'application/json');
    composer.getAllTraders()
    .then((table)=>{
        res.status(200).send(JSON.stringify({ "code": 200, "message": table }));
    }).catch((err)=>{
        res.status(400).send(JSON.stringify({ "code": 400, "message": err.toTring() }));
    });
});

router.get('/traders', jsonParser, function (req, res) {
    var value;
    res.setHeader('Content-Type', 'application/json');
    composer.getAllTraders()
    .then((table)=>{
        res.status(200).send(JSON.stringify({ "code": 200, "message": table }));
    }).catch((err)=>{
        res.status(400).send(JSON.stringify({ "code": 400, "message": err.toTring() }));
    });
});

router.get('/trader/:tradeid', jsonParser, function (req, res) {
    let tradeid=req.params.tradeid;
    res.setHeader('Content-Type', 'application/json');
    if(!tradeid){
        res.status(404).send(JSON.stringify({"code":404,"message":"Trader Id not found"}));
    }else{
        composer.getTrader(tradeid)
        .then((trader)=>{
            if(trader == null){
                res.status(404).send(JSON.stringify({ "code": 404, "message": "Trader with tradeid= "+tradeid+"not found" }));
            }else{
                res.status(200).send(JSON.stringify({ "code": 200, "message": trader }));
            }
        }).catch((err)=>{
            res.status(400).send(JSON.stringify({ "code": 400, "message": err.toTring() }));
        });
    }
});

router.get('/commodity/:tradingSymbol', jsonParser, function (req, res) {
    let tradingSymbol=req.params.tradingSymbol;
    res.setHeader('Content-Type', 'application/json');
    if(!tradingSymbol){
        res.status(404).send(JSON.stringify({"code":404,"message":"TradingSymbol not found"}));
    }else{
        composer.getCommodityBySymbol(tradingSymbol)
        .then((commodity)=>{
            if(commodity == null){
                res.status(404).send(JSON.stringify({ "code": 404, "message": "Commodity with tradingSymbol= "+tradingSymbol+"not found" }));
            }else{
                res.status(200).send(JSON.stringify({ "code": 200, "message": commodity }));
            }
        }).catch((err)=>{
            res.status(400).send(JSON.stringify({ "code": 400, "message": err.toTring() }));
        });
    }
});

router.get('/commodityTrader/:tradeid', jsonParser, function (req, res) {
    let tradeid=req.params.tradeid;
    res.setHeader('Content-Type', 'application/json');
    if(!tradeid){
        res.status(404).send(JSON.stringify({"code":404,"message":"TradingSymbol not found"}));
    }else{
        composer.getCommoditiesByTrader(tradeid)
        .then((commodities)=>{
            if(commodities == null){
                res.status(404).send(JSON.stringify({ "code": 404, "message": "Commodity with tradeid= "+tradeid+"not found" }));
            }else{
                res.status(200).send(JSON.stringify({ "code": 200, "message": commodities }));
            }
        }).catch((err)=>{
            res.status(400).send(JSON.stringify({ "code": 400, "message": err.toTring() }));
        });
    }
});

router.get('/trader/create/', jsonParser, function (req, res) {
    let tradeid=req.body.tradeid;
    let firstName=req.body.firstName;
    let lastName=req.body.lastName;

    res.setHeader('Content-Type', 'application/json');
    if(tradeid ==null || tradeid ===''){
        res.status(400).send(JSON.stringify({"code":40,"message":"TradeId null"}));
    }else  if(firstName == null || firstName !==''){
        res.status(400).send(JSON.stringify({"code":400,"message":"FirstName null"}));
    }
    else  if(lastName == null || lastName !==''){
        res.status(400).send(JSON.stringify({"code":400,"message":"LastName null"}));
    }else{
        composer.createTrader(tradeid,firstName,lastName)
        .catch((err)=>{
            res.status(400).send(JSON.stringify({ "code": 400, "message": err.toTring() }));
            return;
        });

        res.status(200).send(JSON.stringify({ "code": 200, "message": "create trader successfullly" }));
    }
});

router.get('/commodity/create/', jsonParser, function (req, res) {
    let tradingSymbol=req.body.tradingSymbol;
    let tradeid=req.body.tradeid;
    let quantity=req.body.quantity;
    let mainExchange=req.body.mainExchange;
    let description=req.body.description;

    res.setHeader('Content-Type', 'application/json');
    if(tradeid ==null || tradeid ===''){
        res.status(400).send(JSON.stringify({"code":40,"message":"TradeId null"}));
    }else  if(tradingSymbol == null || tradingSymbol !==''){
        res.status(400).send(JSON.stringify({"code":400,"message":"TradingSymbol null"}));
    }else  if(mainExchange == null || mainExchange !==''){
        res.status(400).send(JSON.stringify({"code":400,"message":"MainExchange null"}));
    }else  if(quantity ==null || Number(quantity) !== quantity){
        res.status(400).send(JSON.stringify({"code":400,"message":"Quatity null or not a double value"}));
    }else{
        composer.createCommodity(tradingSymbol,description,mainExchange,quantity,tradeid)
        .catch((err)=>{
            res.status(400).send(JSON.stringify({ "code": 400, "message": err.toTring() }));
            return;
        });

        res.status(200).send(JSON.stringify({ "code": 200, "message": "create commodity successfullly" }));
    }
});
module.exports = router;