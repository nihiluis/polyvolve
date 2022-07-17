import * as React from "react"
import cx from "classnames"

import * as style from "./style.module.scss"

interface Props {
  def?: DropdownSelectMenuItem
  active?: DropdownSelectMenuItem
  className?: string
  dropdownClassName?: string
  items: DropdownSelectMenuItem[]
  fixed?: number
  onChange?: (newItem: DropdownSelectMenuItem) => void
}

interface State {
  active: DropdownSelectMenuItem
}

export interface DropdownSelectMenuItem {
  value?: any
  label: string
}

class DropdownSelectMenu extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      active: props.def || props.active!
    }
  }

  render(): JSX.Element {
    const { className, dropdownClassName, items, fixed } = this.props
    const classes = cx(style.dropdownSelectContainer, className, { [style.fixed]: fixed && fixed > 0 || false })
    const dropdownClasses = cx(style.dropdownSelectMenu, dropdownClassName)
    const fixedStyle = fixed && { width: fixed } || {}

    const active = this.props.active || this.state.active

    return (
      <div className={classes}>
        <a className={style.dropdownSelectTitle} style={fixedStyle}>{active.label}</a>
        <ul className={dropdownClasses}>
          {items.map(val =>
            <DropdownSelectItem
              key={val.label}
              name={val.label}
              onClick={() => { this.setActive(val) }} />)}
        </ul>
      </div>
    )
  }

  setActive = (newActive: DropdownSelectMenuItem) => {
    this.setState({ active: newActive })

    if (this.props.onChange) {
      this.props.onChange(newActive)
    }
  }
}

export interface DropdownSelectItemProps {
  onClick: () => void
  name: string
}

class DropdownSelectItem extends React.Component<DropdownSelectItemProps, {}> {
  render(): JSX.Element {
    const { name, onClick } = this.props

    return <a onClick={onClick} className={style.dropdownSelectItem}>{name}</a>
  }
}

export default DropdownSelectMenu
