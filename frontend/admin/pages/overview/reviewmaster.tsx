import * as React from "react"

import UI from "../../src/components/ui"
import ReviewMasterList from "../../src/components/reviewmaster/overview/ReviewMasterOverview"
import { DynamicAuth } from "../../src/components/auth/DynamicAuth"
import { Notification } from "polyvolve-ui/lib"
import { PRE_ALPHA_NOTIFICATION_TEXT } from "../../src/constants/env"
import RecentlyViewed from "../../src/components/ui/sidebar/RecentlyViewed"

const SidebarLeft: React.FunctionComponent<{}> = () => null

const SidebarRight: React.FunctionComponent<{}> = () => (
  <React.Fragment>
    <RecentlyViewed />
  </React.Fragment>
)

export default () => (
  <DynamicAuth>
    <UI
      showSidebarRight={true}
      sidebarRightComponent={<SidebarRight />}
      showSidebarLeft={true}
      sidebarLeftComponent={<SidebarLeft />}>
      <Notification type="warning">{PRE_ALPHA_NOTIFICATION_TEXT}</Notification>
      <ReviewMasterList />
    </UI>
  </DynamicAuth>
)
