package models

type City struct {
	ID      int    `json:"id"`
	Name    string `json:"name"`
	StateID int    `json:"state_id"`
	State   *State `gorm:"not null;column:state_id;foreignKey:StateID;constraint:OnDelete:CASCADE,OnUpdate:CASCADE" json:"-"`
	DMAID   int    `json:"dma_id"`
	DMA     *DMA   `gorm:"not null;column:dma_id;foreignKey:DMAID;constraint:OnDelete:CASCADE,OnUpdate:CASCADE" json:"-"`
}
