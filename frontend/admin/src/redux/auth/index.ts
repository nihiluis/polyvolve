import { createAction, handleActions } from "redux-actions"
import { AxiosResponse, AxiosError } from "axios"
import { take, call, put } from "redux-saga/effects"
import { axios, getErrorMessage, authenticatedHeader, defaultHeaders } from "../../lib/axios"
import { API_URL } from "../../constants/env";
import { lazyProtect } from "await-protect"
import { clearToken, saveToken } from "../../lib/storage";

// Test Account
// Mail: info@nihiluis.com
// Password: v~nuv4<kB

export interface AuthState {
  initialized: boolean
  authenticated: boolean
  loading: boolean
  mail: string
  password: string
  error: string
}

export const actionNames = {
  LOGIN_RESPONSE: "LOGIN_RESPONSE",
  LOGIN_REQUEST: "LOGIN_REQUEST",
  LOGOUT: "LOGOUT",
  AUTH_CHECK_REQUEST: "AUTH_CHECK_REQUEST",
  AUTH_CHECK_RESPONSE: "AUTH_CHECK_RESPONSE"
}

export const actions = {
  loginResponse: createAction<Partial<AuthState>>(actionNames.LOGIN_RESPONSE),
  loginRequest: createAction<Partial<AuthState>>(actionNames.LOGIN_REQUEST),
  authCheckRequest: createAction<Partial<AuthState>>(actionNames.AUTH_CHECK_REQUEST),
  authCheckResponse: createAction<Partial<AuthState>>(actionNames.AUTH_CHECK_RESPONSE),
  logout: createAction<Partial<AuthState>>(actionNames.LOGOUT),
}
export const AuthActions = actions

export default actions

const initialState: AuthState = {
  initialized: false,
  loading: false,
  authenticated: false,
  mail: "",
  password: "",
  error: ""
}

export const reducer = handleActions<AuthState, Partial<AuthState>>({
  [actionNames.AUTH_CHECK_REQUEST]: (state, action) => {
    return {
      ...state,
      ...action.payload,
      loading: true,
    }
  },
  [actionNames.AUTH_CHECK_RESPONSE]: (state, action) => {
    return {
      ...state,
      ...action.payload,
      loading: false,
      checked: true,
      initialized: true,
    }
  },
  [actionNames.LOGIN_REQUEST]: (state, action) => {
    return {
      ...state,
      ...action.payload,
      loading: true,
    }
  },
  [actionNames.LOGIN_RESPONSE]: (state, action) => {
    return {
      ...state,
      ...action.payload,
      loading: false,
      initialized: true,
    }
  },
  [actionNames.LOGOUT]: () => {
    return {
      registered: false,
      loading: false,
      authenticated: false,
      initialized: false,
    }
  }
}, initialState)

export function* handleLogin() {
  while (true) {
    const action = yield take(actions.loginRequest)

    const res = yield call(lazyProtect<AxiosResponse, AxiosError>(
      axios.post(`${API_URL}/login`,
        { mail: action.payload.mail, password: action.payload.password },
        { withCredentials: true })))

    if (res.err) {
      yield put(actions.loginResponse({ error: getErrorMessage(res.err) }))

      continue
    }

    const token = (res.ok as AxiosResponse).headers["authorization"].split(" ")[1]
    if (!token) {
      yield put(actions.loginResponse({ error: "Unable to retrieve token." }))

      continue
    }

    saveToken(token)

    yield put(actions.loginResponse({ error: "", authenticated: true }))
  }
}

export function* handleLogout() {
  while (true) {
    yield take(actions.logout)

    clearToken()
  }
}

export function* handleAuthCheck() {
  while (true) {
    yield take(actions.authCheckRequest)
    const rest = axios.get(`${API_URL}/auth/dummy`, {
      headers: { ...authenticatedHeader(), ...defaultHeaders }
    })

    const { err } = yield call(lazyProtect<AxiosResponse, AxiosError>(rest))
    if (err) {
      yield put(actions.authCheckResponse({ authenticated: false }))
      continue
    }

    yield put(actions.authCheckResponse({ authenticated: true }))
  }
}


