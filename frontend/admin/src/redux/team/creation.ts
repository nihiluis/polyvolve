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
import { NotificationMessageActions } from "../message"
import { TeamGlobalActions } from "./global"

export interface TeamCreationState {
  error: string
  loading: boolean
  initialized: boolean
}

const actionNames = {
  CREATE_TEAM_REQUEST: "CREATE_TEAM_REQUEST",
  CREATE_TEAM_RESPONSE: "CREATE_TEAM_RESPONSE",
}

const actions = {
  createTeamRequest: createAction<Partial<TeamCreationState>>(
    actionNames.CREATE_TEAM_REQUEST
  ),
  createTeamResponse: createAction<Partial<TeamCreationState>>(
    actionNames.CREATE_TEAM_RESPONSE
  ),
}

export const TeamCreationActions = actions

const initialState: TeamCreationState = {
  error: "",
  loading: false,
  initialized: false,
}

export const teamCreateReducer = handleActions<
  TeamCreationState,
  Partial<TeamCreationState>
>(
  {
    [actionNames.CREATE_TEAM_REQUEST]: (state, action) => {
      return {
        ...state,
        ...action.payload,
        loading: true,
      }
    },
    [actionNames.CREATE_TEAM_RESPONSE]: (state, action) => {
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

export function* handleCreateTeam() {
  while (true) {
    const action = yield take(actions.createTeamRequest)
    const { name, description } = action.payload

    yield put(NotificationMessageActions.info(`Creating Team ${name}...`))
    const { ok, err } = yield call(
      lazyProtect<AxiosResponse, AxiosError>(
        axios.post(
          `${API_URL}/team/create`,
          { name, description },
          {
            withCredentials: true,
            headers: { ...authenticatedHeader(), ...defaultHeaders },
          }
        )
      )
    )

    if (err) {
      yield put(actions.createTeamResponse({ error: getErrorMessage(err) }))

      continue
    }

    if (ok.status != 200) {
      yield put(actions.createTeamResponse({ error: getErrorMessage(err) }))
      yield put(
        NotificationMessageActions.info(`Unable to create Team ${name}.`)
      )
      continue
    }

    yield put(NotificationMessageActions.info(`Created Team ${name}.`))
    yield put(actions.createTeamResponse({ error: "" }))
    yield put(NotificationMessageActions.info(`Reloading Team state...`))
    yield put(TeamGlobalActions.loadTeamsRequest())
  }
}
