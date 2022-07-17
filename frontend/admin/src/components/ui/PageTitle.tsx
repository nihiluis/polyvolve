import * as React from "react"

import * as style from "../../style/single.module.scss"
import { getColor } from "../../lib/format";

interface Props {
  title: string
  type: string
  typeName?: string
}

const PageTitle: React.FC<Props> = props => {
  const typeName = props.typeName || props.type

  return (
    <div className={style.pageTitle}>
      <h1 className={style.pageTitleName}>{props.title}</h1>
      <div className={style.pageTitleType} style={{ backgroundColor: getColor(props.type) }}>{typeName}</div>
    </div>
  )
}

export default PageTitle
