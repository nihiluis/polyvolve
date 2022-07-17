import * as React from "react"
import { bindActionCreators, Dispatch } from "redux"
import { connect } from "react-redux"
import { Formik } from "formik"
import Link from "next/link"

import { actions as InviteActions } from "../../src/redux/invite"
import {
  Row,
  LoadButton,
  Logo,
  InfoBox,
  LightFooter,
  Error,
} from "polyvolve-ui/lib"
import * as registerStyle from "../../src/style/auth.module.scss"
import { withRouter } from "next/router"
import { SITE_NAME } from "../../src/constants/env"
import { RootState } from "../../src/redux"
import { WithRouterProps } from "next/dist/client/with-router"
import { style } from "../../src/lib/reexports"
import PInput from "../../src/components/ui/PInput"

interface Props extends WithRouterProps {
  error: string
  inviteActions: typeof InviteActions
  loading: boolean
  accepted: boolean
  authenticated: boolean
}

interface State {
  submitted: boolean
}

interface AcceptInviteData {
  nick?: string
  mail?: string
  password?: string
  confirmPassword?: string
  surname?: string
  name?: string
}

type AcceptInviteErrors = AcceptInviteData

class AcceptInvite extends React.Component<Props, State> {
  state = { submitted: false }

  onSubmit = (props: AcceptInviteData) => {
    this.setState({ submitted: true })

    this.props.inviteActions.acceptInviteRequest({
      mail: props.mail,
      password: props.password,
      nick: props.nick,
      id: this.props.router.query.inviteId,
    })
  }

  componentDidUpdate() {
    if (this.props.authenticated) {
      this.props.router.push("/")
    }
  }

  componentDidMount() {
    document.body.classList.add("body-auth")
  }

  componentWillUnmount() {
    document.body.classList.remove("body-auth")
  }

  validate(values: AcceptInviteData): AcceptInviteErrors {
    const errors: AcceptInviteErrors = {}

    // TODO add better validation here

    if (!values.nick) {
      errors.nick = "Missing name"
    } else if (values.nick.length > 32) {
      errors.nick = "Name > 16 characters"
    }

    if (!values.mail) {
      errors.mail = "Missing email"
    }

    if (!values.password) {
      errors.password = "Missing password"
    }

    return errors
  }

  render(): JSX.Element {
    const { error, loading, authenticated, accepted } = this.props

    return (
      <div className={registerStyle.auth}>
        <Logo size={48} className={registerStyle.logo} />
        <h1 className={registerStyle.authTitle}>Sign up to {SITE_NAME}</h1>
        <p className={registerStyle.authSubtitle}>
          To accept your invitation, please complete the following form.
        </p>
        <Row className={registerStyle.authWindow}>
          {!authenticated && (
            <Formik<AcceptInviteData>
              initialValues={{
                mail: "",
                password: "",
                confirmPassword: "",
                name: "",
                surname: "",
              }}
              validate={this.validate}
              onSubmit={this.onSubmit}
              render={({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
              }) => (
                <form
                  className={registerStyle.authForm}
                  onSubmit={handleSubmit}>
                  <label>Nick</label>
                  <PInput
                    className="input"
                    name="nick"
                    type="text"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.nick}
                  />
                  {touched.nick && errors.nick && <Error>{errors.nick}</Error>}
                  <label>Mail</label>
                  <PInput
                    className="input"
                    name="mail"
                    type="email"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.mail}
                  />
                  {touched.mail && errors.mail && <Error>{errors.mail}</Error>}
                  <label className={style.passLabel}>Password</label>
                  <PInput
                    className="input"
                    name="password"
                    type="password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.password}
                  />
                  {touched.password && errors.password && (
                    <Error>{errors.password}</Error>
                  )}
                  {this.state.submitted && error && <Error>{error}</Error>}
                  <div className={registerStyle.authSubmit}>
                    {error && <Error>{error}</Error>}
                    <LoadButton
                      type="submit"
                      loading={loading}
                      className={`${style.btn} ${style.btnStandard}`}>
                      Register
                    </LoadButton>
                  </div>
                </form>
              )}
            />
          )}
          {!accepted && (
            <InfoBox>
              <p>
                Already have an account?{" "}
                <Link href="/login">
                  <a>Login here.</a>
                </Link>
              </p>
            </InfoBox>
          )}
          {accepted && (
            <div>
              <p className={registerStyle.registeredMsg}>
                Successfully registered. You will receive a message for further
                verification.
              </p>
              <Link href="/login">
                <a>Login here.</a>
              </Link>
            </div>
          )}
        </Row>
        <LightFooter />
      </div>
    )
  }
}

function mapStateToProps(state: RootState): Partial<Props> {
  return {
    loading: state.invite.loading,
    accepted: state.invite.accepted,
    authenticated: state.auth.authenticated,
    error: state.invite.error,
  }
}

function mapDispatchToProps(dispatch: Dispatch<any>): Partial<Props> {
  return {
    inviteActions: bindActionCreators(InviteActions, dispatch),
  }
}

export default withRouter(
  connect<{}, {}, Props>(mapStateToProps, mapDispatchToProps)(AcceptInvite)
)
