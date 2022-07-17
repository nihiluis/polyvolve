import * as React from "react"
import cx from "classnames"

import * as tickIcon from "./tick.svg"
import * as errorIcon from "./error.svg"
import * as style from "./style.module.scss"

import { SVG } from "../.."

interface Props {
  size?: number
  status: boolean
  tooltip?: string
  show: boolean
}

export default class StatusIcon extends React.Component<Props, {}> {
  public static defaultProps: Partial<Props> = {
    size: 32
  }

  renderSVG(): JSX.Element {
    const { status, size } = this.props

    switch (status) {
      case true:
        return <SVG html={tickIcon} style={{ width: size, height: size }} />
      default:
        return <SVG html={errorIcon} style={{ width: size, height: size }} />
    }
  }

  render(): JSX.Element {
    const classes = cx({ [style.statusIcon]: true, tick: this.props.status, active: this.props.show })

    return (
      <div className={classes}>
        {this.renderSVG()}
      </div>
    )
  }
}
