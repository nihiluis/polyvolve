import * as React from "react"
import cx from "classnames"

import * as logoIcon from "./logo.svg"
import * as style from "./style.module.scss"
import { Icon } from "../../icons"

interface Props {
  size?: number
  color?: string
  className?: string
}

export default class Logo extends React.Component<Props, {}> {
  public static defaultProps: Partial<Props> = {
    size: 32,
  }

  render(): JSX.Element {
    const { size, color, className } = this.props

    const classes = cx(style.logo, className)

    return (
      <Icon
        className={classes}
        src={logoIcon}
        size={{ width: size, height: size }}
        style={{ fill: color }}
      />
    )
  }
}
