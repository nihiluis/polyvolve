import * as React from "react"
import cx from "classnames"

import * as refreshIcon from "./refresh.svg"

import { Icon } from ".."

export type RefreshStatus = "done" | "failed" | "loading" | ""

interface Props {
  size?: number
  tooltip?: string
  onClick?: (el: HTMLElement) => void
  className?: string
}

export default class RefreshIcon extends React.Component<Props, {}> {
  public static defaultProps: Partial<Props> = {
    size: 24
  }

  render(): JSX.Element {
    const { size, onClick, className } = this.props
    const classes = cx(className)

    return (
      <Icon src={refreshIcon}
        size={{ width: size || 0, height: size || 0 }}
        className={classes}
        onClick={onClick} />
    )
  }
}
