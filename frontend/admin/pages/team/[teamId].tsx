import * as React from "react"
import UI from "../../src/components/ui"

import * as singleStyle from "../../src/style/single.module.scss"
import TeamView from "../../src/components/team/view/TeamView"
import { withRouter, useRouter } from "next/router"
import { DataLoader } from "../../src/components/utils"
import TeamSidebar from "../../src/components/team/TeamSidebar"
import { DynamicAuth } from "../../src/components/auth/DynamicAuth"
import { PRE_ALPHA_NOTIFICATION_TEXT } from "../../src/constants/env"
import { Notification } from "polyvolve-ui/lib"

const Team = () => {
  const router = useRouter()
  const { teamId } = router.query

  return (
    <DynamicAuth>
      <DataLoader>
        <UI
          showSidebarLeft={false}
          sidebarLeftComponent={null}
          showSidebarRight={true}
          sidebarRightComponent={<TeamSidebar />}>
          <div className={singleStyle.pageContent}>
            <Notification type="warning">
              {PRE_ALPHA_NOTIFICATION_TEXT}
            </Notification>
            <TeamView
              id={teamId as string}
              loading={false}
              initialized={false}
              users={[]}
            />
          </div>
        </UI>
      </DataLoader>
    </DynamicAuth>
  )
}

export default withRouter(Team)
