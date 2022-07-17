import * as React from "react"
import { bindActionCreators, Dispatch } from "redux"
import { connect } from "react-redux"

import { RootState } from "../../../redux"
import { ReviewMasterSpecifiedActions } from "../../../redux/review/master"
import { TabMenu, TabContainer, Tab } from "polyvolve-ui/lib"

import { PageTitle } from "../../ui"
import { RecentlyViewedActions } from "../../../redux/recentlyviewed"
import ReviewMasterInformationSection from "./ReviewMasterInformationSection"

import ReviewMasterDependenciesSection from "./ReviewMasterDependenciesSection"
import { ReviewMaster, User, Team } from "polyvolve-ui/lib/@types"
import { UserGlobalActions } from "../../../redux/user"
import { singleStyle } from "../../../lib/reexports"
import { TeamGlobalActions } from "../../../redux/team"

interface Props {
  loading: boolean
  initialized: boolean
  reviewMaster?: ReviewMaster
  users: User[]
  teams: Team[]
  id?: string
  error?: string
  reviewMasterSpecifiedActions?: typeof ReviewMasterSpecifiedActions
  recentlyViewedActions?: typeof RecentlyViewedActions
  userGlobalActions?: typeof UserGlobalActions
  teamGlobalActions?: typeof TeamGlobalActions
}

interface State {
  activeUserIds: string[]
  editting: boolean
  activeTab: number
}

class ReviewMasterView extends React.Component<Props, State> {
  state = {
    activeUserIds: [],
    editting: false,
    activeTab: 0,
  }

  componentDidMount() {
    const { id, recentlyViewedActions } = this.props

    if (!id) return
    this.grabReviewMaster(id)
    this.grabAllUsers()
    this.grabAllTeams()

    // this is not type checked :/
    recentlyViewedActions!.addRecentlyViewedLocally({
      type: "REVIEW_MASTER",
      targetId: id,
    })
  }

  grabReviewMaster = (id: string) =>
    this.props.reviewMasterSpecifiedActions!.getReviewMasterRequest({ id })
  grabAllUsers = () => this.props.userGlobalActions!.loadUsersRequest()
  grabAllTeams = () => this.props.teamGlobalActions!.loadTeamsRequest()

  save = () => {
    this.setState({ editting: false })
  }

  updateTabIndex = (index: number) => this.setState({ activeTab: index })

  render(): JSX.Element {
    const {
      reviewMaster,
      initialized,
      users,
      teams,
      loading,
      reviewMasterSpecifiedActions,
    } = this.props
    const { activeTab } = this.state

    // this data check is lazy. improve it later.
    return (
      <React.Fragment>
        {initialized && reviewMaster && (
          <div>
            <div className={singleStyle.header}>
              <PageTitle
                title={reviewMaster.name}
                type="REVIEW_MASTER"
                typeName={"Review Master"}
              />
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
                <ReviewMasterInformationSection
                  reviewMaster={reviewMaster}
                  updateReviewMaster={
                    reviewMasterSpecifiedActions.updateReviewMasterRequest
                  }
                  loading={loading}
                />
                <ReviewMasterDependenciesSection
                  reviewMaster={reviewMaster}
                  users={users}
                  teams={teams}
                  updateReviewMaster={
                    reviewMasterSpecifiedActions.updateReviewMasterRequest
                  }
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
    loading: state.review.master.specified.loading,
    initialized: state.review.master.specified.initialized,
    error: state.review.master.specified.error,
    reviewMaster: state.review.master.specified.data,
    users: state.user.global.all,
    teams: state.team.global.all,
  }
}

function mapDispatchToProps(dispatch: Dispatch<any>): Partial<Props> {
  return {
    reviewMasterSpecifiedActions: bindActionCreators(
      ReviewMasterSpecifiedActions,
      dispatch
    ),
    userGlobalActions: bindActionCreators(UserGlobalActions, dispatch),
    teamGlobalActions: bindActionCreators(TeamGlobalActions, dispatch),
    recentlyViewedActions: bindActionCreators(RecentlyViewedActions, dispatch),
  }
}

export default connect<{}, {}, Props>(
  mapStateToProps,
  mapDispatchToProps
)(ReviewMasterView)
