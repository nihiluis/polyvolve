import * as React from "react"

import * as style from "./style.module.scss"

interface Props {
  className?: string
  percent: number
  strokeColor?: string
  trailColor?: string
  strokeWidth?: number
  trailWidth?: number
  strokeLinecap?: string
}


/**
 * https://github.com/react-component/progress/LICENSE.md
 */
export default class SimpleLine extends React.Component<Props> {
  static defaultProps: Partial<Props> = {
    strokeColor: "black",
    trailColor: "blue",
    strokeWidth: 1,
    trailWidth: 1,
    strokeLinecap: "square"
  }

  render(): JSX.Element {
    const {
      className,
      percent,
      strokeColor,
      strokeWidth,
      trailColor,
      trailWidth,
      strokeLinecap,
      ...restProps
    } = this.props

    const center = strokeWidth / 2
    const right = 100 - (strokeWidth / 2)

    const viewBoxString = `0 0 100 ${strokeWidth}`

    let stackPtg = 0
    const pathStyle = {
      strokeDasharray: `${percent}px, 100px`,
      strokeDashoffset: `-${stackPtg}px`,
      transition:
        'stroke-dashoffset 0.3s ease 0s, stroke-dasharray .3s ease 0s, stroke 0.3s linear',
    }
    const pathString =
      `M ${strokeLinecap === 'round' ? center : 0},${center}
     L ${strokeLinecap === 'round' ? right : 100},${center}`;

    return (
      <svg
        className={`line ${className}`}
        viewBox={viewBoxString}
        preserveAspectRatio="none"
        {...restProps}>
        <path
          className={style.lineTrail}
          d={pathString}
          stroke={trailColor}
          strokeWidth={trailWidth || strokeWidth}
          fillOpacity="0"
        />
        <path
          className={style.linePath}
          d={pathString}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          fillOpacity="0"
          style={pathStyle}
        />
      </svg>
    )
  }
}
