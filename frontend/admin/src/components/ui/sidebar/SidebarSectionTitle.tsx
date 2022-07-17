import * as React from "react"
import { sidebarStyle } from "../../../lib/reexports"

interface Props {
  title: string
}

const SidebarSectionTitle: React.FC<Props> = props => (
  <div>
    <h2 className={sidebarStyle.sidebarSectionTitle}>{props.title}</h2>
  </div>
)

export default SidebarSectionTitle
