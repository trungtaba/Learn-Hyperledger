package main

import (
	"encoding/json"
	"strconv"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	sc "github.com/hyperledger/fabric/protos/peer"
)

/*
	args[0]: id
	args[1]: bid price
	args[2]: listing
	args[3]: member
*/
func (o *Offer) createOffer(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) != 4 {
		return shim.Error("Incorrect number of arguments. Expecting 4")
	}

	vehicleListingAsBytes, _ := APIstub.GetState(args[2])
	vehicleListing := VehicleListing{}
	json.Unmarshal(vehicleListingAsBytes, &vehicleListing)
	if vehicleListing.ID == "" {
		return shim.Error("VehicleListing is not found.")
	}

	if vehicleListing.State != 0 {
		return shim.Error("Listing is not FOR SALE.")
	}

	memberAsBytes, _ := APIstub.GetState(args[3])
	member := Member{}
	json.Unmarshal(memberAsBytes, &member)
	if member == (Member{}) {
		return shim.Error("Member is not found.")
	}

	bidPrice, _ := strconv.ParseFloat(args[1], 64)
	offer := Offer{ID: args[0], BidPrice: bidPrice, Listing: vehicleListing, Member: member}

	vehicleListing.Offers = append(vehicleListing.Offers, offer)

	vehicleListingAsBytes, _ = json.Marshal(vehicleListing)
	APIstub.PutState(args[2], vehicleListingAsBytes)

	offerAsBytes, _ := json.Marshal(offer)
	APIstub.PutState(args[0], offerAsBytes)
	return shim.Success(nil)
}

/*
	args[0]: key
*/
func (o *Offer) queryOffer(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}
	offerAsBytes, _ := APIstub.GetState(args[0])
	return shim.Success(offerAsBytes)
}
