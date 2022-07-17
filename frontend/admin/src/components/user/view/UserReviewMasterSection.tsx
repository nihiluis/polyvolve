import * as React from "react"
import SectionTitle from "../../ui/section/SectionTitle"
import Section from "../../ui/section/Section"

import SectionHeader from "../../ui/section/SectionHeader"
import Subsection from "../../ui/section/Subsection"
import SubsectionTitle from "../../ui/section/SubsectionTitle"
import SectionContent from "../../ui/section/SectionContent"
import SubsectionContent from "../../ui/section/SubsectionContent"
import {
  ReviewMaster,
  Team,
  ScoreContainer,
  ScoreCategoryContainer,
} from "polyvolve-ui/lib/@types"
import SubsubsectionContainer from "../../ui/section/SubsubsectionContainer"
import { Select, componentStyle, cx, singleStyle } from "../../../lib/reexports"
import { sortByOrder } from "polyvolve-ui/lib/utils/sort"
import removeDuplicates from "../../../lib/removeDuplicates"
import UserScoreByCategorySubsubsection from "./UserScoreByCategorySubsubsection"

interface Props {
  userMasters: ReviewMaster[]
  allTeams: Team[]
  scores: ScoreContainer
}

interface State {
  activeMaster: { value: string; label: string }
}

export class UserReviewMasterSection extends React.Component<Props, State> {
  private allOption = { value: "", label: "All" }

  constructor(props: Props) {
    super(props)

    this.state = {
      activeMaster: this.allOption,
    }
  }

  render() {
    const { userMasters: masters, scores } = this.props

    const allCategories = removeDuplicates(
      masters.flatMap(master => master.schema.categories.sort(sortByOrder))
    )

    const options = [
      this.allOption,
      ...masters.map(master => ({ value: master.id, label: master.name })),
    ]

    return (
      <React.Fragment>
        <Section size="full">
          <SectionHeader>
            <SectionTitle title="Analysis summary" size="full" />
          </SectionHeader>
          <SectionContent>
            <Subsection size="full">
              <SubsectionTitle title="Metrics by category" />
              <SubsectionContent>
                <div className={singleStyle.selectByMenu}>
                  <p>Select review master</p>
                  <Select
                    className={cx(
                      componentStyle.select,
                      singleStyle.selectByMenuSelect
                    )}
                    classNamePrefix="pv"
                    options={options}
                    value={this.state.activeMaster}
                    isDisabled={true}
                  />
                </div>
                <SubsubsectionContainer>
                  {allCategories.map(category => {
                    let categoryScores: ScoreCategoryContainer | null = null
                    if (
                      scores &&
                      scores.data.hasOwnProperty("") &&
                      scores.data[""].hasOwnProperty(category.id)
                    ) {
                      categoryScores = scores.data[""][category.id]
                    }

                    return categoryScores ? (
                      <UserScoreByCategorySubsubsection
                        key={`userScoreByCategory-${category.id}`}
                        category={category}
                        scores={categoryScores}
                      />
                    ) : null
                  })}
                </SubsubsectionContainer>
              </SubsectionContent>
            </Subsection>
          </SectionContent>
        </Section>
      </React.Fragment>
    )
  }
}

export default UserReviewMasterSection
