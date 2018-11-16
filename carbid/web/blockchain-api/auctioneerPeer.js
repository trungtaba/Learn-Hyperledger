'use strict';

import config from './config';
import { wrapError } from './utils';
import { auctioneerClient as client } from './setup';

export async function createOffer(offer) {
  try {
    const successResult = await invoke('offer_create', offer);
    if (successResult) {
      return {
        status: "ERROR",
        message: successResult.toString()
      }
    }
    return {
      status: "SUCCESS",
      message: "Create new offer successfully"
    }
  } catch (e) {
    throw wrapError(`Error creating offer: ${e.message}`, e);
  }
}

export async function queryOffer(id) {
  try {
    const member = await query('offer_query', { id });
    return member;
  } catch (e) {
    throw wrapError(`Error getting offer info: ${e.message}`, e);
  }
}

export async function createVehicle(vehicle) {
  try {
    const successResult = await invoke('vehicle_create', vehicle);
    if (successResult) {
      return {
        status: "ERROR",
        message: successResult.toString()
      }
    }
    return {
      status: "SUCCESS",
      message: "Create new vehicle successfully"
    }
  } catch (e) {
    throw wrapError(`Error creating vehicle: ${e.message}`, e);
  }
}

export async function queryVehicleByID(id) {
  try {
    const member = await query('vehicle_queryById', { id });
    return member;
  } catch (e) {
    throw wrapError(`Error getting vehicle info: ${e.message}`, e);
  }
}

export async function updateVehicle(vehicle) {
  try {
    const successResult = await invoke('vehicle_update', vehicle);
    if (successResult) {
      return {
        status: "ERROR",
        message: successResult.toString()
      }
    }
    return {
      status: "SUCCESS",
      message: "Update vehicle successfully"
    }
  } catch (e) {
    throw wrapError(`Error updating vehicle: ${e.message}`, e);
  }
}

export async function closeBidding(vehicle) {
  try {
    const successResult = await invoke('bidding_close', vehicle);
    if (successResult) {
      return {
        status: "ERROR",
        message: successResult.toString()
      }
    }
    return {
      status: "SUCCESS",
      message: "Closing auction successfully"
    }
  } catch (e) {
    throw wrapError(`Error closing auction: ${e.message}`, e);
  }
}

function invoke(fcn, ...args) {
  return client.invoke(
    config.chaincodeId, config.chaincodeVersion, fcn, ...args);
}

function query(fcn, ...args) {
  return client.query(
    config.chaincodeId, config.chaincodeVersion, fcn, ...args);
}