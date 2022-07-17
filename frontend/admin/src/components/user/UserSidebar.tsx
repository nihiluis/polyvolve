import * as React from "react"
import Actions from "../ui/sidebar/Actions"
import RecentlyViewed from "../ui/sidebar/RecentlyViewed"
import { connect } from "react-redux"
import { RootState } from "../../redux"
import { Dispatch, bindActionCreators } from "redux"
import { User } from "polyvolve-ui/lib/@types"
import { UserGlobalActions, UserActiveActions } from "../../redux/user"
import Link from "next/link"
import { WithRouterProps } from "next/dist/client/with-router"
import CreateLinkModal from "./CreateLinkModal"

interface Props extends WithRouterProps {
  user?: User
  userGlobalActions?: typeof UserGlobalActions
  userActiveActions?: typeof UserActiveActions
  linkHash: string
}

interface State {
  showCreateLink: boolean
}

class UserSidebar extends React.Component<Props, State> {
  state = { showCreateLink: false }

  // this is stupid.. normal link.
  onGoToOverview = () => this.props.router.push("/overview/user")

  onDelete = () => {
    const { userGlobalActions, user, router } = this.props

    userGlobalActions!.removeUserRequest({ id: user.id })

    router.push("/overview/user")
  }

  render(): JSX.Element {
    const { user, linkHash, userActiveActions } = this.props
    const { showCreateLink } = this.state
    const reviewingMasters = user ? user.reviewingMasters : []

    return (
      <React.Fragment>
        <Actions>
          {!user && "..."}
          {user && (
            <ul>
              <li>
                <Link href="/overview/user">
                  <a>Go to overview</a>
                </Link>
              </li>
              <li>
                <a onClick={this.onDelete}>Delete user</a>
              </li>
              <li>
                <a onClick={() => {}}>Copy direct link</a>
              </li>
              <li>
                <a onClick={() => this.setState({ showCreateLink: true })}>
                  Create link
                </a>
              </li>
            </ul>
          )}
        </Actions>
        <RecentlyViewed />
        <CreateLinkModal
          show={showCreateLink}
          onClose={() => this.setState({ showCreateLink: false })}
          linkHash={linkHash}
          userActiveActions={userActiveActions}
          reviewMasters={reviewingMasters || []}
          user={user}
        />
      </React.Fragment>
    )
  }
}

function mapStateToProps(state: RootState): Partial<Props> {
  return {
    user: state.user.specified.data,
    linkHash: state.user.specified.linkHash,
  }
}

function mapDispatchToProps(dispatch: Dispatch<any>): Partial<Props> {
  return {
    userActiveActions: bindActionCreators(UserActiveActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserSidebar)
