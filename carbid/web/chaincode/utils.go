package main

//VehicleKey create vehicle key from data
func VehicleKey(vin string) string {
	return "VEHICLE-" + vin
}

//MemberKey create member key from data
func MemberKey(id string) string {
	return "MEMBER-" + id
}
