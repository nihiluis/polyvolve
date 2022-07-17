import { createAction, handleActions } from "redux-actions"
import { AxiosResponse, AxiosError } from "axios"
import { take, call, put } from "redux-saga/effects"
import {
  axios,
  getErrorMessage,
  authenticatedHeader,
  defaultHeaders,
} from "../../lib/axios"
import { API_URL } from "../../constants/env"
import { lazyProtect } from "await-protect"
import { UserGlobalActions } from "./global"
import { NotificationMessageActions } from "../message"
import { getUserFromNames } from "../../lib/format"

export interface UserCreationState {
  error: string
  loading: boolean
  initialized: boolean
}

export const actionNames = {
  ADD_USER_REQUEST: "ADD_USER_REQUEEST",
  ADD_USER_RESPONSE: "ADD_USER_RESPONSE",
}

export const actions = {
  addUserRequest: createAction<Partial<UserCreationState>>(
    actionNames.ADD_USER_REQUEST
  ),
  addUserResponse: createAction<Partial<UserCreationState>>(
    actionNames.ADD_USER_RESPONSE
  ),
}

export default actions
export const UserCreationActions = actions

const initialState: UserCreationState = {
  error: "",
  loading: false,
  initialized: false,
}

export const userCreationReducer = handleActions<
  UserCreationState,
  Partial<UserCreationState>
>(
  {
    [actionNames.ADD_USER_REQUEST]: (state, action) => {
      return {
        ...state,
        ...action.payload,
        loading: true,
        initialized: false,
      }
    },
    [actionNames.ADD_USER_RESPONSE]: (state, action) => {
      return {
        ...state,
        ...action.payload,
        loading: false,
        initialized: true,
      }
    },
  },
  initialState
)

export function* handleCreateUser() {
  while (true) {
    const action = yield take(actions.addUserRequest)
    const { name, surname, mail, position, sex } = action.payload
    const userName = getUserFromNames(name, surname)

    yield put(NotificationMessageActions.info(`Creating user ${userName}...`))

    const { ok, err } = yield call(
      lazyProtect<AxiosResponse, AxiosError>(
        axios.post(
          `${API_URL}/user/create`,
          { name, surname, mail, position, sex },
          {
            withCredentials: true,
            headers: { ...authenticatedHeader(), ...defaultHeaders },
          }
        )
      )
    )

    if (err) {
      yield put(actions.addUserResponse({ error: getErrorMessage(err) }))
      yield put(
        NotificationMessageActions.info(`Unable to create user ${userName}.`)
      )
      // TODO Add debug and specify error.

      continue
    }

    if (ok.status != 200) {
      yield put(actions.addUserResponse({ error: getErrorMessage(err) }))
      yield put(
        NotificationMessageActions.info(`Unable to create user ${userName}.`)
      )
      // TODO Add debug and specify error.

      continue
    }

    yield put(actions.addUserResponse({ error: "" }))
    yield put(NotificationMessageActions.info(`Created user ${userName}.`))
    yield put(UserGlobalActions.loadUsersRequest())
    yield put(NotificationMessageActions.info(`Reloading user state...`))
  }
}
