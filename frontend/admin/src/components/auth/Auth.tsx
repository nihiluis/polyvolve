import * as React from "react"
import { bindActionCreators, Dispatch } from "redux"
import { connect } from "react-redux"
import { withRouter } from "next/router"

import { actions as AuthActions } from "../../redux/auth"
import { AdminOverviewActions as AdminActions } from "../../redux/admin/overview"
import { RootState } from "../../redux"
import { WithRouterProps } from "next/dist/client/with-router"
import AuthLoadingScreen from "./AuthLoadingScreen"

interface Props extends WithRouterProps {
  authenticated?: boolean
  loading?: boolean
  mail?: string
  adminInitialized?: boolean
  authInitialized?: boolean
  error?: string
  adminActions?: typeof AdminActions
  authActions?: typeof AuthActions
}

class Auth extends React.Component<Props, {}> {
  static defaultProps = {
    authenticated: false,
    loading: true,
    error: "",
    adminInitialized: false,
    authInitialized: false,
  }

  componentDidMount() {
    const {
      authenticated,
      loading,
      authActions,
      adminActions,
      adminInitialized,
    } = this.props

    if (!authenticated && !loading) {
      authActions!.authCheckRequest({})
    } else if (authenticated && !adminInitialized) {
      adminActions!.loadAdminRequest({})
    }
  }

  componentDidUpdate() {
    const {
      authenticated,
      authInitialized,
      adminInitialized,
      adminActions,
      router,
    } = this.props

    if (!authenticated && authInitialized) router.push("/login")
    if (!adminInitialized) adminActions.loadAdminRequest()
  }

  render(): JSX.Element {
    const { children, authenticated } = this.props
    return authenticated ? (
      <React.Fragment>{children}</React.Fragment>
    ) : (
      <AuthLoadingScreen />
    )
  }
}

function mapStateToProps(state: RootState): Partial<Props> {
  return {
    authenticated: state.auth.authenticated,
    loading: state.auth.loading,
    authInitialized: state.auth.initialized,
    adminInitialized: state.admin.global.initialized,
    mail: state.auth.mail,
    error: state.auth.error,
  }
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {
    adminActions: bindActionCreators(AdminActions, dispatch),
    authActions: bindActionCreators(AuthActions, dispatch),
  }
}

export default withRouter(
  connect<{}, {}, Props>(mapStateToProps, mapDispatchToProps)(Auth)
)
