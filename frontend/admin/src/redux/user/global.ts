import { createAction, handleActions } from "redux-actions"
import { AxiosResponse, AxiosError } from "axios"
import { take, call, put } from "redux-saga/effects"
import { axios, getErrorMessage, authenticatedHeader, defaultHeaders } from "../../lib/axios"
import { API_URL } from "../../constants/env";
import { lazyProtect } from "await-protect"
import { User, MarkedUser } from "polyvolve-ui/lib/@types"

export interface UserGlobalState {
  initialized: boolean
  updated: boolean
  loading: boolean
  error: string
  all: User[]
  marked: { [key: string]: boolean }
}

/**
 * TODO: all User specific actions should be moved to specified.ts.
 */
const actionNames = {
  LOAD_USERS_REQUEST: "LOAD_USERS_REQUEST",
  LOAD_USERS_RESPONSE: "LOAD_USERS_RESPONSE",
  REMOVE_USER_REQUEST: "REMOVE_USER_REQUEST",
  REMOVE_USER_RESPONSE: "REMOVE_USER_RESPONSE",
  LOAD_MARKED_USERS_REQUEST: "GET_MARKED_USERS_REQUEST",
  LOAD_MARKED_USERS_RESPONSE: "GET_MARKED_USERS_RESPONSE",
  ADD_MARKED_USER_REQUEST: "ADD_MARKED_USER_REQUEST",
  ADD_MARKED_USER_RESPONSE: "ADD_MARKED_USER_RESPONSE",
  REMOVE_MARKED_USER_REQUEST: "REMOVE_MARKED_USER_REQUEST",
  REMOVE_MARKED_USER_RESPONSE: "REMOVE_MARKED_USER_RESPONSE",
}

const actions = {
  loadUsersRequest: createAction<Partial<UserGlobalState>>(actionNames.LOAD_USERS_REQUEST),
  loadUsersResponse: createAction<Partial<UserGlobalState>>(actionNames.LOAD_USERS_RESPONSE),
  removeUserRequest: createAction<{ id: string }>(actionNames.REMOVE_USER_REQUEST),
  removeUserResponse: createAction<{ error: string }>(actionNames.REMOVE_USER_RESPONSE),
  loadMarkedUsersRequest: createAction<{}>(actionNames.LOAD_MARKED_USERS_REQUEST),
  loadMarkedUsersResponse: createAction<Partial<UserGlobalState>>(actionNames.LOAD_MARKED_USERS_RESPONSE),
  markUserRequest: createAction<{ id: string }>(actionNames.ADD_MARKED_USER_REQUEST),
  markUserResponse: createAction<{ id: string }>(actionNames.ADD_MARKED_USER_RESPONSE),
  unmarkUserRequest: createAction<{ id: string }>(actionNames.REMOVE_MARKED_USER_REQUEST),
  unmarkUserResponse: createAction<{ id: string }>(actionNames.REMOVE_MARKED_USER_RESPONSE),
}

export const UserGlobalActions = actions

const initialState: UserGlobalState = {
  initialized: false,
  loading: false,
  all: [],
  error: "",
  updated: false,
  marked: {}
}

export const userGlobalReducer = handleActions<UserGlobalState, Partial<UserGlobalState>>({
  [actionNames.LOAD_USERS_REQUEST]: (state, action) => {
    return {
      ...state,
      ...action.payload,
      loading: true,
    }
  },
  [actionNames.LOAD_USERS_RESPONSE]: (state, action) => {
    return {
      ...state,
      ...action.payload,
      loading: false,
      initialized: true,
    }
  },
  [actionNames.REMOVE_USER_REQUEST]: (state, action) => {
    return {
      ...state,
      ...action.payload,
      updated: false
    }
  },
  [actionNames.REMOVE_USER_RESPONSE]: (state, action) => {
    return {
      ...state,
      ...action.payload,
      updated: true
    }
  },
  [actionNames.LOAD_MARKED_USERS_REQUEST]: (state, action) => {
    return {
      ...state,
      ...action.payload,
    }
  },
  [actionNames.LOAD_MARKED_USERS_RESPONSE]: (state, action) => {
    const { markedLeaders, error } = action.payload

    const marked = {}
    for (let markedLeader of markedLeaders) {
      marked[markedLeader.leaderId] = true
    }

    return {
      ...state,
      marked,
      error
    }
  },
  [actionNames.ADD_MARKED_USER_REQUEST]: (state, action) => {
    return {
      ...state,
      ...action.payload,
    }
  },
  [actionNames.ADD_MARKED_USER_RESPONSE]: (state, action) => {
    const marked = state.marked
    const { id, error } = action.payload

    marked[id] = true

    return {
      ...state,
      marked,
      error
    }
  },
  [actionNames.REMOVE_MARKED_USER_REQUEST]: (state, action) => {
    const marked = state.marked
    const { id } = action.payload

    delete marked[id]

    return {
      ...state,
      marked
    }
  },
  [actionNames.REMOVE_MARKED_USER_RESPONSE]: (state, action) => {
    return {
      ...state,
      ...action.payload,
    }
  },
}, initialState)

export function* handleLoadUsers() {
  while (true) {
    yield take(actions.loadUsersRequest)

    const { ok, err } = yield call(lazyProtect<AxiosResponse, AxiosError>(
      axios.get(`${API_URL}/user/all`,
        { withCredentials: true, headers: { ...authenticatedHeader(), ...defaultHeaders } })))

    if (err) {
      yield put(actions.loadUsersResponse({ error: getErrorMessage(err) }))

      continue
    }

    if (ok.status != 200) {
      yield put(actions.loadUsersResponse({ error: getErrorMessage(err) }))

      continue
    }

    const all: User[] = ok.data.data

    yield put(actions.loadUsersResponse({ error: "", all }))
  }
}

export function* handleRemoveUser() {
  while (true) {
    const action = yield take(actions.removeUserRequest)
    const { id } = action.payload

    const { ok, err } = yield call(lazyProtect<AxiosResponse, AxiosError>(
      axios.post(`${API_URL}/user/delete`, { id },
        { withCredentials: true, headers: { ...authenticatedHeader(), ...defaultHeaders } })))

    if (err) {
      yield put(actions.removeUserResponse({ error: getErrorMessage(err) }))

      continue
    }

    if (ok.status != 200) {
      yield put(actions.removeUserResponse({ error: getErrorMessage(err) }))

      continue
    }

    yield put(actions.removeUserResponse({ error: "" }))
  }
}

export function* handleGetMarkedUsers() {
  while (true) {
    yield take(actions.loadMarkedUsersRequest)

    const { ok, err } = yield call(lazyProtect<AxiosResponse, AxiosError>(
      axios.get(`${API_URL}/user/mark/all`,
        { withCredentials: true, headers: { ...authenticatedHeader(), ...defaultHeaders } })))

    if (err) {
      yield put(actions.loadMarkedUsersResponse({ error: getErrorMessage(err) }))
      continue
    }

    if (ok.status != 200) {
      yield put(actions.loadMarkedUsersResponse({ error: getErrorMessage(err) }))
      continue
    }

    const all: MarkedUser[] = ok.data.data

    yield put(actions.loadMarkedUsersResponse({ markedLeaders: all }))
  }
}

export function* handleMarkUser() {
  while (true) {
    const action = yield take(actions.markUserRequest)
    const { id } = action.payload

    const { ok, err } = yield call(lazyProtect<AxiosResponse, AxiosError>(
      axios.get(`${API_URL}/user/mark/add/${id}`,
        { withCredentials: true, headers: { ...authenticatedHeader(), ...defaultHeaders } })))

    if (err) {
      yield put(actions.markUserResponse({ error: getErrorMessage(err) }))

      continue
    }

    if (ok.status != 200) {
      yield put(actions.markUserResponse({ error: getErrorMessage(err) }))

      continue
    }

    yield put(actions.markUserResponse({ error: "" }))
  }
}

export function* handleUnmarkUser() {
  while (true) {
    const action = yield take(actions.removeUserRequest)
    const { id } = action.payload

    const { ok, err } = yield call(lazyProtect<AxiosResponse, AxiosError>(
      axios.get(`${API_URL}/user/mark/remove/${id}`,
        { withCredentials: true, headers: { ...authenticatedHeader(), ...defaultHeaders } })))

    if (err) {
      yield put(actions.removeUserResponse({ error: getErrorMessage(err) }))

      continue
    }

    if (ok.status != 200) {
      yield put(actions.removeUserResponse({ error: getErrorMessage(err) }))

      continue
    }

    yield put(actions.removeUserResponse({ error: "" }))
  }
}
