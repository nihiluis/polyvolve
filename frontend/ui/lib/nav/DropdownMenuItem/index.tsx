import * as React from "react"

import { NavigationItem } from ".."

interface Props {
  onClick?: () => void
  link?: string
  name: string
}

export default class DropdownItem extends React.Component<Props, {}> {
  render(): JSX.Element {
    const { name, link, onClick } = this.props

    return (
      <NavigationItem onClick={onClick} name={name} url={link} />
    )
  }
}

