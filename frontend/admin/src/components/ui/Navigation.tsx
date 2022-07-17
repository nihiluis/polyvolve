import * as React from "react"
import { NavigationItem } from "../utils"

import Search from "../utils/Search"
import UserHeader from "./UserHeader"
import { navStyle, layoutStyle } from "../../lib/reexports"
import * as layoutIcon from "../../assets/icons/layout.svg"
import * as framerIcon from "../../assets/icons/framer.svg"
import * as packageIcon from "../../assets/icons/package.svg"
import * as usersIcon from "../../assets/icons/users.svg"
import * as fileTextIcon from "../../assets/icons/file-text.svg"

const Navigation: React.FunctionComponent = () => (
  <nav className={navStyle.navContainer}>
    <div className={navStyle.navRight}>
      <Search />
      <ul className={navStyle.navRightList}></ul>
      <UserHeader className={layoutStyle.userHeaderGrid} />
    </div>
    <div className={navStyle.navCenter}>
      <ul className={navStyle.navCenterList}>
        <NavigationItem name="Dashboard" url="/" icon={layoutIcon} />
        <NavigationItem name="Users" url="/overview/user" icon={usersIcon} />
        <NavigationItem name="Teams" url="/overview/team" icon={packageIcon} />
        <NavigationItem
          name="Reviews"
          url="/overview/reviewmaster"
          icon={fileTextIcon}
        />
        <NavigationItem name="Schemas" url="/schema" icon={framerIcon} />
      </ul>
    </div>
  </nav>
)

export default Navigation
