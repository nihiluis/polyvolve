import * as React from "react"
import cx from "classnames"

import * as iconSvg from "./minus.svg"
import * as iconStyle from "./style.module.scss"

import { Icon } from ".."

interface Props {
  size?: number
  tooltip?: string
  onClick?: (el: HTMLElement) => void
  className?: string
}

export default class MinusIcon extends React.Component<Props, {}> {
  public static defaultProps: Partial<Props> = {
    size: 32
  }

  render(): JSX.Element {
    const { size, onClick, className } = this.props
    const classes = cx(iconStyle.minusIcon, className)

    // wtf why || 0 necessary
    return (
      <Icon src={iconSvg} size={{ width: size || 0, height: size || 0 }} className={classes} onClick={onClick} />
    )
  }
}
