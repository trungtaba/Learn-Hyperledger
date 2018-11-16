package main

import (
	"fmt"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

var logger = shim.NewLogger("main")
var member = Member{}
var offer = Offer{}
var vehicle = Vehicle{}
var vehicleListing = VehicleListing{}
var bcFunctions = map[string]func(shim.ChaincodeStubInterface, []string) pb.Response{
	// Member
	"member_create": member.createMember,
	"member_query":  member.queryMember,
	"member_update": member.updateMember,
	// Offer
	"offer_create": offer.createOffer,
	"offer_query":  offer.queryOffer,
	// Vehicle
	"vehicle_create":    vehicle.createVehicle,
	"vehicle_queryById": vehicle.queryVehicleByID,
	"vehicle_update":    vehicle.updateVehicle,
	"bidding_close":     vehicleListing.closeBidding,
}

//SmartContract Define the Smart Contract structure
type SmartContract struct {
}

//Init
func (t *SmartContract) Init(stub shim.ChaincodeStubInterface) pb.Response {
	return shim.Success(nil)
}

//Invoke
func (t *SmartContract) Invoke(stub shim.ChaincodeStubInterface) pb.Response {
	function, args := stub.GetFunctionAndParameters()

	if function == "init" {
		return t.Init(stub)
	}
	bcFunc := bcFunctions[function]
	if bcFunc == nil {
		return shim.Error("Invalid invoke function.")
	}
	return bcFunc(stub, args)
}

func main() {
	logger.SetLevel(shim.LogInfo)

	err := shim.Start(new(SmartContract))
	if err != nil {
		fmt.Printf("Error starting Simple chaincode: %s", err)
	}
}
