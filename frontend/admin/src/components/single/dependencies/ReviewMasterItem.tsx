import * as React from "react"
import { ReviewMaster } from "polyvolve-ui/lib/@types"

import * as singleStyle from "../../../style/single.module.scss"
import Link from "next/link"


interface ReviewMasterItemProps {
  reviewMaster: ReviewMaster
}

export const ReviewMasterItem: React.FC<ReviewMasterItemProps> = props => (
  <div
    key={`reviewMaster-item-${props.reviewMaster.id}-div`}
    className={singleStyle.menuListItem}>
    <Link
      href={`/review/master/[reviewMasterId]`}
      as={`/review/master/${props.reviewMaster.id}`}
      key={`reviewMaster-item-${props.reviewMaster.id}-name`}>
      <a key={`reviewMaster-item-${props.reviewMaster.id}-a`}>
        {props.reviewMaster.name}
      </a>
    </Link>
  </div>
)
