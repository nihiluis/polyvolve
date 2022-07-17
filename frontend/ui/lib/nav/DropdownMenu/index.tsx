import * as React from "react"
import Link from "next/link"
import cx from "classnames"

import * as style from "./style.module.scss"

interface Props {
  children: any
  link?: string
  name: string
  className?: string
}

export default class DropdownMenu extends React.Component<Props, {}> {
  render(): JSX.Element {
    const { children, className, name, link } = this.props
    const classes = cx(style.dropdownMenu, className)

    return (
      <div className={style.dropdownContainer}>
        {link ? <Link href={link}>
          <a className={style.dropdownTitle}>{name}</a>
        </Link> : <p className={style.dropdownTitle}>{name}</p>}
        <ul className={classes}>
          {children}
        </ul>
      </div>
    )
  }
}

