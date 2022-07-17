import * as React from "react"
import { bindActionCreators, Dispatch } from "redux"
import { connect } from "react-redux"

import { actions as AuthActions } from "../src/redux/auth"

interface Props {
  authActions?: typeof AuthActions
}

class Logout extends React.Component<Props, {}> {
  componentDidMount() {
    this.props.authActions!.logout({})
  }

  render(): JSX.Element {
    return null
  }
  static mapDispatchToProps(dispatch: Dispatch<any>): Partial<Props> {
    return {
      authActions: bindActionCreators(AuthActions, dispatch)
    }
  }
}
export default connect(null, Logout.mapDispatchToProps)(Logout)
