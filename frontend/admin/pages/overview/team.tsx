import * as React from "react"

import UI from "../../src/components/ui"
import TeamList from "../../src/components/team/overview/TeamOverview"

import * as teamStyle from "../../src/style/overview/team.module.scss"
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

export default props => {
  return (
    <DynamicAuth>
      <UI
        showSidebarLeft={true}
        sidebarLeftComponent={<SidebarLeft />}
        showSidebarRight={true}
        sidebarRightComponent={<SidebarRight />}>
        <div className={teamStyle.leadersGrid}>
          <Notification type="warning">
            {PRE_ALPHA_NOTIFICATION_TEXT}
          </Notification>
          <TeamList />
        </div>
      </UI>
    </DynamicAuth>
  )
}
