import * as React from "react"
import UI from "../../src/components/ui"

import * as singleStyle from "../../src/style/single.module.scss"
import UserView from "../../src/components/user/view/UserView"
import { withRouter, useRouter } from "next/router"
import { DataLoader } from "../../src/components/utils"
import UserSidebar from "../../src/components/user/UserSidebar"
import { DynamicAuth } from "../../src/components/auth/DynamicAuth"
import { Notification } from "polyvolve-ui/lib"
import { PRE_ALPHA_NOTIFICATION_TEXT } from "../../src/constants/env"

const User = () => {
  const router = useRouter()
  const { userId } = router.query

  return (
    <DynamicAuth>
      <DataLoader>
        <UI
          showSidebarLeft={false}
          sidebarLeftComponent={null}
          showSidebarRight={true}
          sidebarRightComponent={<UserSidebar />}>
          <div className={singleStyle.pageContent}>
            <Notification type="warning">
              {PRE_ALPHA_NOTIFICATION_TEXT}
            </Notification>
            <UserView
              id={userId as string}
              loading={false}
              initialized={false}
              teams={[]}
            />
          </div>
        </UI>
      </DataLoader>
    </DynamicAuth>
  )
}

export default withRouter(User)
