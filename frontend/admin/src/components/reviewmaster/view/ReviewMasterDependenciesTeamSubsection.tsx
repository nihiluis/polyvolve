import * as React from "react"
import {
  MultiSelectElementMenu,
  MenuList,
  Button,
} from "polyvolve-ui/lib"

import SectionButtonBar from "../../ui/section/SectionButtonBar"
import Subsection from "../../ui/section/Subsection"
import SubsectionTitle from "../../ui/section/SubsectionTitle"
import SubsectionContent from "../../ui/section/SubsectionContent"
import SubsectionEditButton from "../../ui/section/SubsectionEditButton"
import { ReviewMaster, Team } from "polyvolve-ui/lib/@types"
import { singleStyle, formStyle } from "../../../lib/reexports"
import { TeamItem, TeamItemMenu } from "../../single/dependencies/TeamItem"

interface UpdateReviewMasterParams {
  id: string
  name: string
  teamIds: string[]
}

interface Props {
  reviewMaster: ReviewMaster
  dependencies: Team[]
  updateReviewMaster: (params: UpdateReviewMasterParams) => void
}

interface State {
  editting: boolean
  activeIds: string[]
}

export default class ReviewMasterDependenciesTeamSubsection extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      editting: false,
      activeIds: props.reviewMaster.teams
        ? props.reviewMaster.teams.map(team => team.id)
        : [],
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (
      !prevProps.reviewMaster ||
      this.props.reviewMaster.id !== prevProps.reviewMaster.id
    ) {
      this.resetActiveReviewMastersFromProps()
    }
  }

  onUpdate = (newValues: string[]) => this.setState({ activeIds: newValues })

  toggleEditting = () => {
    const newEdittingState = !this.state.editting

    // resetActiveReviewMastersFromProps
    if (!newEdittingState) {
      const { reviewMaster } = this.props

      const newObjects: { id: string }[] = reviewMaster
        ? reviewMaster.teams || []
        : []
      // TODO check how typing can be improved here.
      this.setState({
        activeIds: newObjects.map(obj => obj.id),
        editting: newEdittingState,
      })
    } else {
      this.setState({ editting: newEdittingState })
    }
  }

  resetActiveReviewMastersFromProps = () => {
    const { reviewMaster } = this.props

    const newTeams = reviewMaster ? reviewMaster.teams || [] : []

    this.setState({
      activeIds: newTeams.map(team => team.id),
    })
  }

  save = () => {
    const { reviewMaster, updateReviewMaster } = this.props
    const { activeIds: activeTeamIds } = this.state

    updateReviewMaster({
      id: reviewMaster.id,
      name: reviewMaster.name,
      teamIds: activeTeamIds,
    })
    this.setState({ editting: false })
  }

  getActiveTeams = (): Team[] =>
    this.props.dependencies.filter(
      team => this.state.activeIds.indexOf(team.id) !== -1
    )

  onSelectAll = () =>
    this.setState({ activeIds: this.props.dependencies.map(team => team.id) })
  onUnselectAll = () => this.setState({ activeIds: [] })

  render(): JSX.Element {
    const { reviewMaster, dependencies } = this.props
    const { editting } = this.state
    const activeTeams = this.getActiveTeams()

    return (
      <Subsection size="full">
        {!editting && <SubsectionTitle title="Available for Teams" />}
        {editting && <SubsectionTitle title="Select Teams" />}
        <SubsectionContent size="full">
          {!editting && (
            <MenuList innerClassName={singleStyle.selectItemContainer}>
              {activeTeams.length === 0 && (
                <p>
                  {reviewMaster.name} has currently no associated Teams. Click
                  edit to select new Teams!
                </p>
              )}
              {activeTeams.map(team => (
                <TeamItem key={`team-item-${team.id}`} team={team} />
              ))}
            </MenuList>
          )}
          {editting && dependencies.length < 80 && (
            <MultiSelectElementMenu
              values={this.state.activeIds}
              onClick={() => {}}
              disabled={!editting}
              onUpdate={this.onUpdate}
              className={singleStyle.activeSelectItemContainer}
              itemClassName={singleStyle.activeSelectItemContainerInner}
              items={dependencies.map(dependency => {
                return {
                  name: dependency.id,
                  element: TeamItemMenu,
                  props: { team: dependency },
                }
              })}
            />
          )}
          {editting && (
            <div className={formStyle.selectUnselectContainer}>
              <a
                onClick={this.onSelectAll}
                className={formStyle.selectAll}>
                Select all
              </a>
              <a
                onClick={this.onUnselectAll}
                className={formStyle.unselectAll}>
                Unselect all
              </a>
            </div>
          )}
          {editting && (
            <SectionButtonBar>
              <Button
                type="button"
                name="master-team-cancel"
                onClick={this.toggleEditting}>
                Cancel
              </Button>
              <Button
                type="button"
                name="master-team-save"
                onClick={this.save}>
                Save
              </Button>
            </SectionButtonBar>
          )}
        </SubsectionContent>
        <SubsectionEditButton
          name="dependencies-team-edit"
          toggleEditting={this.toggleEditting}
          editting={editting}
        />
      </Subsection>
    )
  }
}
