import * as React from "react"
import Link from "next/link"

import { SVG } from "../.."

interface Props {
  name?: string
  url?: string
  icon?: any
  iconSize?: number
  index?: boolean
  className?: string
  onClick?: () => void
}

const NavigationItem: React.FC<Props> = props => {
  const { url, onClick, name, icon, iconSize } = props

  return (
    <li>
      {url && <NavigationItemLink {...props} />}
      {!url && !icon && <a onClick={onClick}>{name}</a>}
      {!url && icon && (
        <a onClick={onClick}>
          <SVG
            html={icon}
            size={{ width: iconSize || 16, height: iconSize || 16 }}
          />
        </a>
      )}
    </li>
  )
}

const NavigationItemLink: React.FC<Props> = props => {
  const { name, url, index, icon, iconSize, className } = props

  return icon ? (
    <Link href={url!}>
      <a className={className}>
        {!name && icon && (
          <SVG
            html={icon}
            size={{ width: iconSize || 16, height: iconSize || 16 }}
          />
        )}
        {name && icon && (
          <span>
            <SVG
              html={icon}
              size={{ width: iconSize || 16, height: iconSize || 16 }}
            />
            <p>{name}</p>
          </span>
        )}
      </a>
    </Link>
  ) : (
    <Link href={url!}>
      <a className={className}>{name}</a>
    </Link>
  )
}

export default NavigationItem
