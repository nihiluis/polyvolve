import * as React from "react"
import cx from "classnames"

import { InfoIcon } from "../icons"

import * as style from "./style.module.scss"

type NotificationType = "warning" | "error" | "hint"

interface Props {
  deletable?: boolean
  type: NotificationType
  table?: boolean
  className?: string
}

export default class Notification extends React.Component<Props, {}> {
  render(): JSX.Element {
    const { children, type, table, className } = this.props
    const classes = cx({ 
      warning: type === "warning", 
      error: type === "error",
      hint: type === "hint",
      [style.notificationTable]: table,
      [style.notificationFlex]: !table,
    }, "notification", className)

    return (
      <div className={classes}>
        <InfoIcon size={18} className="notification-icon" />
        {children}
      </div>
    )
  }
}
