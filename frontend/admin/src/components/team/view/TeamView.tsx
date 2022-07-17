import * as React from "react"
import { bindActionCreators, Dispatch } from "redux"
import { connect } from "react-redux"

import { RootState } from "../../../redux"
import { TeamSpecifiedActions } from "../../../redux/team"
import { TabMenu, TabContainer, Tab } from "polyvolve-ui/lib"

import { UserGlobalActions } from "../../../redux/user"
import { PageTitle } from "../../ui"
import { RecentlyViewedActions } from "../../../redux/recentlyviewed"
import TeamInformationSection from "./TeamInformationSection"
import TeamDependenciesSection from "./TeamDependenciesSection"

import { Team, User } from "polyvolve-ui/lib/@types"
import { singleStyle } from "../../../lib/reexports"

interface Props {
  loading: boolean
  initialized: boolean
  team?: Team
  users: User[]
  id?: string
  error?: string
  teamSpecifiedActions?: typeof TeamSpecifiedActions
  userGlobalActions?: typeof UserGlobalActions
  recentlyViewedActions?: typeof RecentlyViewedActions
}

interface State {
  activeLeaderIds: string[]
  editting: boolean
  activeTab: number
}

class TeamView extends React.Component<Props, State> {
  state = {
    activeLeaderIds: [],
    editting: false,
    activeTab: 0,
  }

  componentDidMount() {
    const { id, recentlyViewedActions } = this.props

    this.grabTeam(id)
    this.grabAllUsers()

    // this is not type checked :/
    recentlyViewedActions!.addRecentlyViewedLocally({
      type: "TEAM",
      targetId: id,
    })
  }

  grabTeam = (id: string) =>
    this.props.teamSpecifiedActions!.getTeamRequest({ id })
  grabAllUsers = () => this.props.userGlobalActions!.loadUsersRequest()

  save = () => {
    this.setState({ editting: false })
  }

  updateTabIndex = (index: number) => this.setState({ activeTab: index })

  render(): JSX.Element {
    const {
      team,
      initialized,
      users,
      loading,
      teamSpecifiedActions,
    } = this.props
    const { activeTab } = this.state

    return (
      <React.Fragment>
        {initialized && (
          <div>
            <div className={singleStyle.header}>
              <PageTitle title={team.name} type={"Team"} />
            </div>
            <TabMenu
              items={["Basic", "History", "Comments"]}
              activeIndex={activeTab}
              onClick={this.updateTabIndex}
              className={singleStyle.tabMenu}
              itemClassName={singleStyle.tabMenuItem}
            />
            <TabContainer className={singleStyle.tabContainer}>
              <Tab showWhenTab={0} currentTab={activeTab}>
                <TeamInformationSection
                  team={team}
                  updateTeam={teamSpecifiedActions.updateTeamRequest}
                  loading={loading}
                />
                <TeamDependenciesSection
                  team={team}
                  users={users}
                  updateTeam={teamSpecifiedActions.updateTeamRequest}
                />
              </Tab>
            </TabContainer>
          </div>
        )}
      </React.Fragment>
    )
  }
}

function mapStateToProps(state: RootState): Props {
  return {
    loading: state.team.specified.loading,
    initialized: state.team.specified.initialized,
    error: state.team.specified.error,
    team: state.team.specified.data,
    users: state.user.global.all,
  }
}

function mapDispatchToProps(dispatch: Dispatch<any>): Partial<Props> {
  return {
    teamSpecifiedActions: bindActionCreators(TeamSpecifiedActions, dispatch),
    userGlobalActions: bindActionCreators(UserGlobalActions, dispatch),
    recentlyViewedActions: bindActionCreators(RecentlyViewedActions, dispatch),
  }
}

export default connect<{}, {}, Props>(
  mapStateToProps,
  mapDispatchToProps
)(TeamView)
