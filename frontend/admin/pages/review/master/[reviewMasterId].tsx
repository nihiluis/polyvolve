import * as React from "react"
import { Notification } from "polyvolve-ui/lib"

import UI from "../../../src/components/ui"

import * as singleStyle from "../../../src/style/single.module.scss"
import ReviewMasterView from "../../../src/components/reviewmaster/view/ReviewMasterView"
import { withRouter, useRouter } from "next/router"
import { DataLoader } from "../../../src/components/utils"
import ReviewMasterSidebar from "../../../src/components/reviewmaster/ReviewMasterSidebar"
import { DynamicAuth } from "../../../src/components/auth/DynamicAuth"
import { PRE_ALPHA_NOTIFICATION_TEXT } from "../../../src/constants/env"

const ReviewMaster = () => {
  const router = useRouter()

  const { reviewMasterId } = router.query

  return (
    <DynamicAuth>
      <DataLoader>
        <UI
          showSidebarLeft={false}
          sidebarLeftComponent={null}
          showSidebarRight={true}
          sidebarRightComponent={<ReviewMasterSidebar />}>
          <div className={singleStyle.pageContent}>
            <Notification type="warning">
              {PRE_ALPHA_NOTIFICATION_TEXT}
            </Notification>
            <ReviewMasterView
              id={reviewMasterId as string}
              loading={false}
              initialized={false}
              teams={[]}
              users={[]}
            />
          </div>
        </UI>
      </DataLoader>
    </DynamicAuth>
  )
}

export default withRouter(ReviewMaster)
