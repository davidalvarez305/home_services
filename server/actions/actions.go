package actions

import (
	"errors"
	"fmt"
	"os"
	"strconv"

	"github.com/davidalvarez305/home_services/server/sessions"
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
