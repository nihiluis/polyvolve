import * as React from "react"
import cx from "classnames"

import * as style from "./style.module.scss"

interface Props {
  title?: string
  className?: string
  innerClassName?: string
}

export default class extends React.Component<Props, {}> {
  render(): JSX.Element {
    const { children, title, className, innerClassName } = this.props
  
    const classes = cx(style.menuList, className)
    const innerClasses = cx(style.innerMenuList, innerClassName)

    return (
      <div className={classes}>
        {title && <h4>{title}</h4>}
        <div className={innerClasses}>{children}</div>
      </div>
    )
  }
}
