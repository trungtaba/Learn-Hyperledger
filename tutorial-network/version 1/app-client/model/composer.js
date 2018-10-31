'use strict';

const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const winston = require('winston');

const logger = winston.loggers.get('composer');

// these are the credentials to use to connect to the Hyperledger Fabric
let cardName = 'admin@tutorial-network';
let namespace= 'org.example.mynetwork';

class Composer {
    constructor() {
        this.init()
            .catch((err) => {
                logger.error(err.toString());
            });
    }

    async init() {
        try {
            this.bizNetworkConnection = new BusinessNetworkConnection();
            this.businessNetworkDefinition = await this.bizNetworkConnection.connect(cardName);
            this.traderRegistry = await this.bizNetworkConnection.getParticipantRegistry('org.example.mynetwork.Trader');
            this.commodityRegistry = await this.bizNetworkConnection.getAssetRegistry('org.example.mynetwork.Commodity');
            this.factory = this.businessNetworkDefinition.getFactory();
        } catch (err) {
            console.log(err.toString());
        }

        //await this.createDataSample();
    }

    async createDataSample() {
        let trader1 = this.factory.newResource(namespace, 'Trader', 'tradeId:TRADER1');
        trader1.firstName = 'trader';
        trader1.lastName = 'one';

        let trader2 = this.factory.newResource(namespace, 'Trader', 'tradeId:TRADER2');
        trader2.firstName = 'trader';
        trader2.lastName = 'two';


        let commodity1 = this.factory.newResource(namespace, 'Commodity', 'tradingSymbol:AG');
        commodity1.description = 'silver';
        commodity1.mainExchange = 'CBOT';
        commodity1.quantity = 60;

        let commodity2 = this.factory.newResource(namespace, 'Commodity', 'tradingSymbol:CC');
        commodity2.description = 'Cocoa';
        commodity2.mainExchange = 'ICE';
        commodity2.quantity = 80;

        let traderRelation = this.factory.newRelationship(namespace, 'Trader', 'tradeId:TRADER1');
        commodity1.owner = traderRelation;

        traderRelation = this.factory.newRelationship(namespace, 'Trader', 'tradeId:TRADER2');
        commodity2.owner = traderRelation;

        await this.commodityRegistry.addAll([commodity1, commodity2]);
        await this.traderRegistry.addAll([trader1, trader2]);
    }


    async createTrader(tradeid, firstName, lastName) {
        var newTrader = this.factory.newResource(namespace, 'Trader', 'tradeId:' + tradeid);
        newTrader.firstName = firstName;
        newTrader.lastName = lastName;

        await this.traderRegistry.add(newTrader);
    }

    async createCommodity(tradingSymbol, description, mainExchange, quantity, tradeid) {
        try {
            var newCommodity = this.factory.newResource(namespace, 'Commodity', 'tradingSymbol:' + tradingSymbol);
            newCommodity.description = description;
            newCommodity.mainExchange = mainExchange;
            newCommodity.quantity = quantity;

            let traderRelation = this.factory.newRelationship(namespace, 'Trader', 'tradeId:' + tradeid);
            newCommodity.owner = traderRelation;

            await this.commodityRegistry.add(newCommodity);
            return true;
        } catch (err) {
            console.log('ERROR');
            console.log(err.toString());
            return false;
        }
    }

    async getAllCommodities() {
        try {
            let commodities = await this.commodityRegistry.resolveAll();
            let arrayLength = commodities.length;
            var commoditiesResult = [];
            for (let i = 0; i < arrayLength; i++) {
                commoditiesResult.push({
                    TradingSymbol: commodities[i].tradingSymbol, tradeId: commodities[i].owner.tradeId,
                    firstName: commodities[i].owner.firstName, lastName: commodities[i].owner.lastName, description: commodities[i].description,
                    mainExchange: commodities[i].mainExchange, quantity: commodities[i].quantity
                });
            }

            return commoditiesResult;
        } catch (err) {
            console.log(err.toString());
            return null;
        }
    }

    async getAllTraders() {
        try {
            let traders = await this.traderRegistry.getAll();
            var tradersResult = [];
            let arrayLength = traders.length;

            for (let i = 0; i < arrayLength; i++) {
                tradersResult.push({ tradeId: traders[i].tradeId, firstName: traders[i].firstName, lastName: traders[i].lastName });
            }

            return tradersResult;
        } catch (err) {
            console.log(err.toString());
            return null;
        }

    }

    async getTrader(tradeid) {
        try {
            let trader = await this.traderRegistry.get('tradeId:' + tradeid);
            if (trader == null) {
                return null;
            }
            return {
                tradeId: trader.tradeId,
                firstName: trader.firstName,
                lastName: trader.lastName
            }
        } catch (err) {
            console.log(err.toString());
            return null;
        }

    }

    async getCommodityBySymbol(tradingSymbol) {
        try {
            let commodity = await this.commodityRegistry.resolve('tradingSymbol:' + tradingSymbol);
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
        } catch (err) {
            console.log(err.toString());
            return null;
        }

    }

    async getCommoditiesByTrader(tradeId) {
        try {
            let commodities = await this.commodityRegistry.resolveAll();
            console.log('query tradeid=' + tradeId);
            let arrayLength = commodities.length;
            var commoditiesResult = [];
            for (let i = 0; i < arrayLength; i++) {
                console.log(commodities[i].owner.tradeId);

                if (commodities[i].owner.tradeId.split(':')[1] === tradeId) {
                    commoditiesResult.push({
                        TradingSymbol: commodities[i].tradingSymbol, tradeId: commodities[i].owner.tradeId,
                        firstName: commodities[i].owner.firstName, lastName: commodities[i].owner.lastName, description: commodities[i].description,
                        mainExchange: commodities[i].mainExchange, quantity: commodities[i].quantity
                    });
                    console.log('push commodity ' + commodities[i].tradingSymbol);
                }
            }
            return commoditiesResult;
        } catch (err) {
            console.log(err.toString());
            return null;
        }

    }

    async createTrade(tradeId, tradingSymbol) {
        try {
            var commodity = await this.getCommodityBySymbol(tradingSymbol);
            if (commodity != null) {
                if (commodity.tradeId === tradeId) {
                    logger.error('Commodity owner and new trader are the same');
                    return false;
                } else {
                    var trader = await this.getTrader(tradeId);
                    if (trader != null) {
                        let transaction = this.factory.newTransaction(namespace, 'Trade');
                        transaction.commodity = this.factory.newRelationship(namespace, 'Commodity', 'tradingSymbol:' + tradingSymbol);
                        transaction.newOwner = this.factory.newRelationship(namespace, 'Trader', 'tradeId:' + tradeId);
                        await this.bizNetworkConnection.submitTransaction(transaction);
                        return true;
                    } else {
                        logger.error('Trader not found');
                        return false;
                    }
                }
            } else {
                logger.error('Commodity not found');
                return false;
            }
        } catch (err) {
            console.log(err.toString());
            return false;
        }
    }
}

module.exports = Composer;