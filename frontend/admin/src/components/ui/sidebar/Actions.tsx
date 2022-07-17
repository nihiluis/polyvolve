import * as React from "react"
import { SidebarSection } from ".";
import SidebarSectionTitle from "./SidebarSectionTitle";

const Actions: React.FC = props => (
  <React.Fragment>
    <SidebarSectionTitle title="Actions" />
    <SidebarSection>
      {props.children}
    </SidebarSection>
  </React.Fragment>
)

export default Actions
