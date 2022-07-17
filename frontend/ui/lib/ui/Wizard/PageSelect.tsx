import * as React from "react"
import cx from "classnames"

import * as style from "./style.module.scss"

import * as leftIcon from "./left.svg"
import * as rightIcon from "./right.svg"
import { Icon } from "../../icons"

interface Props {
  currentPage: number
  maxPage: number
  switchPage: (page: number) => void
}

const PageSelect: React.FunctionComponent<Props> = props => {
  function isAtMax(): boolean {
    return props.currentPage === props.maxPage
  }

  function isAtMin(): boolean {
    return props.currentPage === 1
  }

  const leftClasses = cx(style.selectChevron, {
    [style.selectActive]: !isAtMin,
  })
  const rightClasses = cx(style.selectChevron, {
    [style.selectActive]: !isAtMax,
  })

  function incrementPage(props: Props) {
    if (!isAtMax()) {
      props.switchPage(props.currentPage + 1)
    }
  }

  function decrementPage(props: Props) {
    if (!isAtMin()) {
      props.switchPage(props.currentPage - 1)
    }
  }

  return (
    <div className={style.select}>
      <Icon
        size={{ width: 24 }}
        className={leftClasses}
        src={leftIcon}
        onClick={() => decrementPage(props)}
      />
      {props.currentPage} / {props.maxPage}
      <Icon
        size={{ width: 24 }}
        className={rightClasses}
        src={rightIcon}
        onClick={() => incrementPage(props)}
      />
    </div>
  )
}

export default PageSelect
