package utils

import (
	"encoding/base64"
	"fmt"
	"log"
	"os"
	"os/user"
	"strconv"
	"strings"
	"time"

	"golang.org/x/crypto/bcrypt"
)

func GetIds(arr string) ([]int, error) {
	var ids []int
	idList := strings.Split(arr, ",")
	for _, i := range idList {
		j, err := strconv.Atoi(i)
		if err != nil {
			return ids, err
		}
		ids = append(ids, j)
	}
	return ids, nil
}

func GenerateAPIToken(str string) string {
	keys := str + fmt.Sprintf("%+v", time.Now().Unix())
	hash, err := bcrypt.GenerateFromPassword([]byte(keys), bcrypt.DefaultCost)
	if err != nil {
		log.Fatal(err)
	}
	return base64.StdEncoding.EncodeToString(hash)
}

func ResolveServerPath() (string, error) {
	var p string

	if os.Getenv("APP_ENV") == "production" {
		return ".", nil
	}

	u, err := user.Current()

	if err != nil {
		return p, err
	}

	p = u.HomeDir + os.Getenv("SERVER_PATH")

	return p, nil
}
