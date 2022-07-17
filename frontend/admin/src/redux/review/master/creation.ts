import { createAction, handleActions } from "redux-actions"
import { take, call, put } from "redux-saga/effects"
import {
  axios,
  getErrorMessage,
  authenticatedHeader,
  defaultHeaders,
} from "../../../lib/axios"
import { lazyProtect } from "await-protect"
import { API_URL } from "../../../constants/env"
import { ReviewMasterGlobalActions } from "./global"
import { NotificationMessageActions } from "../../message"

export interface ReviewMasterCreationState {
  error: string
  loading: boolean
  initialized: boolean
}

const actionNames = {
  CREATE_REVIEW_MASTER_REQUEST: "CREATE_REVIEW_MASTER_REQUEST",
  CREATE_REVIEW_MASTER_RESPONSE: "CREATE_REVIEW_MASTER_RESPONSE",
}

const actions = {
  createReviewMasterRequest: createAction<{ id: string }>(
    actionNames.CREATE_REVIEW_MASTER_REQUEST
  ),
  createReviewMasterResponse: createAction<{ error: string }>(
    actionNames.CREATE_REVIEW_MASTER_RESPONSE
  ),
}

export const ReviewMasterCreateActions = actions

const initialState: ReviewMasterCreationState = {
  initialized: false,
  loading: false,
  error: "",
}

export const reviewMasterCreateReducer = handleActions<
  ReviewMasterCreationState,
  Partial<ReviewMasterCreationState>
>(
  {
    [actionNames.CREATE_REVIEW_MASTER_REQUEST]: (state, action) => {
      return {
        ...state,
        ...action.payload,
        initialized: false,
      }
    },
    [actionNames.CREATE_REVIEW_MASTER_RESPONSE]: (state, action) => {
      return {
        ...state,
        ...action.payload,
        initialized: true,
      }
    },
  },
  initialState
)

export function* handleCreateReviewMaster() {
  while (true) {
    const action = yield take(actions.createReviewMasterRequest)
    const {
      name,
      periodStart,
      periodEnd,
      dueAt,
      interval,
      userIds,
      intervalType,
      schemaId,
    } = action.payload

    const newReviewMasterBody = {
      topic: name,
      periodStart,
      periodEnd,
      dueAt,
      interval,
      intervalType,
      userIds,
      schemaId,
    }

    yield put(NotificationMessageActions.info(`Creating Review Master ${name}.`))
    
    const { ok, err } = yield call(
      lazyProtect(
        axios.post(`${API_URL}/review/master/create`, newReviewMasterBody, {
          withCredentials: true,
          headers: { ...authenticatedHeader(), ...defaultHeaders },
        })
      )
    )

    if (err || ok.status != 200) {
      yield put(
        actions.createReviewMasterResponse({ error: getErrorMessage(err) })
      )
      yield put(
        NotificationMessageActions.info(`Unable to create Review Master ${name}.`)
      )
      continue
    }

    yield put(NotificationMessageActions.info(`Created Review Master ${name}.`))
    yield put(actions.createReviewMasterResponse({ error: "" }))
    yield put(NotificationMessageActions.info(`Reloading Review Master state...`))
    yield put(ReviewMasterGlobalActions.loadReviewMastersRequest())
  }
}
