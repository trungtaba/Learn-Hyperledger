package main

import (
	"encoding/json"
	"sort"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	sc "github.com/hyperledger/fabric/protos/peer"
)

/*
	args[0]: id
*/
func (v *VehicleListing) closeBidding(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	vehicleListingAsBytes, _ := APIstub.GetState(args[0])
	vehicleListing := VehicleListing{}
	json.Unmarshal(vehicleListingAsBytes, &vehicleListing)
	if vehicleListing.ID == "" {
		return shim.Error("VehicleListing is not found.")
	}

	if vehicleListing.State != 0 {
		return shim.Error("Listing is not FOR SALE.")
	}

	vehicleListing.State = 1
	highestOffer := Offer{}
	seller := Member{}
	buyer := Member{}

	if len(vehicleListing.Offers) > 0 {
		sort.Slice(vehicleListing.Offers[:], func(i, j int) bool {
			return vehicleListing.Offers[i].BidPrice < vehicleListing.Offers[j].BidPrice
		})
		highestOffer = vehicleListing.Offers[0]
		if highestOffer.BidPrice >= vehicleListing.ReservePrice {
			vehicleListing.State = 2
			buyer = highestOffer.Member
			seller = vehicleListing.Vehicle.Owner
			// update the balance of the seller
			seller.Balance += highestOffer.BidPrice
			// update the balance of the buyer
			buyer.Balance -= highestOffer.BidPrice
			// update vehicle owner
			vehicleListing.Vehicle.Owner = buyer
			// clear offers
			vehicleListing.Offers = nil
		}
	}

	if highestOffer.Member != (Member{}) {
		//update buyer, seller and vehicleListing
		sellerAsBytes, _ := json.Marshal(seller)
		APIstub.PutState(seller.ID, sellerAsBytes)

		buyerAsBytes, _ := json.Marshal(buyer)
		APIstub.PutState(buyer.ID, buyerAsBytes)

		vehicleAsBytes, _ := json.Marshal(vehicleListing.Vehicle)
		APIstub.PutState(vehicleListing.Vehicle.ID, vehicleAsBytes)

		vehicleListingAsBytes, _ = json.Marshal(vehicleListing)
		APIstub.PutState(args[0], vehicleListingAsBytes)

		return shim.Success(nil)
	}
	return shim.Error("Could not close bid")
}
