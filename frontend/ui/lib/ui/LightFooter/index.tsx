import * as React from "react"

import * as style from "./style.module.scss"
import { NavigationItem } from "../../nav"

export default class LightFooter extends React.Component<{}, {}> {
  render() {
    return (
      <div className={style.lightFooter}>
        <ul>
          <NavigationItem url="/contact" name="Contact" />
          <NavigationItem url="/privacy" name="Privacy" />
          <NavigationItem url="/terms" name="Terms" />
        </ul>
      </div>
    )
  }
}
