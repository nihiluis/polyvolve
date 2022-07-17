import React from "react"
import { cx } from "../../lib/reexports"

interface OwnProps {
  className?: string
}

const PInput: React.FC<OwnProps & any> = ({ className, ...props }) => (
  <input className={cx(className, "input")} {...props} />
)

export default PInput
