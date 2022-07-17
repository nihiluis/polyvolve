import { createAction, handleActions } from "redux-actions"
import { AxiosResponse, AxiosError } from "axios"
import { take, call, put } from "redux-saga/effects"
import { axios, getErrorMessage, authenticatedHeader } from "../../lib/axios"
import { API_URL } from "../../constants/env";
import { lazyProtect } from "await-protect"

export interface InviteState {
  initialized: boolean
  loading: boolean
  accepted: boolean
  mail: string
  name: string
  surname: string
  inviteId: string
  error: string
}

export const actionNames = {
  ACCEPT_INVITE_REQUEST: "ACCEPT_INVITE_REQUEST",
  ACCEPT_INVITE_RESPONSE: "ACCEPT_INVITE_RESPONSE"
}

export const actions = {
  acceptInviteRequest: createAction<Partial<InviteState>>(actionNames.ACCEPT_INVITE_REQUEST),
  acceptInviteResponse: createAction<Partial<InviteState>>(actionNames.ACCEPT_INVITE_RESPONSE),
}
export const InviteActions = actions

export default actions

const initialState: InviteState = {
  initialized: false,
  loading: false,
  accepted: false,
  mail: "",
  name: "",
  surname: "",
  error: "",
  inviteId: ""
}

export const reducer = handleActions<InviteState, Partial<InviteState>>({
  [actionNames.ACCEPT_INVITE_REQUEST]: (state, action) => {
    return {
      ...state,
      ...action.payload,
      loading: true,
    }
  },
  [actionNames.ACCEPT_INVITE_RESPONSE]: (state, action) => {
    return {
      ...state,
      ...action.payload,
      loading: false,
      initialized: true,
    }
  }
}, initialState)

export function* handleAcceptInvite() {
  while (true) {
    const action = yield take(actions.acceptInviteRequest)
    const { mail, id, password, name, surname } = action.payload

    const { ok, err } = yield call(lazyProtect<AxiosResponse, AxiosError>(
      axios.post(`${API_URL}/login`,
        { mail, id, name, surname, password },
        { withCredentials: true })))

    if (err) {
      yield put(actions.acceptInviteResponse({ error: getErrorMessage(err) }))
      continue
    }

    if (ok.status != 200) {
      yield put(actions.acceptInviteResponse({ error: getErrorMessage(err) }))
      continue
    }

    yield put(actions.acceptInviteResponse({ error: "", accepted: true }))
  }
}
