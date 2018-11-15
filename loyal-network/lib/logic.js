'use strict';
/**
 * A member can receive points for different activities
 * @param {org.loyal.FcoinReceive} fcoinReceive
 * @transaction
 * A member can only receive points if they are currently active
 * A member can receive points for activities such as using the treadmill, playing raquetball, swimming, or attending a class
 */
async function fcoinReceive(fcoinReceive) {
    var member= fcoinReceive.member;
    var quanlity=fcoinReceive.fcoinQuanlity;

    //Check if member's stauts is active
    if(member.memberStatus =='DEACTIVE'){
        console.log('Member '+member.personId+'is deactive');
        throw new Error('Member is inactive');
    }else{
        member.fcoinWallet.fcoinBalance+=quanlity;
        console.log('Member '+member.personId+'is active');
    }

    console.log('Member '+member.personId+' now have balance '+member.fcoinWallet.fcoinBalance);
    let assetRegistry = await getAssetRegistry('org.loyal.FcoinWallet');
    return await assetRegistry.update(member.fcoinWallet);
}

/**
 * A member can redeem Fitcoins for merchandise or services
 * @param {org.loyal.FcoinRedeem} fcoinRedeem
 * @transaction
 * A member can only redeem Fitcoins if they have sufficient balance in their account and they are active
 */
async function fcoinRedeem(fcoinRedeem) {
    var member= fcoinRedeem.member;
    var fStore=fcoinRedeem.fStore;
    var fcoinQuanlity=fcoinRedeem.fcoinQuanlity;
    var memberCoinBalance = member.fcoinWallet.fcoinBalance;

    //Check if member's stauts is active
    if(member.memberStatus =='DEACTIVE'){
        console.log('Member '+member.personId+'is deactive');
        throw new Error('Member is inactive');
    }else{
        console.log('Member '+member.personId+'is active');
        if(memberCoinBalance>=fcoinQuanlity){
            console.log('Member has sufficient points');
            member.fcoinWallet.fcoinBalance-=fcoinQuanlity;
            fStore.fcoinWallet.fcoinBalance+=fcoinQuanlity;

            console.log('Member '+member.personId+' now have balance '+member.fcoinWallet.fcoinBalance);
            let assetRegistry = await getAssetRegistry('org.loyal.FcoinWallet');
            await assetRegistry.update(member.fcoinWallet);
            return await assetRegistry.update(fStore.fcoinWallet);
        }else{
            console.log('Member has insufficient points');
            throw new Error('Member has insufficient Fitcoins');
        }  
    }
}

/**
 * Add a new member
 * @param {org.loyal.AddMember} addMember -- the member being added
 * @transaction
 *  A member is added to the registry and seeded with 100 Fcoins and their status is set to Active
 */
async function addMember(addMember) {
    let fCoinWalletRegistry = await getAssetRegistry('org.loyal.FcoinWallet');
    var factory = getFactory();
    var newFcoinWallet = factory.newResource('org.loyal','FcoinWallet',addMember.memberId);
    newFcoinWallet.fcoinBalance = 100;
    await fCoinWalletRegistry.add(newFcoinWallet);

    let memberRegistry = await getParticipantRegistry('org.loyal.Member');
    var newMember = factory.newResource('org.loyal', 'Member', addMember.memberId);
    newMember.personFirstName = addMember.memberFirstName;
    newMember.personLastName = addMember.memberLastName;
    newMember.memberStatus='ACTIVE';
    newMember.fStore = factory.newRelationship('org.loyal','FStore', addMember.fStore);
    newMember.fcoinWallet = factory.newRelationship('org.loyal','FcoinWallet',addMember.memberId);
    await memberRegistry.add(newMember);
}

/**
 * Add a new fstore
 * @param {org.loyal.AddFStore} addFStore -- the fstore being added
 * @transaction
 *  A fstore is added to the registry 
 */
async function addFStore(addFStore) {
    let fCoinWalletRegistry = await getAssetRegistry('org.loyal.FcoinWallet');
    var factory = getFactory();
    var newFcoinWallet = factory.newResource('org.loyal','FcoinWallet',addFStore.fStoreId);
    newFcoinWallet.fcoinBalance = 0;
    await fCoinWalletRegistry.add(newFcoinWallet);

    let fStoreRegistry = await getParticipantRegistry('org.loyal.FStore');
    var newFStore = factory.newResource('org.loyal', 'FStore', addFStore.fStoreId);
    newFStore.fStoreName = addFStore.fStoreName;
    newFStore.fcoinWallet = factory.newRelationship('org.loyal','FcoinWallet',addFStore.fStoreId);
    await fStoreRegistry.add(newFStore);
}

/**
 * @param {org.loyal.InactiveMember} inactiveMember
 * @transaction
 * A member can only change to inactive if they are currently active
 */
async function inactiveMember(inactiveMember) {
    var member= inactiveMember.member;

    //Check if member's stauts is active
    if(member.memberStatus =='DEACTIVE'){
        console.log('Member '+member.personId+'is deactive actually');
        throw new Error('Member is inactive');
    }else{
        member.memberStatus='INACTIVE';
    }

    console.log('Member '+member.personId+' now change to inactive');
    let assetRegistry = await getParticipantRegistry('org.loyal.Member');
    return await assetRegistry.update(member);
}