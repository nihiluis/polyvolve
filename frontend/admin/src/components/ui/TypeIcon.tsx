import * as React from "react"

import * as style from "../../style/single.module.scss"

interface Props {
  name: string
  color: string
}

const TypeIcon: React.FC<Props> = props => (
  <div className={style.typeIcon} style={{ backgroundColor: props.color }}>
    {props.name[0]}
  </div>
)

export default TypeIcon
