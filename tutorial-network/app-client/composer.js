'use strict';

const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const winston = require('winston');

const LOG = winston.loggers.get('composer');

// these are the credentials to use to connect to the Hyperledger Fabric
let cardname = 'admin@tutorial-network';

class Composer {
    constructor() {
        await this.init();
    }

    async init() {
        this.bizNetworkConnection = new BusinessNetworkConnection();
        this.businessNetworkDefinition = await this.bizNetworkConnection.connect(cardName);
        this.traderRegistry = await this.bizNetworkConnection.getParticipantRegistry('org.example.mynetwork.Trader');
        this.commodityRegistry = await this.bizNetworkConnection.getAssetRegistry('org.example.mynetwork.Commodity');
        this.factory = this.businessNetworkDefinition.getFactory();

        this.createDataSample();

    }

    async createDataSample(){
        let trader1 = this.factory.newResource('org.example.mynetwork', 'Trader', 'tradeid:TRADER1');
        trader1.firstName = 'trader';
        trader1.lastName = 'one';

        let trader2 = this.factory.newResource('org.example.mynetwork', 'Trader', 'tradeid:TRADER2');
        trader3.firstName = 'trader';
        trader2.lastName = 'two';


        let commodity1 = this.factory.newResource('org.example.mynetwork', 'Commodity', 'tradingSymbol:AG');
        commodity1.description = 'silver';
        commodity1.mainExchange = 'CBOT';
        commodity1.quantity='60';

        let commodity2 = this.factory.newResource('org.example.mynetwork', 'Commodity', 'tradingSymbol:CC');
        commodity2.description = 'Cocoa';
        commodity2.mainExchange = 'ICE';
        commodity2.quantity='60';

        let traderRelation = this.factory.newRelationship('org.example.mynetwork', 'Trader', 'tradeid:TRADER1');
        commodity1.owner=traderRelation;

        let traderRelation = this.factory.newRelationship('org.example.mynetwork', 'Trader', 'tradeid:TRADER2');
        commodity2.owner=traderRelation;

        await this.commodityRegistry.addAll([commodity1,commodity2]);
        await this.traderRegistry.addAll([trader1,trader2]);
    }


    async createNewTrader(tradeid, firstName, lastName) {
        var newTrader = this.factory.newResource('org.example.mynetwork', 'Trader', 'tradeId:'+tradeid);
        newTrader.firstName=firstName;
        newTrader.lastName=lastName;

        await this.traderRegistry.add(newTrader);
    }

    async createNewCommodity(tradingSymbol, description, mainExchange,quantity, tradeid) {
        var newCommodity = this.factory.newResource('org.example.mynetwork', 'Commodity', 'tradingSymbol:'+tradingSymbol);
        newCommodity.description=description;
        newCommodity.mainExchange=mainExchange;
        newCommodity.quantity=quantity;

        let traderRelation = this.factory.newRelationship('org.example.mynetwork', 'Trader', 'tradeid:'+tradeid);
        newCommodity.owner=traderRelation;

        await this.traderRegistry.add(newCommodity);
    }

    async getAllTrader(){
        let commodities=await this.commodityRegistry.resolveAll();
        let table = new Table({
            head: ['TradingSymbol', 'Tradeid', 'Trader FirstName','Trader LastName', 'Description', 'MainExchange', 'Quantity']
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
}

