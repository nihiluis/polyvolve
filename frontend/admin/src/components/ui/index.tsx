import Layout from "./Layout"
import PageTitle from "./PageTitle"
import TypeIcon from "./TypeIcon"
import Head from "next/head"
import { SITE_NAME } from "../../constants/env"

interface Props {
  showSidebarLeft: boolean
  showSidebarRight: boolean
  sidebarLeftComponent: JSX.Element
  sidebarRightComponent: JSX.Element
}

const ui: React.FunctionComponent<Props> = props => (
  <Layout
    showSidebarLeft={props.showSidebarLeft}
    showSidebarRight={props.showSidebarRight}
    sidebarLeftComponent={props.sidebarLeftComponent}
    sidebarRightComponent={props.sidebarRightComponent}>
    {props.children}
  </Layout>
)

export default ui

export { PageTitle, TypeIcon }
