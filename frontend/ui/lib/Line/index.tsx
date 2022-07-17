import * as React from "react"
import cx from "classnames"

import * as css from "./style.module.scss"

interface Props {
  style?: any
  className?: string
}

export default class Line extends React.Component<Props, {}> {
  render(): JSX.Element {
    const { style, className } = this.props

    const classes = cx(css.line, className)
  
    return (
      <div className={classes} style={style}></div>
    )
  }
}
