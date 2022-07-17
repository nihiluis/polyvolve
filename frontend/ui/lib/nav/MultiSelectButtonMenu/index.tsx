import * as React from "react"
import cx from "classnames"

import * as style from "./style.module.scss"
import { SelectButtonMenuItem } from "../SelectButtonMenu";

interface Props<T extends SelectButtonMenuItem> {
  title?: string
  items: T[]
  className?: string
  itemClassName?: string
  btnClassName?: string
  values: string[]
  single?: boolean
  disabled?: boolean
  onClick: (item: T) => void
  onUpdate: (values: string[]) => void
}

interface State {
  touched: boolean
}

export default class MultiSelectButtonMenu<T extends SelectButtonMenuItem>
  extends React.Component<Props<T>, State> {
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
        const indexOfItem = newValues.indexOf(item.id || item.name)
        if (indexOfItem === -1) {
          newValues.push(item.id || item.name)
        } else {
          newValues.splice(indexOfItem, 1)
        }
      } else {
        newValues = [item.id || item.name]
      }

      if (!this.state.touched) this.setState({ touched: true })

      this.props.onClick(item)
      this.props.onUpdate(newValues)
    }
  }

  onClick(item: T): () => void {
    return () => this.handleClick(item)
  }

  shouldComponentUpdate(nextProps: Props<T>, nextState: State): boolean {
    if (nextProps.values !== this.props.values) {
      return true
    }

    return false
  }

  renderItem(item: T, i: number): JSX.Element {
    const { values } = this.props
    const inactive = this.props.disabled
    const active: boolean = (values.indexOf(item.id || item.name) !== -1)

    const classes = cx(
      this.props.itemClassName,
      style.choiceBoxItem,
      { [style.inactive]: inactive })
    const btnClasses = cx("btn", { active }, this.props.btnClassName, item.className)

    return (
      <span key={`cb-sp-${i}`} className={classes}>
        <button onClick={this.onClick(item)} key={`${item.name}-field`} name={`choice-item-${item.name}`} type="button" className={btnClasses}>
          {item.name}
        </button>
      </span>
    )
  }

  render(): JSX.Element {
    const { title, items, className, disabled } = this.props

    const containerClasses = cx(style.choiceBox, className, { [style.inactive]: disabled })

    return (
      <div className={containerClasses}>
        {title && <h2>{title}</h2>}
        {items.map((val, i) => this.renderItem(val, i))}
      </div>
    )
  }
}
