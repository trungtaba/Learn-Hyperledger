package main

import (
	"encoding/json"
	"strconv"

	"github.com/hyperledger/fabric/core/chaincode/shim"

	sc "github.com/hyperledger/fabric/protos/peer"
)

/*
	args[0]: key
	args[1]: email
	args[2]: first name
	agrs[3]: last name
	agrs[4]: balance
*/
func (v *Member) createMember(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) != 5 {
		return shim.Error("Incorrect number of arguments. Expecting 5")
	}

	memberAsBytes, _ := APIstub.GetState(args[0])
	member := Member{}

	json.Unmarshal(memberAsBytes, &member)
	if member != (Member{}) {
		return shim.Error("Member exist already.")
	}
	user := User{ID: args[0], Email: args[1], FirstName: args[2], LastName: args[3]}
	balance, _ := strconv.ParseFloat(args[4], 64)
	member = Member{user, balance}
	memberAsBytes, _ = json.Marshal(member)
	APIstub.PutState(VehicleKey(args[0]), memberAsBytes)
	return shim.Success(nil)
}

/*
	args[0]: key
*/
func (v *Member) queryMember(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	memberAsBytes, _ := APIstub.GetState(args[0])
	return shim.Success(memberAsBytes)
}

/*
	args[0]: key
	args[1]: email
	args[2]: first name
	agrs[3]: last name
	agrs[4]: balance
*/
func (v *Member) updateMember(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) != 5 {
		return shim.Error("Incorrect number of arguments. Expecting 5")
	}

	memberAsBytes, _ := APIstub.GetState(args[0])
	member := Member{}

	json.Unmarshal(memberAsBytes, &member)
	if member == (Member{}) {
		return shim.Error("Member is not found.")
	}

	member.Email = args[1]
	member.FirstName = args[2]
	member.LastName = args[3]
	balance, _ := strconv.ParseFloat(args[4], 64)
	member.Balance = balance

	memberAsBytes, _ = json.Marshal(member)
	APIstub.PutState(args[0], memberAsBytes)

	return shim.Success(nil)
}
