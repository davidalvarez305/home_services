package database

import (
	"fmt"
	"os"

	"github.com/davidalvarez305/home_services/server/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
	"gorm.io/gorm/schema"
)

var DB gorm.DB

type connection struct {
	Host     string
	Port     string
	User     string
	Password string
	DB       string
}

func Connect() (*gorm.DB, error) {
	conn := connection{
		Host:     os.Getenv("POSTGRES_HOST"),
		Port:     os.Getenv("POSTGRES_PORT"),
		User:     os.Getenv("POSTGRES_USER"),
		Password: os.Getenv("POSTGRES_PASSWORD"),
		DB:       os.Getenv("POSTGRES_DB"),
	}

	db, err := gorm.Open(postgres.Open(connToString(conn)), &gorm.Config{
		NamingStrategy: schema.NamingStrategy{
			SingularTable: true,
		},
		FullSaveAssociations: true,
		Logger:               logger.Default.LogMode(logger.Info),
	})

	if err != nil {
		return db, err
	}

	fmt.Printf("Connected to Database.\n")

	db.AutoMigrate(
		&models.AccountStatus{},
		&models.City{},
		&models.CompanyServicesLocations{},
		&models.Company{},
		&models.County{},
		&models.CompanyToken{},
		&models.Invoice{},
		&models.LeadLog{},
		&models.LeadMarketing{},
		&models.Lead{},
		&models.PaymentStatus{},
		&models.Role{},
		&models.Service{},
		&models.State{},
		&models.Token{},
		&models.User{},
		&models.ZipCode{},
		&models.Country{},
		&models.Address{},
	)

	DB = *db

	return db, nil
}

func connToString(info connection) string {
	return fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		info.Host, info.Port, info.User, info.Password, info.DB)
}
