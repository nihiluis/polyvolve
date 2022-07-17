import * as React from "react"
import { bindActionCreators, Dispatch } from "redux"
import { connect } from "react-redux"
import { Button } from "polyvolve-ui/lib"
import { Icon } from "polyvolve-ui/lib/icons"
import { User } from "polyvolve-ui/lib/@types"
import Link from "next/link"

import { RootState } from "../../../redux"
import { UserGlobalActions, UserCreationActions } from "../../../redux/user"
import UserCreation from "./UserCreation"

import { getUserName } from "../../../lib/format"
import SortableOverview from "../../utils/SortableOverview"

import * as removeSvg from "../../../assets/icons/trash2.svg"
import * as starSvg from "../../../assets/icons/star.svg"
import { overviewStyle } from "../../../lib/reexports"

interface Props {
  loading: boolean
  initialized: boolean
  updated: boolean
  all: User[]
  error?: string
  userGlobalActions?: typeof UserGlobalActions
  userCreationActions?: typeof UserCreationActions
  addUserInitialized: boolean
}

interface State {
  showAddUser: boolean
}

class UserOverview extends React.Component<Props, State> {
  addUserRef: React.Ref<any> = React.createRef()
  state = { showAddUser: false }

  componentDidMount() {
    this.props.userGlobalActions!.loadUsersRequest({})
    this.props.userGlobalActions!.loadMarkedUsersRequest({})
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.addUserInitialized !== prevProps.addUserInitialized) {
      this.setState({ showAddUser: false })
    }
    /*

    if (this.props.updated && !prevProps.updated) {
      this.props.userGlobalActions!.loadUsersRequest({})
    }
    */
  }

  clickRemoveUser = (user: User) => {
    this.props.userGlobalActions!.removeUserRequest({ id: user.id })
  }

  render(): JSX.Element {
    const {
      all,
      initialized,
      loading,
      userCreationActions,
    } = this.props

    return initialized ? (
      <div>
        <h1 className={overviewStyle.pageTitle}>User overview</h1>
        <SortableOverview<User>
          filters={[{ name: "Name", filterItem: () => [] }]}
          items={all}
          renderItem={user => (
            <div className={overviewStyle.listItem}>
              <div className={overviewStyle.rowItem}>
                <Link
                  key={`user-list-item-${user.id}-name`}
                  href={`/user/[userId]`}
                  as={`/user/${user.id}`}>
                  <a>{getUserName(user)}</a>
                </Link>
                <Icon
                  key={`user-list-item-${user.id}-toggle-mark`}
                  src={starSvg}
                  size={{ width: 16, height: 16 }}
                  title="Favorite User"
                  className={""}
                  onClick={() => {}}
                />
                <Icon
                  key={`user-list-item-${user.id}-remove`}
                  src={removeSvg}
                  size={{ width: 16, height: 16 }}
                  title="Remove User"
                  className={""}
                  onClick={() => this.clickRemoveUser(user)}
                />
              </div>
              <div>
                <p>{user.position}</p>
              </div>
            </div>
          )}
        />
        <div className={overviewStyle.buttonBarWithAdd}>
          <Button
            ref={this.addUserRef}
            name="add-user"
            onClick={() => this.setState({ showAddUser: true })}>
            Add new User
          </Button>
        </div>
        <UserCreation
          userCreationActions={userCreationActions!}
          show={this.state.showAddUser}
          onClose={() => this.setState({ showAddUser: false })}
          loading={loading}
        />
      </div>
    ) : null
  }
}

function mapStateToProps(state: RootState): Props {
  return {
    loading: state.user.global.loading,
    initialized: state.user.global.initialized,
    addUserInitialized: state.user.creation.initialized,
    error: state.user.creation.error,
    updated: state.user.global.updated,
    all: state.user.global.all,
  }
}

function mapDispatchToProps(dispatch: Dispatch<any>): Partial<Props> {
  return {
    userGlobalActions: bindActionCreators(UserGlobalActions, dispatch),
    userCreationActions: bindActionCreators(UserCreationActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserOverview)
