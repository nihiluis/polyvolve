import * as React from "react"
import cx from "classnames"

import * as style from "./style.module.scss"
import { SelectElementMenuItem } from "../SelectElementMenu";

interface Props<T extends SelectElementMenuItem<any>> {
  title?: string
  items: T[]
  values: string[]
  disabled?: boolean
  single?: boolean
  className?: string
  itemClassName?: string
  onClick: (name: T) => void
  onUpdate: (newValues: string[]) => void
}

interface State {
  touched: boolean
}

export default class MultiSelectElementMenu<T extends SelectElementMenuItem<any>>
  extends React.PureComponent<Props<T>, State> {
  constructor(props: Props<T>) {
    super(props)

    this.state = { touched: false }
  }

  handleClick(item: T): void {
    const { disabled, values, single } = this.props

    if (!disabled) {
      let newValues: string[]

      if (!single) {
        newValues = [...values]
        const indexOfItem = newValues.indexOf(item.name)
        if (indexOfItem === -1) {
          newValues.push(item.name)
        } else {
          newValues.splice(indexOfItem, 1)
        }
      } else {
        newValues = [item.name]
      }

      if (!this.state.touched) this.setState({ touched: true })

      this.props.onClick(item)
      this.props.onUpdate(newValues)
    }
  }

  onClick = (name: T): () => void => () => this.handleClick(name)

  renderItem(item: T, i: number): JSX.Element {
    const { values, itemClassName } = this.props

    const active: boolean = (values.indexOf(item.name) !== -1)

    const classes = cx({ [style.elementItem]: true, active: active}, itemClassName)

    return (
      <div key={`em-${item.name}`} className={classes}>
        <item.element {...item.props} active={active} onClick={this.onClick(item)} key={`${item.name}-field`}>
          {item.name}
        </item.element>
      </div>
    )
  }

  render(): JSX.Element {
    const { title, items, className } = this.props

    return (
      <div className={cx(style.elementMenu, className)}>
        {title && <h2>{title}</h2>}
        {items.map((val, i) => this.renderItem(val, i))}
      </div>
    )
  }
}
