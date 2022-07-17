export const DEV = process.env.NODE_ENV !== "production"

export const GA_TRACKING_ID = ""
export const FB_TRACKING_ID = ""
export const SENTRY_TRACKING_ID = ""

export const SITE_NAME = "Polyvolve Admin"
export const SITE_TITLE = "Polyvolve Admin"
export const SITE_DESCRIPTION = ""
export const SITE_IMAGE = ""

export const API_URL = "https://polyvolve-api.herokuapp.com"

export const REVIEW_URL = "http://localhost:3333"

// In days.
export const DEFAULT_DUE_DATE_ADDITION = 7

export const COLOR_TYPE_TEAM = "rgb(44, 167, 106)"
export const COLOR_TYPE_LEADER = "rgb(82, 138, 201)"
export const COLOR_TYPE_DEFAULT = "rgb(0, 81, 41)"
export const COLOR_TYPE_USER = "rgb(213, 154, 77)"
export const COLOR_TYPE_REVIEW_MASTER = "rgb(40, 40, 120)"

export const RECENTLY_VIEWED_AMOUNT = 6

export const NOTIFICATION_MESSAGE_REMOVE_DELAY = 5000

export const PRE_ALPHA_NOTIFICATION_TEXT = (
  <div>
    <p>
      This is a POC/SaaS template. This is not finished/polished by any margin!
      Bugs and inconsistencies are expected.
    </p>
    <p className="mb1">
      The onboarding is completely absent. Mail delivery is disabled due to
      security concerns (the actual review process cannot be tested).
    </p>
    <p>
      Also, creation and editing is unrestricted for testing purposes. Just a
      warning: that includes the possibility of vandalized content 🙄.
    </p>
  </div>
)
