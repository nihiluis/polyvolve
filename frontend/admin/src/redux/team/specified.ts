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
import { Team } from "polyvolve-ui/lib/@types"
import { NotificationMessageActions } from "../message"

export interface TeamSpecifiedState {
  initialized: boolean
  loading: boolean
  error: string
  data?: Team
}

const actionNames = {
  GET_TEAM_REQUEST: "GET_TEAM_REQUEST",
  GET_TEAM_RESPONSE: "GET_TEAM_RESPONSE",
  UPDATE_TEAM_REQUEST: "UPDATE_TEAM_REQUEST",
  UPDATE_TEAM_RESPONSE: "UPDATE_TEAM_RESPONSE",
}

const actions = {
  getTeamRequest: createAction<Partial<TeamSpecifiedState>>(
    actionNames.GET_TEAM_REQUEST
  ),
  getTeamResponse: createAction<Partial<TeamSpecifiedState>>(
    actionNames.GET_TEAM_RESPONSE
  ),
  updateTeamRequest: createAction<Partial<TeamSpecifiedState>>(
    actionNames.UPDATE_TEAM_REQUEST
  ),
  updateTeamResponse: createAction<Partial<TeamSpecifiedState>>(
    actionNames.UPDATE_TEAM_RESPONSE
  ),
}

export const TeamSpecifiedActions = actions

const initialState: TeamSpecifiedState = {
  initialized: false,
  loading: false,
  data: null,
  error: "",
}

export const teamSpecifiedReducer = handleActions<
  TeamSpecifiedState,
  Partial<TeamSpecifiedState>
>(
  {
    [actionNames.GET_TEAM_REQUEST]: (state, action) => {
      return {
        ...state,
        ...action.payload,
        loading: true,
      }
    },
    [actionNames.GET_TEAM_RESPONSE]: (state, action) => {
      return {
        ...state,
        ...action.payload,
        loading: false,
        initialized: true,
      }
    },
    [actionNames.UPDATE_TEAM_REQUEST]: (state, action) => {
      return {
        ...state,
        ...action.payload,
        loading: true,
      }
    },
    [actionNames.UPDATE_TEAM_RESPONSE]: (state, action) => {
      return {
        ...state,
        ...action.payload,
        loading: false,
      }
    },
  },
  initialState
)

export function* handleGetTeam() {
  while (true) {
    const action = yield take(actions.getTeamRequest)
    const { id } = action.payload

    const { ok, err } = yield call(
      lazyProtect<AxiosResponse, AxiosError>(
        axios.get(`${API_URL}/team/get/${id}`, {
          withCredentials: true,
          headers: { ...authenticatedHeader(), ...defaultHeaders },
        })
      )
    )

    if (err || ok.status != 200) {
      yield put(actions.getTeamResponse({ error: getErrorMessage(err) }))

      continue
    }

    const data = ok.data.data
    const team: Team = data.team
    team.users = data.users
    team.reviewMasters = data.reviewMasters

    yield put(actions.getTeamResponse({ error: "", data: team }))
  }
}

export function* handleUpdateTeam() {
  while (true) {
    const action = yield take(actions.updateTeamRequest)
    const { id, name, description, userIds } = action.payload
    yield put(NotificationMessageActions.info(`Updating Team ${name}...`))

    const { ok, err } = yield call(
      lazyProtect(
        axios.post(
          `${API_URL}/team/update`,
          { id, name, description, userIds },
          {
            withCredentials: true,
            headers: { ...authenticatedHeader(), ...defaultHeaders },
          }
        )
      )
    )

    if (err || ok.status != 200) {
      yield put(actions.updateTeamResponse({ error: getErrorMessage(err) }))
      yield put(
        NotificationMessageActions.info(`Unable to update Team ${name}.`)
      )
      continue
    }

    const data = ok.data.data
    const team: Team = data.team
    team.users = data.users
    team.reviewMasters = data.reviewMasters

    yield put(NotificationMessageActions.info(`Updated Team ${name}.`))

    yield put(actions.updateTeamResponse({ error: "", data: team }))
  }
}
