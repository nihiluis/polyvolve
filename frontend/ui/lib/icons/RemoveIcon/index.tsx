import * as React from "react"
import cx from "classnames"

import * as removeSvg from "./trash2.svg"

import { Icon } from ".."

interface Props {
  src?: any
  size?: number
  onClick?: (el: HTMLElement) => void
  className?: string
  title?: string
}

export default class RemoveIcon extends React.Component<Props, {}> {
  public static defaultProps: Partial<Props> = {
    size: 32
  }

  render(): JSX.Element {
    const { size, onClick, className, src, title } = this.props
    const classes = cx(className)

    // wtf why || 0 necessary
    return (
      <Icon
        src={src || removeSvg}
        size={{ width: size || 0, height: size || 0 }}
        className={classes}
        onClick={onClick}
        title={title} />
    )
  }
}
