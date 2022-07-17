import * as React from "react"
import { RecentlyViewedActions } from "../../redux/recentlyviewed";
import { connect } from "react-redux";
import { Dispatch, bindActionCreators } from "redux";
import { SchemaActions } from "../../redux/schema";

interface Props {
  recentlyViewedActions?: typeof RecentlyViewedActions
  schemaActions?: typeof SchemaActions
}

class DataLoader extends React.Component<Props> {
  componentDidMount() {
    const {
      recentlyViewedActions,
      schemaActions
    } = this.props

    recentlyViewedActions!.loadRecentlyViewedRequest()
    schemaActions!.getSchemasRequest()
  }

  render(): JSX.Element {
    return (
      <React.Fragment>
        {this.props.children}
      </React.Fragment>)
  }
}

function mapDispatchToProps(dispatch: Dispatch<any>): Partial<Props> {
  return {
    recentlyViewedActions: bindActionCreators(RecentlyViewedActions, dispatch),
    schemaActions: bindActionCreators(SchemaActions, dispatch),
  }
}

export default connect(null, mapDispatchToProps)(DataLoader)
