'use strict';

const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const winston = require('winston');

const logger = winston.loggers.get('composer');

// these are the credentials to use to connect to the Hyperledger Fabric
let cardname = 'admin@tutorial-network';

class Composer {
    constructor() {
        await this.init();
    }

    async init() {
        try {
            this.bizNetworkConnection = new BusinessNetworkConnection();
            this.businessNetworkDefinition = await this.bizNetworkConnection.connect(cardName);
            this.traderRegistry = await this.bizNetworkConnection.getParticipantRegistry('org.example.mynetwork.Trader');
            this.commodityRegistry = await this.bizNetworkConnection.getAssetRegistry('org.example.mynetwork.Commodity');
            this.factory = this.businessNetworkDefinition.getFactory();
        } catch (err) {
            logger.error('Error: %s', err.toString());
        }

        this.createDataSample();

    }

    async createDataSample() {
        let trader1 = this.factory.newResource('org.example.mynetwork', 'Trader', 'tradeId:TRADER1');
        trader1.firstName = 'trader';
        trader1.lastName = 'one';

        let trader2 = this.factory.newResource('org.example.mynetwork', 'Trader', 'tradeId:TRADER2');
        trader3.firstName = 'trader';
        trader2.lastName = 'two';


        let commodity1 = this.factory.newResource('org.example.mynetwork', 'Commodity', 'tradingSymbol:AG');
        commodity1.description = 'silver';
        commodity1.mainExchange = 'CBOT';
        commodity1.quantity = '60';

        let commodity2 = this.factory.newResource('org.example.mynetwork', 'Commodity', 'tradingSymbol:CC');
        commodity2.description = 'Cocoa';
        commodity2.mainExchange = 'ICE';
        commodity2.quantity = '60';

        let traderRelation = this.factory.newRelationship('org.example.mynetwork', 'Trader', 'tradeId:TRADER1');
        commodity1.owner = traderRelation;

        let traderRelation = this.factory.newRelationship('org.example.mynetwork', 'Trader', 'tradeId:TRADER2');
        commodity2.owner = traderRelation;

        await this.commodityRegistry.addAll([commodity1, commodity2]);
        await this.traderRegistry.addAll([trader1, trader2]);
    }


    async createTrader(tradeid, firstName, lastName) {
        var newTrader = this.factory.newResource('org.example.mynetwork', 'Trader', 'tradeId:' + tradeid);
        newTrader.firstName = firstName;
        newTrader.lastName = lastName;

        await this.traderRegistry.add(newTrader);
    }

    async createCommodity(tradingSymbol, description, mainExchange, quantity, tradeid) {
        var newCommodity = this.factory.newResource('org.example.mynetwork', 'Commodity', 'tradingSymbol:' + tradingSymbol);
        newCommodity.description = description;
        newCommodity.mainExchange = mainExchange;
        newCommodity.quantity = quantity;

        let traderRelation = this.factory.newRelationship('org.example.mynetwork', 'Trader', 'tradeid:' + tradeid);
        newCommodity.owner = traderRelation;

        await this.traderRegistry.add(newCommodity);
    }

    async getAllCommodities() {
        let commodities = await this.commodityRegistry.resolveAll();
        let table = new Table({
            head: ['TradingSymbol', 'Tradeid', 'Trader FirstName', 'Trader LastName', 'Description', 'MainExchange', 'Quantity']
        });
        let arrayLength = commodities.length;

        for (let i = 0; i < arrayLength; i++) {

            let tableLine = [];
            tableLine.push(commodities[i].tradingSymbol);
            tableLine.push(commodities[i].owner.tradeId);
            tableLine.push(commodities[i].owner.firstName);
            tableLine.push(commodities[i].owner.lastName);
            tableLine.push(commodities[i].description);
            tableLine.push(commodities[i].mainExchange);
            tableLine.push(commodities[i].quantity);
            table.push(tableLine);
        }

        return table;
    }

    async getAllTraders() {
        let traders = await this.traderRegistry.getAll();
        let table = new Table({
            head: ['Tradeid', 'Trader FirstName', 'Trader LastName']
        });
        let arrayLength = traders.length;

        for (let i = 0; i < arrayLength; i++) {

            let tableLine = [];
            tableLine.push(traders[i].tradeId);
            tableLine.push(traders[i].firstName);
            tableLine.push(traders[i].lastName);
            table.push(tableLine);
        }

        return table;
    }

    async getTrader(tradeid) {
        let trader = await this.traderRegistry.get(tradeid);
        if (trader == null) {
            return null;
        }
        return {
            tradeId: trader.tradeId,
            firstName: trader.firstName,
            lastName: trader.lastName
        }
    }

    async getCommodityBySymbol(tradingSymbol) {
        let commodity = await this.commodityRegistry.resolve(tradingSymbol);
        if (commodity == null)
            return null;
        return {
            tradingSymbol: commodity.tradingSymbol,
            tradeId: commodity.owner.tradeId,
            firstName: commodity.owner.firstName,
            lastName: commodity.owner.lastName,
            description: commodity.description,
            mainExchange: commodity.mainExchange,
            quantity: commodity.quantity
        }
    }

    async getCommoditiesByTrader(tradeId) {
        let commodities = await this.commodityRegistry.resolveAll();
        let table = new Table({
            head: ['TradingSymbol', 'Description', 'MainExchange', 'Quantity']
        });
        let arrayLength = commodities.length;

        for (let i = 0; i < arrayLength; i++) {
            if (commodities[i].owner.tradeId === tradeId) {
                let tableLine = [];
                tableLine.push(commodities[i].tradingSymbol);
                tableLine.push(commodities[i].description);
                tableLine.push(commodities[i].mainExchange);
                tableLine.push(commodities[i].quantity);
                table.push(tableLine);
            }
        }

        return table;
    }

    async createTrade(tradeId, tradingSymbol) {
        var commodity = await this.getCommodityBySymbol(tradingSymbol);
        if (commodity != null) {
            if (commodity.tradeId === tradeId) {
                logger.error('Commodity owner and new trader are the same');
                return false;
            } else {
                var trader = await this.getTrader(tradeId);
                if (trader != null){
                    let transaction = this.factory.newTransaction('org.example.mynetwork', 'tradeCommodity');
                    transaction.title = this.factory.newRelationship('org.example.mynetwork', 'Commodity', 'tradingSymbol:' + tradingSymbol);
                    transaction.seller = this.factory.newRelationship('org.example.mynetwork', 'Trader', 'tradeId:' + tradeId);
                    await this.bizNetworkConnection.submitTransaction(transaction);
                    return true;
                }else{
                    logger.error('Trader not found');
                    return false;
                }
            }
        }else{
            logger.error('Commodity not found');
            return false;
        }
    }

}

module.exports= Composer;