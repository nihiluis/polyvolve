import * as React from "react"

import * as logoStyle from "./style.module.scss"

interface Props {
  text: string
  size: number
}

export default class LogoText extends React.Component<Props, {}> {
  render(): JSX.Element {
    const { text } = this.props
    return (
      <div className={logoStyle.logoText} style={this.size()}>
        {text}
      </div>
    )
  }

  size(): any {
    return this.props.size ? { lineHeight: `${this.props.size}px` } : {}
  }
}
