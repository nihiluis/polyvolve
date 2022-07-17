import * as React from "react"
import cx from "classnames"

import { SVG } from "../.."

export interface IconProps {
  className?: string
  size?: { width: number; height: number }
  onClick?: (html?: HTMLElement) => void
  customHandleClick?: boolean
  isLink?: boolean
  title?: string
  reverse?: boolean
}

interface IconPropsWithSrc extends IconProps {
  src: any
}

type ClickFn = ((e: React.MouseEvent<HTMLElement>) => void) | undefined

export default class Icon extends React.Component<IconPropsWithSrc & any, {}> {
  aRef: React.Ref<any>
  constructor(props: IconPropsWithSrc) {
    super(props)

    this.aRef = React.createRef()
  }

  public static defaultProps: Partial<IconPropsWithSrc> = {
    size: { width: 32, height: 32 },
    isLink: true,
    customHandleClick: true,
  }

  handleClick = (): ClickFn => {
    if (this.props.handleCustomClick && this.props.onClick) {
      // return () => this.props.onClick(this.iconRef)
      return e => {
        ;(this.props.onClick as (html?: HTMLElement) => void)(
          e.target as HTMLElement
        )
        e.preventDefault()
        //(this.props.onClick as (html: HTMLElement) => void)()
      }
    }

    return this.props.onClick
  }

  render(): JSX.Element {
    const {
      className,
      src,
      size,
      isLink,
      onClick,
      customHandleClick,
      reverse,
      ...rest
    } = this.props

    const spreadProps: any = {}
    if (onClick) {
      spreadProps.onClick = this.handleClick()
    }

    const containerClasses = cx("icon", className)
    const svgClasses = cx({"reverse": reverse })

    const SrcComponent = src

    return isLink ? (
      <a {...rest} ref={this.aRef} className={containerClasses} {...spreadProps}>
        <SrcComponent className={svgClasses} style={{ ...size, verticalAlign: "bottom" }} />
      </a>
    ) : (
      <div className={containerClasses} {...spreadProps}>
        <SrcComponent
          className={svgClasses}
          style={{ ...size, verticalAlign: "bottom" }}
        />
      </div>
    )
  }
}
