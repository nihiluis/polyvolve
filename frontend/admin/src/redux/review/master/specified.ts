import { createAction, handleActions } from "redux-actions"
import { AxiosResponse, AxiosError } from "axios"
import { take, call, put } from "redux-saga/effects"
import {
  axios,
  getErrorMessage,
  authenticatedHeader,
  defaultHeaders,
} from "../../../lib/axios"
import { API_URL } from "../../../constants/env"
import { lazyProtect } from "await-protect"
import { transformReviewMaster } from "./util"
import { ReviewMaster, ReviewMasterScoreItem } from "polyvolve-ui/lib/@types"
import { NotificationMessageActions } from "../../message"

export interface ReviewMasterSpecifiedState {
  initialized: boolean
  loading: boolean
  error: string
  data?: ReviewMaster
  scoresExport: ReviewMasterScoreItem[]
}

const actionNames = {
  GET_REVIEW_MASTER_REQUEST: "GET_REVIEW_MASTER_REQUEST",
  GET_REVIEW_MASTER_RESPONSE: "GET_REVIEW_MASTER_RESPONSE",
  GET_SCORES_FOR_DOWNLOAD_REQUEST: "GET_SCORES_FOR_DOWNLOAD_REQUEST",
  GET_SCORES_FOR_DOWNLOAD_RESPONSE: "GET_SCORES_FOR_DOWNLOAD_RESPONSE",
  UPDATE_REVIEW_MASTER_REQUEST: "UPDATE_REVIEW_MASTER_REQUEST",
  UPDATE_REVIEW_MASTER_RESPONSE: "UPDATE_REVIEW_MASTER_RESPONSE",
}

const actions = {
  getReviewMasterRequest: createAction<Partial<ReviewMasterSpecifiedState>>(
    actionNames.GET_REVIEW_MASTER_REQUEST
  ),
  getReviewMasterResponse: createAction<Partial<ReviewMasterSpecifiedState>>(
    actionNames.GET_REVIEW_MASTER_RESPONSE
  ),
  getScoresForDownloadRequest: createAction<
    Partial<ReviewMasterSpecifiedState>
  >(actionNames.GET_SCORES_FOR_DOWNLOAD_REQUEST),
  getScoresForDownloadResponse: createAction<
    Partial<ReviewMasterSpecifiedState>
  >(actionNames.GET_SCORES_FOR_DOWNLOAD_RESPONSE),
  updateReviewMasterRequest: createAction<Partial<ReviewMasterSpecifiedState>>(
    actionNames.UPDATE_REVIEW_MASTER_REQUEST
  ),
  updateReviewMasterResponse: createAction<Partial<ReviewMasterSpecifiedState>>(
    actionNames.UPDATE_REVIEW_MASTER_RESPONSE
  ),
}

export const ReviewMasterSpecifiedActions = actions

const initialState: ReviewMasterSpecifiedState = {
  initialized: false,
  loading: false,
  data: null,
  error: "",
  scoresExport: [],
}

export const reviewMasterActiveReducer = handleActions<
  ReviewMasterSpecifiedState,
  Partial<ReviewMasterSpecifiedState>
>(
  {
    [actionNames.GET_REVIEW_MASTER_REQUEST]: (state, action) => {
      return {
        ...state,
        ...action.payload,
        loading: true,
      }
    },
    [actionNames.GET_REVIEW_MASTER_RESPONSE]: (state, action) => {
      return {
        ...state,
        ...action.payload,
        loading: false,
        initialized: true,
      }
    },
    [actionNames.GET_SCORES_FOR_DOWNLOAD_REQUEST]: (state, action) => {
      return {
        ...state,
        ...action.payload,
      }
    },
    [actionNames.GET_SCORES_FOR_DOWNLOAD_RESPONSE]: (state, action) => {
      return {
        ...state,
        ...action.payload,
      }
    },
    [actionNames.UPDATE_REVIEW_MASTER_REQUEST]: (state, action) => {
      return {
        ...state,
        ...action.payload,
        loading: true,
      }
    },
    [actionNames.UPDATE_REVIEW_MASTER_RESPONSE]: (state, action) => {
      return {
        ...state,
        ...action.payload,
        loading: false,
      }
    },
  },
  initialState
)

export function* handleGetReviewMaster() {
  while (true) {
    const action = yield take(actions.getReviewMasterRequest)
    const { id } = action.payload

    const { ok, err } = yield call(
      lazyProtect<AxiosResponse, AxiosError>(
        axios.get(`${API_URL}/review/master/get/${id}`, {
          withCredentials: true,
          headers: { ...authenticatedHeader(), ...defaultHeaders },
        })
      )
    )

    if (err || ok.status != 200) {
      yield put(
        actions.getReviewMasterResponse({ error: getErrorMessage(err) })
      )

      continue
    }

    const data = ok.data.data
    const reviewMaster: ReviewMaster = transformReviewMaster(data.reviewMaster)
    reviewMaster.reviewedUsers = data.reviewedUsers
    reviewMaster.reviews = data.reviews
    reviewMaster.teams = data.teams
    reviewMaster.schema = data.schema

    yield put(
      actions.getReviewMasterResponse({ error: "", data: reviewMaster })
    )
  }
}

export function* handleGetScoresExport() {
  while (true) {
    const action = yield take(actions.getScoresForDownloadRequest)
    const { id } = action.payload

    yield put(NotificationMessageActions.info(`Retrieving score extract...`))

    const { res, err } = yield call(
      lazyProtect<AxiosResponse, AxiosError>(
        axios.get(`${API_URL}/review/master/scores/export/get/${id}`, {
          withCredentials: true,
          headers: { ...authenticatedHeader(), ...defaultHeaders },
        })
      )
    )

    if (err || res.status != 200) {
      yield put(
        actions.getScoresForDownloadResponse({ error: getErrorMessage(err) })
      )
      yield put(
        NotificationMessageActions.error(`Unable to retrieve score extract.`)
      )

      continue
    }

    const data: ReviewMasterScoreItem[] = res.data.data
    yield put(NotificationMessageActions.info(`Retrieved score extract.`))

    data.sort((item1, item2) => {
      if (item1.reviewedMail > item2.reviewedMail) return 1
      if (item1.reviewedMail < item2.reviewedMail) return -1
      if (item1.reviewerMail > item2.reviewerMail) return 1
      if (item1.reviewerMail < item2.reviewerMail) return -1
      if (item1.categoryName > item2.categoryName) return 1
      if (item1.categoryName < item2.categoryName) return -1
      if (item1.criterionName > item2.criterionName) return 1
      if (item1.criterionName < item2.criterionName) return -1

      return 0
    })

    yield put(
      actions.getScoresForDownloadResponse({ error: "", scoresExport: data })
    )
  }
}

export function* handleUpdateReviewMaster() {
  while (true) {
    const action = yield take(actions.updateReviewMasterRequest)
    const { id, name, description, isActive, userIds, teamIds } = action.payload

    yield put(
      NotificationMessageActions.info(`Updating Review Master ${name}...`)
    )

    const body = {
      id,
      name,
      description,
      status: isActive ? "Active" : "Inactive",
      userIds,
      teamIds,
    }

    const resp = yield call(
      lazyProtect(
        axios.post(`${API_URL}/review/master/update`, body, {
          withCredentials: true,
          headers: { ...authenticatedHeader(), ...defaultHeaders },
        })
      )
    )

    if (resp.err) {
      yield put(
        actions.updateReviewMasterResponse({ error: getErrorMessage(resp.err) })
      )
      yield put(
        NotificationMessageActions.info(
          `Unable to update Review Master ${name}.`
        )
      )
      continue
    }

    const data = resp.ok.data.data
    const reviewMaster: ReviewMaster = transformReviewMaster(data.reviewMaster)
    reviewMaster.reviewedUsers = data.reviewedUsers
    reviewMaster.reviews = data.reviews
    reviewMaster.teams = data.teams
    reviewMaster.schema = data.schema

    yield put(NotificationMessageActions.info(`Updated Review Master ${name}.`))
    yield put(
      actions.updateReviewMasterResponse({ error: "", data: reviewMaster })
    )
  }
}
