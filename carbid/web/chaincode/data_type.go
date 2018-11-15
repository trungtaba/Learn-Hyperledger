package main

import (
	"encoding/json"
	"strings"
)

//ListingState declare list of state
type ListingState int

const (
	ForSale       ListingState = 0
	ReserveNotMet ListingState = 1
	Sold          ListingState = 2
)

//Vehicle declare Vehicle
type Vehicle struct {
	ID    string `json:"id"`
	Vin   string `json:"vin"`
	Owner Member `json:"member"`
}

//User declare User
type User struct {
	ID        string `json:"id"`
	Email     string `json:"email"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
}

//Member declare Member
type Member struct {
	User
	Balance float64 `json:"balance"`
}

//Offer declare Offer
type Offer struct {
	ID       string         `json:"id"`
	BidPrice float64        `json:"bid_price"`
	Listing  VehicleListing `json:"vihicle_listing"`
	Member   Member         `json:"member"`
}

//VehicleListing declare VehicleListing
type VehicleListing struct {
	ID           string       `json:"listing_id"`
	ReservePrice float64      `json:"reserve_price"`
	Description  string       `json:"description"`
	State        ListingState `json:"state"`
	Offers       []Offer      `json:"offers"`
	Vehicle      Vehicle      `json:"vihicle"`
}

//Auctioneer declare Auctioneer
type Auctioneer struct {
	User
}

//UnmarshalJSON used for Unmarshal JSON
func (l *ListingState) UnmarshalJSON(b []byte) error {
	var value string
	if err := json.Unmarshal(b, &value); err != nil {
		return err
	}

	switch strings.ToUpper(value) {
	default:
		*l = ForSale
	case "R":
		*l = ReserveNotMet
	case "S":
		*l = Sold
	}

	return nil
}

//MarshalJSON used for Marshal JSON
func (l ListingState) MarshalJSON() ([]byte, error) {
	var value string

	switch l {
	default:
		fallthrough
	case ForSale:
		value = "F"
	case ReserveNotMet:
		value = "R"
	case Sold:
		value = "S"
	}

	return json.Marshal(value)
}
