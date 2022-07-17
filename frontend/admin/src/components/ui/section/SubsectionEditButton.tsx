import * as React from "react"

import * as style from "../../../style/single.module.scss"
import { cx } from "../../../lib/reexports";
import { Button } from "polyvolve-ui/lib";

interface Props {
  editting: boolean
  name: string
  toggleEditting: () => void
}

const SubsectionEditButton: React.FC<Props> = props => {
  const classes = cx(style.subsectionEditButton)
  const { editting, name, toggleEditting } = props

  return (
    <div className={classes}>
      {!editting && <Button type="button" name={name} onClick={toggleEditting}>
        Edit
        </Button>}
    </div>
  )
}

export default SubsectionEditButton
