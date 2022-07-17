import * as React from "react"
import cx from "classnames"

import * as plusIcon from "./plus.svg"
import * as plusIconStyle from "./style.module.scss"

import { Icon } from ".."

interface Props {
  size?: number
  tooltip?: string
  onClick?: (el: HTMLElement) => void
  className?: string
}

export default class PlusIcon extends React.Component<Props, {}> {
  public static defaultProps: Partial<Props> = {
    size: 32
  }

  render(): JSX.Element {
    const { size, onClick, className } = this.props
    const classes = cx(plusIconStyle.plusIcon, className)

    // wtf why || 0 necessary
    return (
      <Icon src={plusIcon} size={{ width: size || 0, height: size || 0 }} className={classes} onClick={onClick} />
    )
  }
}
