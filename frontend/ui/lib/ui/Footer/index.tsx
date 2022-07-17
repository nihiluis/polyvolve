import * as React from "react"
import cx from "classnames"

import * as footerStyle from "./style.module.scss"

interface Props {
  className?: string
}

const Footer: React.FunctionComponent<Props> = props =>
  <div id={cx(footerStyle.footer, props.className)}>
    {props.children}
  </div>

export default Footer
