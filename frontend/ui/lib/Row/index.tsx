import * as React from "react"

import * as style from "./style.module.scss"

interface Props {
  className?: string
}

export default class Row extends React.Component<Props, any> {
  render(): JSX.Element {
    const { children, className } = this.props

    return (
      <div className={style.row}>
        <div className={style.content}>
          <div className={className}>
            {children}
          </div>
        </div>
      </div>
    )
  }
}
