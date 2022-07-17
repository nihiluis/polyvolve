import * as React from "react"
import cx from "classnames"

import {
  Logo,
} from "polyvolve-ui/lib"

import { footerStyle } from "../../lib/reexports"
import { SITE_NAME } from "../../constants/env"

interface Props {
  className?: string
}

const Footer: React.FunctionComponent<Props> = props =>
    <footer className={cx(footerStyle.footer, props.className)} >
      <div className={footerStyle.footerTitle}>
        <Logo className={footerStyle.footerLogo} />
        <h3>UNRELEASED v0.0.1</h3>
      </div>
      <div className={footerStyle.copyright}>
        <p>{`© 2019 ${SITE_NAME}`}</p>
      </div>
    </footer>

export default Footer
