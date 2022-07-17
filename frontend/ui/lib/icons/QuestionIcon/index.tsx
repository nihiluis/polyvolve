import * as React from "react"
import cx from "classnames"

import * as questionIcon from "./question.svg"
import * as questionIconStyle from "./style.module.scss"

import { Icon } from ".."

interface Props {
  size?: number
  tooltip?: string
  onClick?: () => void
  className?: string
}

export default class QuestionIcon extends React.Component<Props, {}> {
  public static defaultProps: Partial<Props> = {
    size: 32
  }

  render(): JSX.Element {
    const { size, onClick, className } = this.props
    const classes = cx({ [questionIconStyle.questionIcon]: true }, className)

    // wtf why || 0 necessary
    return (
      <Icon src={questionIcon} className={classes} onClick={onClick} size={{ width: size || 0, height: size || 0 }} />
    )
  }
}
