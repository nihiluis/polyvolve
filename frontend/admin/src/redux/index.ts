import { combineReducers } from "redux"
import { fork } from "redux-saga/effects"

import { loadingBarReducer as loadingBar } from "react-redux-loading-bar"

import { reducer as persist, PersistState } from "./persist"
import { reducer as ui, UIState } from "./ui"
import {
  reducer as auth,
  AuthState,
  handleAuthCheck,
  handleLogin,
  handleLogout,
} from "./auth"
import {
  AdminOverviewState,
  handleLoadAdminData,
  adminOverviewReducer,
} from "./admin/overview"
import { reducer as invite, InviteState } from "./invite"
import {
  userGlobalReducer,
  userCreationReducer,
  UserGlobalState,
  handleLoadUsers,
  handleRemoveUser,
  handleMarkUser,
  handleUnmarkUser,
  handleGetMarkedUsers,
  handleCreateUser,
  userSpecifiedReducer,
  handleGetUser,
  handleUpdateUser,
  UserSpecifiedState,
  handleGetScores,
  handleGetLinkForReviewMaster,
} from "./user"
import {
  reviewMasterOverviewReducer,
  reviewMasterCreateReducer,
  handleLoadReviewMasters,
  handleCreateReviewMaster,
  ReviewMasterGlobalState,
  ReviewMasterSpecifiedState,
  reviewMasterActiveReducer,
  handleRemoveReviewMaster,
  handleGetReviewMaster,
  handleUpdateReviewMaster,
  triggerReminder,
  handleGetScoresExport,
} from "./review/master"
import {
  teamCreateReducer,
  teamOverviewReducer,
  handleRemoveTeam,
  handleLoadTeamData,
  handleCreateTeam,
} from "./team"
import { UserCreationState } from "./user/creation"
import { ReviewMasterCreationState } from "./review/master/creation"
import { TeamOverviewState } from "./team/global"
import { TeamCreationState } from "./team/creation"
import {
  handleGetTeam,
  TeamSpecifiedState,
  teamSpecifiedReducer,
  handleUpdateTeam,
} from "./team/specified"
import {
  RecentlyViewedState,
  recentlyViewedReducer,
  handleLoadRecentlyViewed,
} from "./recentlyviewed"
import {
  NotificationMessageState,
  notificationMessageReducer,
  watchHandleNotificationMessageError,
  watchHandleNotificationMessageInfo,
  watchHandleNotificationMessageWarn,
} from "./message"
import {
  handleCreateCategory,
  handleGetCategories,
  handleCreateCriterion,
  handleUpdateCriterion,
  handleRemoveCriterion,
  handleRemoveCategory,
  handleUpdateCategory,
  SchemaEditorState,
  schemaEditorReducer,
  SchemaAddCategoryState,
  schemaAddCategoryReducer,
  SchemaAddCriterionState,
  schemaAddCriterionReducer,
  schemaUpdateCategoryReducer,
  schemaUpdateCriterionReducer,
  SchemaUpdateCategoryState,
  SchemaUpdateCriterionState,
  handleGetSchemas,
  handleCreateSchema,
  handleRemoveSchema,
  handleUpdateSchema,
  SchemaAddState,
  schemaAddReducer,
  handleSetOrderCriterion,
  handleSetOrderCategory,
} from "./schema"

interface UserState {
  global: UserGlobalState
  creation: UserCreationState
  specified: UserSpecifiedState
}

interface AdminState {
  global: AdminOverviewState
}

interface ReviewState {
  master: ReviewMasterState
}

interface ReviewMasterState {
  global: ReviewMasterGlobalState
  creation: ReviewMasterCreationState
  specified: ReviewMasterSpecifiedState
}

interface TeamState {
  global: TeamOverviewState
  creation: TeamCreationState
  specified: TeamSpecifiedState
}

interface SchemaState {
  editor: SchemaEditorState
  add: SchemaAddState
  addCategory: SchemaAddCategoryState
  addCriterion: SchemaAddCriterionState
  updateCategory: SchemaUpdateCategoryState
  updateCriterion: SchemaUpdateCriterionState
}

const userReducer = combineReducers<UserState>({
  global: userGlobalReducer,
  creation: userCreationReducer,
  specified: userSpecifiedReducer,
})

const reviewMasterReducer = combineReducers<ReviewMasterState>({
  global: reviewMasterOverviewReducer,
  creation: reviewMasterCreateReducer,
  specified: reviewMasterActiveReducer,
})

const reviewReducer = combineReducers<ReviewState>({
  master: reviewMasterReducer,
})

const teamReducer = combineReducers<TeamState>({
  global: teamOverviewReducer,
  creation: teamCreateReducer,
  specified: teamSpecifiedReducer,
})

export const adminReducer = combineReducers<AdminState>({
  global: adminOverviewReducer,
})

const schemaReducer = combineReducers<SchemaState>({
  editor: schemaEditorReducer,
  add: schemaAddReducer,
  addCategory: schemaAddCategoryReducer,
  addCriterion: schemaAddCriterionReducer,
  updateCategory: schemaUpdateCategoryReducer,
  updateCriterion: schemaUpdateCriterionReducer,
})

export const reducer = combineReducers<RootState>({
  persist,
  ui,
  auth,
  admin: adminReducer,
  invite,
  user: userReducer,
  review: reviewReducer,
  team: teamReducer,
  recentlyViewed: recentlyViewedReducer,
  notificationMessage: notificationMessageReducer,
  schema: schemaReducer,
  loadingBar,
})

export interface RootState {
  persist: PersistState
  ui: UIState
  auth: AuthState
  admin: AdminState
  invite: InviteState
  user: UserState
  review: ReviewState
  team: TeamState
  schema: SchemaState
  recentlyViewed: RecentlyViewedState
  notificationMessage: NotificationMessageState
  loadingBar: any
}

export default function* rootSaga() {
  yield fork(handleAuthCheck)
  yield fork(handleLogin)
  yield fork(handleLogout)

  yield fork(handleLoadAdminData)

  yield fork(handleLoadUsers)

  yield fork(handleCreateUser)
  yield fork(handleRemoveUser)
  yield fork(handleGetUser)
  yield fork(handleUpdateUser)
  yield fork(handleGetScores)
  yield fork(handleGetLinkForReviewMaster)

  yield fork(handleMarkUser)
  yield fork(handleUnmarkUser)
  yield fork(handleGetMarkedUsers)

  yield fork(handleLoadReviewMasters)
  yield fork(handleCreateReviewMaster)
  yield fork(handleRemoveReviewMaster)
  yield fork(triggerReminder)
  yield fork(handleGetReviewMaster)
  yield fork(handleUpdateReviewMaster)
  yield fork(handleGetScoresExport)

  yield fork(handleCreateTeam)
  yield fork(handleRemoveTeam)
  yield fork(handleLoadTeamData)
  yield fork(handleGetTeam)
  yield fork(handleUpdateTeam)

  yield fork(handleLoadRecentlyViewed)

  yield fork(watchHandleNotificationMessageError)
  yield fork(watchHandleNotificationMessageInfo)
  yield fork(watchHandleNotificationMessageWarn)

  yield fork(handleGetCategories)
  yield fork(handleCreateCategory)
  yield fork(handleUpdateCategory)
  yield fork(handleRemoveCategory)
  yield fork(handleCreateCriterion)
  yield fork(handleUpdateCriterion)
  yield fork(handleRemoveCriterion)

  yield fork(handleGetSchemas)
  yield fork(handleCreateSchema)
  yield fork(handleRemoveSchema)
  yield fork(handleUpdateSchema)
  yield fork(handleSetOrderCriterion)
  yield fork(handleSetOrderCategory)
}
