'use strict';

import config from './config';
import { wrapError } from './utils';
import { auctioneerClient as client } from './setup';



function invoke(fcn, ...args) {
    return client.invoke(
      config.chaincodeId, config.chaincodeVersion, fcn, ...args);
  }
  
  function query(fcn, ...args) {
    return client.query(
      config.chaincodeId, config.chaincodeVersion, fcn, ...args);
  }