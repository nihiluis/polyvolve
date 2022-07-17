import * as React from "react"
import { bindActionCreators, Dispatch } from "redux"
import { connect } from "react-redux"
import { TabMenu, TabContainer, Tab } from "polyvolve-ui/lib"

import UserInformationSection from "./UserInformationSection"
import UserDependenciesSection from "./UserDependenciesSection"
import UserReviewMasterSection from "./UserReviewMasterSection"

import { RootState } from "../../../redux"
import { UserActiveActions } from "../../../redux/user"

import { PageTitle } from "../../ui"
import { RecentlyViewedActions } from "../../../redux/recentlyviewed"

import { TeamGlobalActions } from "../../../redux/team"
import { getUserName } from "../../../lib/format"
import { ScoreContainer, User, Team } from "polyvolve-ui/lib/@types"
import { singleStyle } from "../../../lib/reexports"

interface Props {
  loading: boolean
  initialized: boolean
  user?: User
  teams: Team[]
  id?: string
  error?: string
  scores?: ScoreContainer
  activeActions?: typeof UserActiveActions
  teamGlobalActions?: typeof TeamGlobalActions
  recentlyViewedActions?: typeof RecentlyViewedActions
}

interface State {
  activeTeamIds: string[]
  editting: boolean
  activeTab: number
}

class UserView extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      activeTeamIds: [],
      editting: false,
      activeTab: 0,
    }
  }

  componentDidMount() {
    const { id, recentlyViewedActions } = this.props

    this.grabUser(id)
    this.grabAllTeams()

    // this is not type checked :/
    recentlyViewedActions!.addRecentlyViewedLocally({
      type: "USER",
      targetId: id,
    })
  }

  grabUser = (id: string) => {
    this.props.activeActions!.getUserRequest({ id })
    this.props.activeActions!.getScoresRequest({ id })
  }

  grabAllTeams = () => this.props.teamGlobalActions!.loadTeamsRequest()

  save = () => {
    this.setState({ editting: false })
  }

  updateTabIndex = (index: number) => this.setState({ activeTab: index })

  render(): JSX.Element {
    const {
      user,
      initialized,
      teams,
      loading,
      activeActions,
      scores,
    } = this.props
    const { activeTab } = this.state

    const reviewedInMasters = user ? user.reviewMasters : []
    const reviewingMasters = user ? user.reviewingMasters : []

    // this data check is lazy. improve it later.
    return (
      <React.Fragment>
        {initialized && user && (
          <div>
            <div className={singleStyle.header}>
              <PageTitle title={getUserName(user)} type={"User"} />
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
                <UserInformationSection
                  user={user}
                  updateUser={activeActions.updateUserRequest}
                  loading={loading}
                />
                <UserDependenciesSection
                  user={user}
                  allTeams={teams}
                  userMasters={reviewedInMasters}
                  reviewingMasters={reviewingMasters}
                  updateUser={activeActions.updateUserRequest}
                />
                <UserReviewMasterSection
                  userMasters={reviewedInMasters}
                  allTeams={teams}
                  scores={scores}
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
    loading: state.user.specified.loading,
    initialized: state.user.specified.initialized,
    error: state.user.specified.error,
    user: state.user.specified.data,
    teams: state.team.global.all,
    scores: state.user.specified.scores,
  }
}

function mapDispatchToProps(dispatch: Dispatch<any>): Partial<Props> {
  return {
    activeActions: bindActionCreators(UserActiveActions, dispatch),
    teamGlobalActions: bindActionCreators(TeamGlobalActions, dispatch),
    recentlyViewedActions: bindActionCreators(RecentlyViewedActions, dispatch),
  }
}

export default connect<{}, {}, Props>(
  mapStateToProps,
  mapDispatchToProps
)(UserView)
