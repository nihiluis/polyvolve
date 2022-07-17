import * as React from "react"
import { sidebarStyle } from "../../../lib/reexports"

const SidebarSection: React.FC = props => (
  <div className={sidebarStyle.sidebarSection}>{props.children}</div>
)

export default SidebarSection
