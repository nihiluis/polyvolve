import * as React from "react"
import UI from "../src/components/ui"
import { DynamicAuth } from "../src/components/auth/DynamicAuth"
import { Notification } from "polyvolve-ui/lib"
import { PRE_ALPHA_NOTIFICATION_TEXT } from "../src/constants/env"
import Dashboard from "../src/components/dashboard"

export default () => (
  <DynamicAuth>
    <UI
      showSidebarLeft={true}
      sidebarLeftComponent={null}
      showSidebarRight={false}
      sidebarRightComponent={null}>
      <Notification type="warning">{PRE_ALPHA_NOTIFICATION_TEXT}</Notification>
      <Dashboard />
    </UI>
  </DynamicAuth>
)
