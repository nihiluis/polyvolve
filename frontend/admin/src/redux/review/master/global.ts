import { createAction, handleActions } from "redux-actions"
import { AxiosResponse, AxiosError } from "axios"
import { take, call, put } from "redux-saga/effects"
import { axios, getErrorMessage, authenticatedHeader, defaultHeaders } from "../../../lib/axios"
import { lazyProtect } from "await-protect"
import { API_URL } from "../../../constants/env";
import { transformReviewMaster } from "./util";
import { NotificationMessageActions } from "../../message";
import { ReviewMaster } from "polyvolve-ui/lib/@types"

export interface ReviewMasterGlobalState {
  initialized: boolean
  updated: boolean
  loading: boolean
  error: string
  all: ReviewMaster[]
}

const actionNames = {
  LOAD_REVIEW_MASTERS_REQUEST: "LOAD_REVIEW_MASTERS_REQUEST",
  LOAD_REVIEW_MASTERS_RESPONSE: "LOAD_REVIEW_MASTERS_RESPONSE",
  REMOVE_REVIEW_MASTER_REQUEST: "REMOVE_REVIEW_MASTER_REQUEST",
  REMOVE_REVIEW_MASTER_RESPONSE: "REMOVE_REVIEW_MASTER_RESPONSE",
  TRIGGER_REMINDER_REQUEST: "TRIGGER_REMINDER_REQUEST",
  TRIGGER_REMINDER_RESPONSE: "TRIGGER_REMINDER_RESPONSE",
}

const actions = {
  loadReviewMastersRequest: createAction<Partial<ReviewMasterGlobalState>>(actionNames.LOAD_REVIEW_MASTERS_REQUEST),
  loadReviewMastersResponse: createAction<Partial<ReviewMasterGlobalState>>(actionNames.LOAD_REVIEW_MASTERS_RESPONSE),
  removeReviewMasterRequest: createAction<{ id: string }>(actionNames.REMOVE_REVIEW_MASTER_REQUEST),
  removeReviewMasterResponse: createAction<{ error: string }>(actionNames.REMOVE_REVIEW_MASTER_RESPONSE),
  triggerReminderRequest: createAction<{ id: string }>(actionNames.TRIGGER_REMINDER_REQUEST),
  triggerReminderResponse: createAction<{ error: string }>(actionNames.TRIGGER_REMINDER_RESPONSE),
}

export const ReviewMasterGlobalActions = actions

const initialState: ReviewMasterGlobalState = {
  initialized: false,
  loading: false,
  all: [],
  error: "",
  updated: false,
}

export const reviewMasterOverviewReducer = handleActions<ReviewMasterGlobalState, Partial<ReviewMasterGlobalState>>({
  [actionNames.LOAD_REVIEW_MASTERS_REQUEST]: (state, action) => {
    return {
      ...state,
      ...action.payload,
      loading: true,
    }
  },
  [actionNames.LOAD_REVIEW_MASTERS_RESPONSE]: (state, action) => {
    return {
      ...state,
      ...action.payload,
      loading: false,
      initialized: true,
    }
  },
  [actionNames.REMOVE_REVIEW_MASTER_REQUEST]: (state, action) => {
    return {
      ...state,
      ...action.payload,
      updated: false
    }
  },
  [actionNames.REMOVE_REVIEW_MASTER_RESPONSE]: (state, action) => {
    return {
      ...state,
      ...action.payload,
      updated: true
    }
  },
  [actionNames.TRIGGER_REMINDER_REQUEST]: (state, action) => {
    return {
      ...state,
      ...action.payload,
      updated: false
    }
  },
  [actionNames.TRIGGER_REMINDER_RESPONSE]: (state, action) => {
    return {
      ...state,
      ...action.payload,
      updated: true
    }
  },
}, initialState)

export function* handleLoadReviewMasters() {
  while (true) {
    yield take(actions.loadReviewMastersRequest)

    const { ok, err } = yield call(lazyProtect<AxiosResponse, AxiosError>(
      axios.get(`${API_URL}/review/master/all`,
        { withCredentials: true, headers: { ...authenticatedHeader(), ...defaultHeaders } })))

    if (err) {
      yield put(actions.loadReviewMastersResponse({ error: getErrorMessage(err) }))
      continue
    }

    if (ok.status != 200) {
      yield put(actions.loadReviewMastersResponse({ error: getErrorMessage(err) }))
      continue
    }


    const reviewMasters = ok.data.data.map(reviewMasterOriginal => transformReviewMaster(reviewMasterOriginal))

    yield put(actions.loadReviewMastersResponse({ error: "", all: reviewMasters }))
  }
}

export function* handleRemoveReviewMaster() {
  while (true) {
    const action = yield take(actions.removeReviewMasterRequest)
    const { id } = action.payload

    const { res, err } = yield call(lazyProtect<AxiosResponse, AxiosError>(
      axios.post(`${API_URL}/review/master/delete`, { id },
        { withCredentials: true, headers: { ...authenticatedHeader(), ...defaultHeaders } })))

    if (err) {
      yield put(actions.removeReviewMasterResponse({ error: getErrorMessage(err) }))

      continue
    }

    if (res.status != 200) {
      yield put(actions.removeReviewMasterResponse({ error: getErrorMessage(err) }))

      continue
    }

    yield put(actions.removeReviewMasterResponse({ error: "" }))
  }
}

export function* triggerReminder() {
  while (true) {
    const action = yield take(actions.triggerReminderRequest)
    const { id } = action.payload

    const { res, err } = yield call(lazyProtect<AxiosResponse, AxiosError>(
      axios.post(`${API_URL}/review/master/triggerreminder`, { id },
        { withCredentials: true, headers: { ...authenticatedHeader(), ...defaultHeaders } })))

    if (err) {
      yield put(actions.triggerReminderResponse({ error: getErrorMessage(err) }))
      yield put(NotificationMessageActions.error("Unable to trigger reminder."))

      continue
    }

    if (res.status != 200) {
      yield put(actions.triggerReminderResponse({ error: getErrorMessage(err) }))
      yield put(NotificationMessageActions.error("Unable to trigger reminder."))

      continue
    }

    yield put(actions.triggerReminderResponse({ error: "" }))
    yield put(NotificationMessageActions.info("Triggered reminder."))
  }
}
