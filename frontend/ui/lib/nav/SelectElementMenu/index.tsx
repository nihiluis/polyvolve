import * as React from "react"

import { MultiSelectElementMenu } from ".."

interface Props<T extends SelectElementMenuItem<any>> {
  title?: string
  items: T[]
  disabled?: boolean
  value?: string
  className?: string
  itemClassName?: string
  onClick: (item: T) => void
  onUpdate: (name: string) => void
}

export interface SelectElementMenuItem<Y extends SelectElementMenuComponent> {
  element: React.FC<Y>
  name: string
  props: any
}

export interface SelectElementMenuComponent {
  active: boolean
  onClick?: () => void
  className?: string
}

export default function SelectElementMenu<T extends SelectElementMenuItem<any>>(props: Props<T>) {
  const {
    title,
    disabled,
    value,
    onClick,
    onUpdate,
    items,
    className,
    itemClassName } = props

  return (
    <MultiSelectElementMenu<T>
      title={title}
      single={true}
      disabled={disabled}
      items={items}
      values={[value]}
      onClick={onClick}
      className={className}
      itemClassName={itemClassName}
      onUpdate={values => onUpdate(values[0])}
    />
  )
}
