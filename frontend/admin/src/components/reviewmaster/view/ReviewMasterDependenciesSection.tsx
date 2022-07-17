import * as React from "react"
import SectionTitle from "../../ui/section/SectionTitle"
import Section from "../../ui/section/Section"
import SectionHeader from "../../ui/section/SectionHeader"
import SectionContent from "../../ui/section/SectionContent"
import { ReviewMaster, User, Team } from "polyvolve-ui/lib/@types"
import ReviewMasterDependenciesTeamSubsection from "./ReviewMasterDependenciesTeamSubsection"
import ReviewMasterDependenciesReviewedUserSubsection from "./ReviewMasterDependenciesReviewedUserSubsection"
import ReviewMasterDependenciesReviewingUserSubsection from "./ReviewMasterDependenciesReviewingUserSubsection"

interface UpdateReviewMasterParams {
  id: string
  name: string
  userIds?: string[]
  teamIds?: string[]
}

interface Props {
  reviewMaster: ReviewMaster
  users: User[]
  teams: Team[]
  updateReviewMaster: (params: UpdateReviewMasterParams) => void
}

const ReviewMasterDependenciesSection: React.FC<Props> = props => {
  const { users, teams, reviewMaster, updateReviewMaster } = props

  return (
    <React.Fragment>
      <Section size="full">
        <SectionHeader>
          <SectionTitle title="Dependencies" size="full" />
        </SectionHeader>
        <SectionContent size="full">
          <ReviewMasterDependenciesTeamSubsection
            reviewMaster={reviewMaster}
            dependencies={teams}
            updateReviewMaster={updateReviewMaster}
          />
          <ReviewMasterDependenciesReviewedUserSubsection
            reviewMaster={reviewMaster}
            dependencies={users}
            updateReviewMaster={updateReviewMaster}
          />
          <ReviewMasterDependenciesReviewingUserSubsection
            reviewMaster={reviewMaster}
          />
        </SectionContent>
      </Section>
    </React.Fragment>
  )
}

export default ReviewMasterDependenciesSection
