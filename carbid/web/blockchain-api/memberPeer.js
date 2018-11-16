'use strict';

import config from './config';
import { wrapError } from './utils';
import { memberClient as client } from './setup';

export async function createMember(member){
    try{
        const successResult=await invoke('member_create', member);
        if(successResult){
            return {
                status:"ERROR",
                message: successResult.toString()
            }
        }
        return {
            status:"SUCCESS",
            message: "Create new member successfully"
        }
    }catch(e){
        throw wrapError(`Error creating member: ${e.message}`, e);
    }
}

export async function queryMember(id){
    try{
        const member=await query('member_query', {id});
        return member;
    }catch(e){
        throw wrapError(`Error getting member info: ${e.message}`, e);
    }
}

export async function updateMember(member){
    try{
        const successResult=await invoke('member_update', member);
        if(successResult){
            return {
                status:"ERROR",
                message: successResult.toString()
            }
        }
        return {
            status:"SUCCESS",
            message: "Update member successfully"
        }
    }catch(e){
        throw wrapError(`Error updating member: ${e.message}`, e);
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