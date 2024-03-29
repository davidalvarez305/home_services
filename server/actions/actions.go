package actions

import (
	"errors"
	"fmt"
	"os"
	"strconv"
	"strings"

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

// Grabs the current user's CompanyID from the session store ('database = fiber')
func GetCompanyIdFromSession(c *fiber.Ctx) (int, error) {
	var companyId int
	sess, err := sessions.Sessions.Get(c)

	if err != nil {
		return companyId, err
	}

	cId := sess.Get("companyId")

	if cId == nil {
		return companyId, errors.New("company not found")
	}

	company := fmt.Sprintf("%v", cId)

	companyId, err = strconv.Atoi(company)

	if err != nil {
		return companyId, err
	}

	return companyId, nil
}

// Invite user to company
func InviteUserToCompany(companyId int, email string) error {
	// If the user exists, they will be taken to a page to accept the invitation.
	// Otherwise, they will be taken to a page to register.
	clientDestination := "accept-invite"

	user, err := GetUserByEmail(email)

	if err != nil {
		if strings.Contains(err.Error(), "record not found") {
			clientDestination = "invite"
		} else {
			return err
		}
	}

	// Assert that invitee doesn't own another company
	if user.RoleID != 1 {
		return errors.New("cannot invite users that own other companies")
	}

	// Generate a company token
	companyToken, err := GenerateCompanyToken(companyId, email)

	if err != nil {
		return err
	}

	// Send e-mail to the user
	clientUrl := os.Getenv("CLIENT_URL")
	url := fmt.Sprintf(`%s/%s/%s?companyId=%v&companyName=%s`, clientUrl, clientDestination, companyToken.UUID, companyToken.CompanyID, companyToken.Company.Name)
	msg := fmt.Sprintf("Click this link to accept your invite, and create your account: %s", url)
	title := fmt.Sprintf("You have been invited to join %s.", companyToken.Company.Name)

	return utils.SendGmail(msg, email, title)

}
