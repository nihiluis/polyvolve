import * as React from "react"
import {
  MenuList,
} from "polyvolve-ui/lib"

import Subsection from "../../ui/section/Subsection"
import SubsectionTitle from "../../ui/section/SubsectionTitle"
import SubsectionContent from "../../ui/section/SubsectionContent"
import { ReviewMaster } from "polyvolve-ui/lib/@types"
import { singleStyle } from "../../../lib/reexports"
import { UserItem } from "../../single/dependencies/UserItem"

interface Props {
  reviewMaster?: ReviewMaster
}

const ReviewMasterDependenciesReviewingUserSubsection: React.FC<Props> = props => {
  const users = props.reviewMaster.reviewingUsers

  return (
    <Subsection size="full">
      <SubsectionTitle title="Reviewing Users" />
      <SubsectionContent size="full">
        <MenuList innerClassName={singleStyle.selectItemContainer}>
          {users.length === 0 && (
            <p>
              {props.reviewMaster.name} has no reviewing Users. Add Teams (with Users in it).
            </p>
          )}
          {users.map(user => (
            <UserItem key={`user-item-${user.id}`} user={user} />
          ))}
        </MenuList>
      </SubsectionContent>
    </Subsection>
  )
}

export default ReviewMasterDependenciesReviewingUserSubsection
