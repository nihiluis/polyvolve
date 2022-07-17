import * as React from "react"
import cx from "classnames"

import Load from "../Load"

import * as style from "./style.module.scss"

export interface Props {
  onClick?: () => void
  className?: string
  loading: boolean
  type?: string
}

export default class LoadButton extends React.Component<Props & any> {
  render(): JSX.Element {
    const { children, loading, ...rest } = this.props

    const classes = cx("btn", "btn-standard", style.btnLoad, this.props.className)

    return (
      <button {...rest} name="btn-load" className={classes} onClick={this.props.onClick}>
        {loading ? <Load size={24} /> : children}
      </button>
    )
  }
}
