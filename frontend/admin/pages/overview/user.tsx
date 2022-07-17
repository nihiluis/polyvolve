import * as React from "react"
import UI from "../../src/components/ui"
import UserOverview from "../../src/components/user/overview/UserOverview"

import { DynamicAuth } from "../../src/components/auth/DynamicAuth"
import { Notification } from "polyvolve-ui/lib"
import { PRE_ALPHA_NOTIFICATION_TEXT } from "../../src/constants/env"
import RecentlyViewed from "../../src/components/ui/sidebar/RecentlyViewed"
import { DataLoader } from "../../src/components/utils"

const SidebarLeft: React.FunctionComponent<{}> = () => null

const SidebarRight: React.FunctionComponent<{}> = () => (
  <React.Fragment>
    <RecentlyViewed />
  </React.Fragment>
)

export default () => {
  return (
    <DynamicAuth>
      <DataLoader>
        <UI
          showSidebarLeft={true}
          showSidebarRight={true}
          sidebarLeftComponent={<SidebarLeft />}
          sidebarRightComponent={<SidebarRight />}>
          <Notification type="warning">
            {PRE_ALPHA_NOTIFICATION_TEXT}
          </Notification>
          <UserOverview />
        </UI>
      </DataLoader>
    </DynamicAuth>
  )
}
