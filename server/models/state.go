package models

type State struct {
	ID           int    `json:"id"`
	State        string `json:"state"`
	Abbreviation string `json:"abbreviation"`
}
