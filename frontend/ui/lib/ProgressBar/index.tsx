import * as React from "react"

import Line from "./Line"

interface Props {
  percent: number
  className?: string
}

export default class ProgressBar extends React.Component<Props> {
  render(): JSX.Element {
    const { percent, className } = this.props

    return (
      <React.Fragment>
        <Line
          percent={percent}
          className={className} />
      </React.Fragment>
    )
  }
}
