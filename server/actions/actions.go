package actions

import (
	"errors"
	"fmt"
	"os"
	"strconv"

	"github.com/davidalvarez305/home_services/server/database"
	"github.com/davidalvarez305/home_services/server/sessions"
	"github.com/davidalvarez305/home_services/server/types"
	"github.com/davidalvarez305/home_services/server/utils"
	"github.com/gofiber/fiber/v2"
)

// Grabs the current user's ID from the session store ('database = fiber')
func GetUserIdFromSession(c *fiber.Ctx) (int, error) {
	var userId int
	sess, err := sessions.Sessions.Get(c)

	if err != nil {
		return userId, err
	}

	uId := sess.Get("userId")

	if uId == nil {
		return userId, errors.New("user not found")
	}

	user := fmt.Sprintf("%v", uId)

	userId, err = strconv.Atoi(user)

	if err != nil {
		return userId, err
	}

	return userId, nil
}

// Invite user to company
func InviteUserToCompany(companyId int, email string) error {

	// Generate a company token
	companyToken := &CompanyToken{}
	companyToken.GenerateCompanyToken(companyId, email)

	// Send e-mail to the user
	clientUrl := os.Getenv("CLIENT_URL")
	msg := fmt.Sprintf("Click this link to accept your invite, and create your account: %s", clientUrl+"/invite/"+companyToken.UUID)
	title := "You have been invited to join Home Services."

	return utils.SendGmail(msg, email, title)

}

// Get all users that belong to a company
func GetUsersByCompany(companyId string) ([]*types.UsersByCompany, error) {
	var usersByCompany []*types.UsersByCompany

	sql := fmt.Sprintf(`
	SELECT ucr.company_id, ucr.user_id, ucr.role_id, u.username, u.email
	FROM user_company_role AS ucr
	JOIN "user" AS u
	ON ucr.user_id = u.id
	WHERE u.id = %s;`, companyId)

	stmt := database.DB.Exec(sql).Scan(&usersByCompany).Error

	if stmt != nil {
		return usersByCompany, stmt
	}

	return usersByCompany, nil
}
