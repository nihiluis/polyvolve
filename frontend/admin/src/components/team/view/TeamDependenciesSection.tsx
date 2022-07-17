import * as React from "react"
import SectionTitle from "../../ui/section/SectionTitle"
import Section from "../../ui/section/Section"
import {
  MultiSelectElementMenu,
  MenuList,
  Button,
} from "polyvolve-ui/lib"

import SectionButtonBar from "../../ui/section/SectionButtonBar"
import SectionHeader from "../../ui/section/SectionHeader"
import Subsection from "../../ui/section/Subsection"
import SubsectionTitle from "../../ui/section/SubsectionTitle"
import SectionContent from "../../ui/section/SectionContent"
import SubsectionContent from "../../ui/section/SubsectionContent"
import SubsectionEditButton from "../../ui/section/SubsectionEditButton"
import { ReviewMasterItem } from "../../single/dependencies/ReviewMasterItem"
import { Team, User } from "polyvolve-ui/lib/@types"
import { singleStyle } from "../../../lib/reexports"
import { UserItem, UserItemMenu } from "../../single/dependencies/UserItem"

interface UpdateTeamParams {
  id: string
  userIds: string[]
}

interface Props {
  team: Team
  users: User[]
  updateTeam: (params: UpdateTeamParams) => void
}

interface State {
  editting: boolean
  activeUserIds: string[]
}

class TeamDependenciesSection extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      editting: false,
      activeUserIds: props.team.users
        ? props.team.users.map(user => user.id)
        : [],
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (!prevProps.team || this.props.team.id !== prevProps.team.id) {
      this.resetActiveUsersFromProps()
    }
  }

  onUpdate = (newValues: string[]) =>
    this.setState({ activeUserIds: newValues })

  toggleEditting = () => {
    const newEdittingState = !this.state.editting

    // resetActiveLeadersFromProps
    if (!newEdittingState) {
      const { team } = this.props

      const newUsers = team ? team.users || [] : []
      this.setState({
        activeUserIds: newUsers.map(user => user.id),
        editting: newEdittingState,
      })
    } else {
      this.setState({ editting: newEdittingState })
    }
  }

  resetActiveUsersFromProps = () => {
    const { team } = this.props

    const newUsers = team ? team.users || [] : []
    this.setState({ activeUserIds: newUsers.map(user => user.id) })
  }

  save = () => {
    const { team, updateTeam } = this.props
    const { activeUserIds } = this.state

    updateTeam({ ...team, userIds: activeUserIds })
    this.setState({ editting: false })
  }

  getActiveUsers = (): User[] =>
    this.props.users.filter(
      user => this.state.activeUserIds.indexOf(user.id) !== -1
    )

  render(): JSX.Element {
    const { users, team } = this.props
    const { editting } = this.state
    const activeUsers = this.getActiveUsers()

    return (
      <Section size="full">
        <SectionHeader>
          <SectionTitle title="Dependencies" size="full" />
        </SectionHeader>
        <SectionContent>
          <Subsection size="full">
            {!editting && <SubsectionTitle title="Active Users" />}
            {editting && <SubsectionTitle title="Select Users" />}
            <SubsectionContent>
              {!editting && (
                <MenuList>
                  {activeUsers.length === 0 && (
                    <p>
                      {team.name} has currently no associated Users. Click edit
                      to select new Users!
                    </p>
                  )}
                  {activeUsers.map(user => (
                    <UserItem key={`user-item-${user.id}`} user={user} />
                  ))}
                </MenuList>
              )}
              {editting && users.length < 80 && (
                <MultiSelectElementMenu
                  values={this.state.activeUserIds}
                  onClick={() => {}}
                  disabled={!editting}
                  onUpdate={this.onUpdate}
                  className={singleStyle.activeSelectItemContainer}
                  itemClassName={singleStyle.activeSelectItemContainerInner}
                  items={users.map(user => {
                    return {
                      name: user.id,
                      element: UserItemMenu,
                      props: { user },
                    }
                  })}
                />
              )}
              {editting && (
                <SectionButtonBar>
                  <Button
                    type="button"
                    name="team-dependencies-section-cancel"
                    onClick={this.toggleEditting}>
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    name="team-dependencies-section-save"
                    onClick={this.save}>
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
            <SubsectionTitle title="Reviewing Review Masters" />
            <SubsectionContent>
              <MenuList>
                {team.reviewMasters.length === 0 && (
                  <p>
                    {team.name} has currently no associated Review Masters. You
                    can add Teams in the Review Master view.
                  </p>
                )}
                {team.reviewMasters.map(reviewMaster => (
                  <ReviewMasterItem
                    key={`reviewMaster-item-${reviewMaster.id}`}
                    reviewMaster={reviewMaster}
                  />
                ))}
              </MenuList>
            </SubsectionContent>
          </Subsection>
        </SectionContent>
      </Section>
    )
  }
}

export default TeamDependenciesSection
