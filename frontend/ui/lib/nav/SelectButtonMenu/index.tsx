import * as React from "react"

export interface SelectButtonMenuItem {
  id?: string
  name: string
  className?: string
}

import { MultiSelectButtonMenu } from ".."

interface Props<T extends SelectButtonMenuItem> {
  title?: string
  items: T[]
  disabled?: boolean
  value?: string
  className?: string
  itemClassName?: string
  btnClassName?: string
  onClick: (item: T) => void
  onUpdate: (item: string) => void
}

export default function SelectButtonMenu<T extends SelectButtonMenuItem>(props: Props<T>) {
  const {
    title,
    disabled,
    value,
    onClick,
    onUpdate,
    items,
    itemClassName,
    btnClassName,
    className } = props

  return (
    <MultiSelectButtonMenu<T>
      title={title}
      single={true}
      disabled={disabled}
      items={items}
      values={[value]}
      onClick={onClick}
      itemClassName={itemClassName}
      btnClassName={btnClassName}
      className={className}
      onUpdate={values => onUpdate(values[0])}
    />
  )
}
