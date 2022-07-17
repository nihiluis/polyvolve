import * as React from "react"
import cx from "classnames"

import * as iconSvg from "./info.svg"

import { Icon } from ".."

interface Props {
  src?: any
  size?: number
  tooltip?: string
  onClick?: (el: HTMLElement) => void
  className?: string
}

export default class InfoIcon extends React.Component<Props, {}> {
  public static defaultProps: Partial<Props> = {
    size: 32
  }

  render(): JSX.Element {
    const { size, onClick, className, src, tooltip } = this.props
    const classes = cx(className)

    // wtf why || 0 necessary
    return (
      <Icon
        src={src || iconSvg}
        size={{ width: size || 0, height: size || 0 }}
        className={classes}
        onClick={onClick}
        aria-label={tooltip} data-microtip-position="right" role="tooltip" />
    )
  }
}
