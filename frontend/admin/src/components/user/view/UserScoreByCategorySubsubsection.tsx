import * as React from "react"
import { ScoreCategoryContainer, ReviewCategory } from "polyvolve-ui/lib/@types"
import Subsubsection from "../../ui/section/Subsubsection"
import SubsubsectionTitle from "../../ui/section/SubsubsectionTitle"
import SubsubsectionContent from "../../ui/section/SubsubsectionContent"
import { singleStyle } from "../../../lib/reexports"
import { Collapser } from "polyvolve-ui/lib"

interface Props {
  category: ReviewCategory
  scores: ScoreCategoryContainer
}

const UserScoreByCategorySubsubsection: React.FC<Props> = props => {
  const { category, scores } = props

  return (
    <Subsubsection key={`subsubsection-${category.id}`}>
      <SubsubsectionTitle
        title={category.name}
        key={`subsubsection-title-${category.id}`}
      />
      <SubsubsectionContent
        className={singleStyle.scoreGrid}
        key={`subsubsection-content-${category.id}`}>
        <Collapser
          title="Overall Score"
          defaultCollapsed={false}
          className={singleStyle.scoreCollapser}
          key={`subsubsection-collapser-${category.id}`}>
          <div
            className={singleStyle.scoreContainer}
            key={`subsubsection-scoreContainer-${category.id}`}>
            <div key={`subsubsection-avg${category.id}`}>
              <p key={`subsubsection-stdDev-p-${category.id}`}>Avg</p>
              <p key={`subsubsection-stdDev-p2-${category.id}`}>
                {scores.overallScore.avg.toFixed(2)}
              </p>
            </div>
            <div key={`subsubsection-stdDev-${category.id}`}>
              <p key={`subsubsection-stdDev-p-${category.id}`}>Std Dev</p>
              <p key={`subsubsection-stdDev-p2-${category.id}`}>
                {scores.overallScore.stdDev.toFixed(2)}
              </p>
            </div>
          </div>
        </Collapser>
      </SubsubsectionContent>
    </Subsubsection>
  )
}

export default UserScoreByCategorySubsubsection
