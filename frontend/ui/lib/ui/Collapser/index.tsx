import * as React from "react"
import cx from "classnames"

interface Props {
  onClick?: () => void
  className?: string
  title: string
  defaultCollapsed: boolean
  content?: JSX.Element
}

interface State {
  collapsed: boolean
}

export default class Collapser extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = { collapsed: props.defaultCollapsed }
  }

  toggle = () => {
    this.setState({ collapsed: !this.state.collapsed })
  }

  render(): JSX.Element {
    const { className, title, children, content } = this.props
    const classes = cx(className, "collapser")
    const innerClasses = cx({ collapsed: this.state.collapsed })

    return (
      <div className={classes}>
        <div className="collapser-toggler">
          <a onClick={this.toggle}>
            {title}
          </a>
          {content && { ...content }}
        </div>
        <div className={innerClasses}>
          {children}
        </div>
      </div>
    )
  }
}
