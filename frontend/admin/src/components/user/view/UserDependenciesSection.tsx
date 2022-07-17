import * as React from "react"
import SectionTitle from "../../ui/section/SectionTitle"
import Section from "../../ui/section/Section"
import { MultiSelectElementMenu, MenuList, Button } from "polyvolve-ui/lib"

import * as singleStyle from "../../../style/single.module.scss"
import SectionButtonBar from "../../ui/section/SectionButtonBar"
import SectionHeader from "../../ui/section/SectionHeader"
import Subsection from "../../ui/section/Subsection"
import SubsectionTitle from "../../ui/section/SubsectionTitle"
import SectionContent from "../../ui/section/SectionContent"
import SubsectionContent from "../../ui/section/SubsectionContent"
import SubsectionEditButton from "../../ui/section/SubsectionEditButton"
import { TeamItem, TeamItemMenu } from "../../single/dependencies/TeamItem"
import { ReviewMaster, Team, User } from "polyvolve-ui/lib/@types"
import { ReviewMasterItem } from "../../single/dependencies/ReviewMasterItem"
import { getUserName } from "../../../lib/format"

interface UpdateUserParams {
  id: string
  teamIds: string[]
}

interface Props {
  user: User
  allTeams: Team[]
  userMasters: ReviewMaster[]
  reviewingMasters: ReviewMaster[]
  updateUser: (params: UpdateUserParams) => void
}

interface State {
  editting: boolean
  activeTeamIds: string[]
}

class UserDependenciesSection extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      editting: false,
      activeTeamIds: props.user.teams
        ? props.user.teams.map(team => team.id)
        : [],
    }
  }

  onUpdate = (newValues: string[]) =>
    this.setState({ activeTeamIds: newValues })

  toggleEditting = () => {
    const newEdittingState = !this.state.editting

    // resetActiveLeadersFromProps
    if (!newEdittingState) {
      const { user: data } = this.props

      const newTeams = data ? data.teams || [] : []
      this.setState({
        activeTeamIds: newTeams.map(team => team.id),
        editting: newEdittingState,
      })
    } else {
      this.setState({ editting: newEdittingState })
    }
  }

  resetActiveLeadersFromProps = () => {
    const { user: data } = this.props

    const newTeams = data ? data.teams || [] : []
    this.setState({ activeTeamIds: newTeams.map(team => team.id) })
  }

  save = () => {
    const { user: data, updateUser } = this.props
    const { activeTeamIds } = this.state

    updateUser({ ...data, teamIds: activeTeamIds })
    this.setState({ editting: false })
  }

  getActiveTeams = (): Team[] =>
    this.props.allTeams.filter(
      team => this.state.activeTeamIds.indexOf(team.id) !== -1
    )

  render(): JSX.Element {
    const {
      allTeams: teams,
      user,
      userMasters: masters,
      reviewingMasters,
    } = this.props
    const { editting } = this.state
    const activeTeams = this.getActiveTeams()

    return (
      <React.Fragment>
        <Section size="full">
          <SectionHeader>
            <SectionTitle title="Dependencies" size="full" />
          </SectionHeader>
          <SectionContent>
            <Subsection size="full">
              {!editting && <SubsectionTitle title="Teams" />}
              {editting && <SubsectionTitle title="Select Teams" />}
              <SubsectionContent>
                {!editting && (
                  <MenuList innerClassName={singleStyle.selectItemContainer}>
                    {activeTeams.length === 0 && (
                      <p>
                        {getUserName(user)} has currently no associated teams.
                        Click edit to select new teams!
                      </p>
                    )}
                    {activeTeams.map(team => (
                      <TeamItem key={`team-item-${team.id}`} team={team} />
                    ))}
                  </MenuList>
                )}
                {editting && teams.length < 80 && (
                  <MultiSelectElementMenu
                    values={this.state.activeTeamIds}
                    onClick={() => {}}
                    disabled={!editting}
                    onUpdate={this.onUpdate}
                    className={singleStyle.activeSelectItemContainer}
                    itemClassName={singleStyle.activeSelectItemContainerInner}
                    items={teams.map(team => {
                      return {
                        name: team.id,
                        element: TeamItemMenu,
                        props: { team },
                      }
                    })}
                  />
                )}
                {editting && (
                  <SectionButtonBar>
                    <Button
                      type="button"
                      name="teams-cancel"
                      onClick={this.toggleEditting}>
                      Cancel
                    </Button>
                    <Button type="button" name="teams-save" onClick={this.save}>
                      Save
                    </Button>
                  </SectionButtonBar>
                )}
              </SubsectionContent>
              <SubsectionEditButton
                name="dependencies-edit"
                toggleEditting={this.toggleEditting}
                editting={editting}
              />
            </Subsection>
            <Subsection size="full">
              <SubsectionTitle title="Reviewed in" />
              <SubsectionContent>
                <MenuList innerClassName={singleStyle.selectItemContainer}>
                  {masters.map(master => (
                    <ReviewMasterItem
                      key={`master-item-${master.id}`}
                      reviewMaster={master}
                    />
                  ))}
                </MenuList>
              </SubsectionContent>
            </Subsection>
            <Subsection size="full">
              <SubsectionTitle title="Reviewing" />
              <SubsectionContent>
                <MenuList innerClassName={singleStyle.selectItemContainer}>
                  {reviewingMasters.map(master => (
                    <ReviewMasterItem
                      key={`reviewing-master-item-${master.id}`}
                      reviewMaster={master}
                    />
                  ))}
                </MenuList>
              </SubsectionContent>
            </Subsection>
          </SectionContent>
        </Section>
      </React.Fragment>
    )
  }
}

export default UserDependenciesSection
