package main

import (
	"encoding/json"

	"github.com/hyperledger/fabric/core/chaincode/shim"

	sc "github.com/hyperledger/fabric/protos/peer"
)

func (v *Vehicle) createVehicle(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) != 3 {
		return shim.Error("Incorrect number of arguments. Expecting 3")
	}

	ownerAsBytes, _ := APIstub.GetState(args[2])
	member := Member{}

	json.Unmarshal(ownerAsBytes, &member)
	if member == (Member{}) {
		return shim.Error("Member is not found. You have to create member first")
	}

	var vehicle = Vehicle{ID: args[0], Vin: args[1], Owner: member}
	vehicleAsBytes, _ := json.Marshal(vehicle)
	APIstub.PutState(VehicleKey(args[0]), vehicleAsBytes)
	return shim.Success(nil)
}

/*
	args[0]: ID
*/
func (v *Vehicle) queryVehicleByID(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	vehicleAsBytes, _ := APIstub.GetState(args[0])
	return shim.Success(vehicleAsBytes)
}

/*
	args[0]: ID
	args[1]: vin
	args[2]: owner
*/
func (v *Vehicle) updateVehicle(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) != 3 {
		return shim.Error("Incorrect number of arguments. Expecting 3")
	}

	vehicleAsBytes, _ := APIstub.GetState(args[0])
	vehicle := Vehicle{}

	json.Unmarshal(vehicleAsBytes, &vehicle)

	if (Vehicle{}) == vehicle {
		return shim.Error("Vehicle not found")
	}

	ownerAsBytes, _ := APIstub.GetState(args[2])
	member := Member{}

	json.Unmarshal(ownerAsBytes, &member)
	if member == (Member{}) {
		return shim.Error("Member is not found.")
	}

	vehicle.Vin = args[1]
	vehicle.Owner = member

	vehicleAsBytes, _ = json.Marshal(vehicle)
	APIstub.PutState(args[0], vehicleAsBytes)

	return shim.Success(nil)
}
