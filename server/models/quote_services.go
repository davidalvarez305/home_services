package models

type QuoteServices struct {
	ID        int      `json:"id"`
	ServiceID int      `gorm:"column:service_id" json:"service_id"`
	Service   *Service `gorm:"not null;column:service_id;foreignKey:ServiceID;constraint:OnDelete:CASCADE,OnUpdate:CASCADE" json:"-"`
	QuoteID   int      `gorm:"column:quote_id" json:"quote_id"`
	Quote     *Quote   `gorm:"not null;column:quote_id;foreignKey:QuoteID;constraint:OnDelete:CASCADE,OnUpdate:CASCADE" json:"-"`
}
