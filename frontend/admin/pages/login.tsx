import * as React from "react"
import cx from "classnames"
import { bindActionCreators, Dispatch } from "redux"
import { connect } from "react-redux"
import { Formik } from "formik"
import Router from "next/router"

import { Logo, LoadButton, LightFooter, Error } from "polyvolve-ui/lib"

import * as loginStyle from "../src/style/auth.module.scss"

import { AuthActions } from "../src/redux/auth"
import { RootState } from "../src/redux"
import { style } from "../src/lib/reexports"
import PInput from "../src/components/ui/PInput"

interface Props {
  error?: string
  actions?: typeof AuthActions
  authError?: string
  loading: boolean
  authenticated: boolean
  history: any
}

interface State {
  submitted: boolean
}

interface LoginData {
  mail?: string
  password?: string
}

type LoginDataErrors = LoginData

class Login extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = { submitted: false }
  }

  componentDidUpdate() {
    if (this.props.authenticated) {
      Router.push("/")
    }
  }

  componentDidMount() {
    this.props.actions!.authCheckRequest({})

    document.body.classList.add("body-auth")
  }

  componentWillUnmount() {
    document.body.classList.remove("body-auth")
  }

  validate = (values: LoginData): LoginDataErrors => {
    const errors: LoginData = {}

    if (!values.mail) {
      errors.mail = "Missing name"
    } else if (values.mail.length > 32) {
      errors.mail = "Name > 16 characters"
    }

    if (!values.password) {
      errors.password = "Missing password"
    }

    return errors
  }

  onSubmit = (values: LoginData) => {
    this.setState({ submitted: true })

    this.props.actions!!.loginRequest({
      mail: values.mail,
      password: values.password,
    })
  }

  touched(values: { mail: boolean; password: boolean }): boolean {
    return values.mail && values.password
  }

  render(): JSX.Element {
    const { error, loading, authError } = this.props

    return (
      <div className={loginStyle.auth}>
        <Logo size={48} className={loginStyle.logo} />
        <div className={loginStyle.authWindow}>
          <h1>Login</h1>
          <div className={loginStyle.authWindowForm}>
            <Formik<LoginData>
              initialValues={{ mail: "", password: "" }}
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
                <form className={loginStyle.authForm} onSubmit={handleSubmit}>
                  <label>Mail</label>
                  <PInput
                    name="mail"
                    type="email"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.mail}
                  />
                  {touched.mail && errors.mail && <Error>{errors.mail}</Error>}
                  <label className={style.passLabel}>Password</label>
                  <PInput
                    name="password"
                    type="password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.password}
                  />
                  {touched.password && errors.password && (
                    <Error>{errors.password}</Error>
                  )}
                  {this.state.submitted && authError && (
                    <Error>{authError}</Error>
                  )}
                  <div className={loginStyle.authSubmit}>
                    {error && <Error>{error}</Error>}
                    <LoadButton
                      type="submit"
                      loading={loading}
                      className={cx(style.btn, style.btnStandard)}>
                      Login
                    </LoadButton>
                  </div>
                </form>
              )}
            />
          </div>
        </div>
        <LightFooter />
      </div>
    )
  }
  static mapStateToProps(state: RootState): Partial<Props> {
    return {
      loading: state.auth.loading,
      authError: state.auth.error,
      authenticated: state.auth.authenticated,
    }
  }

  static mapDispatchToProps(dispatch: Dispatch<any>): Partial<Props> {
    return {
      actions: bindActionCreators(AuthActions, dispatch),
    }
  }
}

export default connect(Login.mapStateToProps, Login.mapDispatchToProps)(Login)
