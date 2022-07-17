import * as React from "react"
import Link from "next/link"
import cx from "classnames"

import * as goIcon from "./go.svg"
import * as goIconStyle from "./style.module.scss"

import { SVG } from "../.."

interface Props {
  size?: number
  active: boolean
  tooltip?: string
  show: boolean
  to: string
  onClick?: () => void
}

export default class GoIcon extends React.PureComponent<Props, {}> {
  public static defaultProps: Partial<Props> = {
    size: 16
  }

  render(): JSX.Element {
    const { active, size, to } = this.props
    const classes = cx({ [goIconStyle.goIcon]: true, active: active })

    return (
      <div className={classes}>
        {active ? <Link href={to}>
          <a>
            <SVG html={goIcon} style={{ width: size, height: size }} />
          </a>
        </Link> : <SVG html={goIcon} style={{ width: size, height: size }} />}
      </div>
    )
  }
}
