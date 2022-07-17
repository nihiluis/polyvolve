import * as React from "react"
import cx from "classnames"

import * as style from "./style.module.scss"

interface Props {
  className?: string
}

const Header: React.FunctionComponent<Props> = props =>
  <header className={cx(style.header, props.className)}>
    {props.children}
  </header>

export default Header
