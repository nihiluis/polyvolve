import * as React from "react"
import cx from "classnames"

export interface Props {
  onClick?: () => void
  name: string
  className?: string
  type?: "submit" | "reset" | "button"
}

export default class Button extends React.Component<Props & any> {
  render(): JSX.Element {
    const { children, name, onClick, className, ...rest } = this.props

    const classes = cx(className, "btn", "btn-standard")

    return (
      <button {...rest} name={`btn-${name}`} className={classes} onClick={onClick}>
        {children}
      </button>
    )
  }
}
