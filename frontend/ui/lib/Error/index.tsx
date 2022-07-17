import * as React from "react"
import cx from "classnames"

interface Props {
  className?: string
}

// do this as stateless functional component
export default class Error extends React.Component<Props, {}> {
  render(): JSX.Element {
    const { children, className } = this.props

    const classNames = cx("error", className)

    return (
      <div className={classNames}>
        {children}
      </div>
    )
  }
}
