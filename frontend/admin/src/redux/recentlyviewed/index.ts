import { createAction, handleActions } from "redux-actions"
import { AxiosResponse, AxiosError } from "axios"
import { take, call, put } from "redux-saga/effects"
import { axios, getErrorMessage, authenticatedHeader, defaultHeaders } from "../../lib/axios"
import { API_URL } from "../../constants/env";
import { lazyProtect } from "await-protect"

export type RecentlyViewedType = "TEAM" | "LEADER" | "USER" | "ADMIN" | "REVIEW_MASTER"

export interface RecentlyViewedItem {
  type: RecentlyViewedType
  targetId: string
  name: string
  date?: string
}

export interface RecentlyViewedState {
  initialized: boolean
  loading: boolean
  error: string
  all: RecentlyViewedItem[]
}

const actionNames = {
  LOAD_RECENTLY_VIEWED_REQUEST: "LOAD_RECENTLY_VIEWED_REQUEST",
  LOAD_RECENTLY_VIEWED_RESPONSE: "LOAD_RECENTLY_VIEWED_RESPONSE",
  ADD_RECENTLY_VIEWED_LOCALLY: "ADD_RECENTLY_VIEWED_LOCALLY"
}

const actions = {
  loadRecentlyViewedRequest: createAction<Partial<RecentlyViewedState>>(actionNames.LOAD_RECENTLY_VIEWED_REQUEST),
  loadRecentlyViewedResponse: createAction<Partial<RecentlyViewedState>>(actionNames.LOAD_RECENTLY_VIEWED_RESPONSE),
  addRecentlyViewedLocally: createAction<Partial<RecentlyViewedState>>(actionNames.ADD_RECENTLY_VIEWED_LOCALLY),
}

export const RecentlyViewedActions = actions

const initialState: RecentlyViewedState = {
  initialized: false,
  loading: false,
  error: "",
  all: []
}

export const recentlyViewedReducer = handleActions<RecentlyViewedState, Partial<RecentlyViewedState>>({
  [actionNames.LOAD_RECENTLY_VIEWED_REQUEST]: (state, action) => {
    return {
      ...state,
      ...action.payload,
      loading: true,
    }
  },
  [actionNames.LOAD_RECENTLY_VIEWED_RESPONSE]: (state, action) => {
    return {
      ...state,
      ...action.payload,
      loading: false,
      initialized: true,
    }
  },
  [actionNames.ADD_RECENTLY_VIEWED_LOCALLY]: (state, action) => {
    const newAll: RecentlyViewedItem[] = [...state.all]
    const { type, targetId, name } = action.payload

    newAll.push({ type, targetId, name })

    return {
      ...state,
      all: newAll,
    }
  }
}, initialState)

export function* handleLoadRecentlyViewed() {
  while (true) {
    yield take(actions.loadRecentlyViewedRequest)

    const { ok, err } = yield call(lazyProtect(
      axios.get(`${API_URL}/recentlyviewed/all`,
        { withCredentials: true, headers: { ...authenticatedHeader(), ...defaultHeaders } })))

    if (err) {
      yield put(actions.loadRecentlyViewedResponse({ error: getErrorMessage(err), all: [] }))
      continue
    }

    if (ok.status != 200) {
      yield put(actions.loadRecentlyViewedResponse({ error: getErrorMessage(err), all: [] }))
      continue
    }

    const all = ok.data.data

    yield put(actions.loadRecentlyViewedResponse({ error: "", all }))
  }
}
