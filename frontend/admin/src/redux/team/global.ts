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
import { sortBySurname } from "polyvolve-ui/lib/utils/sort"

export interface TeamOverviewState {
  initialized: boolean
  updated: boolean
  loading: boolean
  error: string
  all: Team[]
}

const actionNames = {
  LOAD_TEAMS_REQUEST: "LOAD_TEAMS_REQUEST",
  LOAD_TEAMS_RESPONSE: "LOAD_TEAMS_RESPONSE",
  REMOVE_TEAM_REQUEST: "REMOVE_TEAM_REQUEST",
  REMOVE_TEAM_RESPONSE: "REMOVE_TEAM_RESPONSE",
}

const actions = {
  loadTeamsRequest: createAction<Partial<TeamOverviewState>>(
    actionNames.LOAD_TEAMS_REQUEST
  ),
  loadTeamsResponse: createAction<Partial<TeamOverviewState>>(
    actionNames.LOAD_TEAMS_RESPONSE
  ),
  removeTeamRequest: createAction<{ id: string }>(
    actionNames.REMOVE_TEAM_REQUEST
  ),
  removeTeamResponse: createAction<{ error: string }>(
    actionNames.REMOVE_TEAM_RESPONSE
  ),
}

export const TeamGlobalActions = actions

const initialState: TeamOverviewState = {
  initialized: false,
  loading: false,
  all: [],
  error: "",
  updated: false,
}

export const teamOverviewReducer = handleActions<
  TeamOverviewState,
  Partial<TeamOverviewState>
>(
  {
    [actionNames.LOAD_TEAMS_REQUEST]: (state, action) => {
      return {
        ...state,
        ...action.payload,
        loading: true,
      }
    },
    [actionNames.LOAD_TEAMS_RESPONSE]: (state, action) => {
      return {
        ...state,
        ...action.payload,
        loading: false,
        initialized: true,
      }
    },
    [actionNames.REMOVE_TEAM_REQUEST]: (state, action) => {
      return {
        ...state,
        ...action.payload,
        updated: false,
      }
    },
    [actionNames.REMOVE_TEAM_RESPONSE]: (state, action) => {
      return {
        ...state,
        ...action.payload,
        updated: true,
      }
    },
  },
  initialState
)

export function* handleLoadTeamData() {
  while (true) {
    yield take(actions.loadTeamsRequest)

    const { ok, err } = yield call(
      lazyProtect<AxiosResponse, AxiosError>(
        axios.get(`${API_URL}/team/all`, {
          withCredentials: true,
          headers: { ...authenticatedHeader(), ...defaultHeaders },
        })
      )
    )

    if (err) {
      yield put(actions.loadTeamsResponse({ error: getErrorMessage(err) }))

      continue
    }

    if (ok.status != 200) {
      yield put(actions.loadTeamsResponse({ error: getErrorMessage(err) }))

      continue
    }

    const all: Team[] = ok.data.data
    all.forEach(team => {
      if (team.users) {
        team.users.sort(sortBySurname)
      }
    })

    yield put(actions.loadTeamsResponse({ error: "", all }))
  }
}

export function* handleRemoveTeam() {
  while (true) {
    const action = yield take(actions.removeTeamRequest)
    const { id } = action.payload

    const { ok, err } = yield call(
      lazyProtect<AxiosResponse, AxiosError>(
        axios.post(
          `${API_URL}/team/delete`,
          { id },
          {
            withCredentials: true,
            headers: { ...authenticatedHeader(), ...defaultHeaders },
          }
        )
      )
    )

    if (err) {
      yield put(actions.removeTeamResponse({ error: getErrorMessage(err) }))

      continue
    }

    if (ok.status != 200) {
      yield put(actions.removeTeamResponse({ error: getErrorMessage(err) }))

      continue
    }

    yield put(actions.removeTeamResponse({ error: "" }))
  }
}
