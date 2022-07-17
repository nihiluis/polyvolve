import * as React from "react"

import * as infoBoxStyle from "./style.module.scss"

  export interface Props { 
    title?: string
  }

export default class InfoBox extends React.Component<Props> {
  render() {
    const { title, children } = this.props;

    return (
      <div className={infoBoxStyle.infoBox}>
        {title && <h2>{title}</h2>}
        {children}
      </div>
    )
  }
}
