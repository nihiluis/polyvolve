import { Moment } from "moment"

//export type ReviewMasterType = "Singular" | "Recurring"
export type IntervalType = "Annually" | "Weekly" | "Monthly" | "Singular"
export type Sex = "male" | "female"
export type UserLevel = "lowly" | "none"

export interface User {
  id: string
  mail: string
  name: string
  surname: string
  sex: Sex
  description: string
  color: string
  avatar: string
  position: string
  isReviewed: boolean
  level: UserLevel
  inferiors?: User[]
  superiors?: User[]
  reviewMasters?: ReviewMaster[]
  reviewingMasters?: ReviewMaster[]
  reviews?: Review[]
  teams?: Team[]
}

export interface Team {
  id: string
  name: string
  description: string
  users?: User[]
  reviewMasters?: ReviewMaster[]
}

export interface ReviewSchema {
  id: string
  name: string
  description: string
  categories: ReviewCategory[]
}

export interface ReviewCategory {
  id: string
  name: string
  description: string
  criteria: ReviewCriterion[]
  order: number
}

export interface ReviewCriterion {
  id: string
  name: string
  description: string
  type: string
  order: number
}

export interface ReviewUserValueContainer {
  id: string
  markedCompleted: boolean
  review?: Review
  user?: User
}

export type ReviewMasterType = "annually" | "weekly" | "monthly" | "singular"
export type ReviewMasterContainerType = "Singular" | "Recurring"
export type ReviewMasterStatusType = "Active" | "Inactive"

export interface ReviewMaster {
  id: string
  name: string
  description: string
  periodStart: Moment
  periodEnd: Moment
  dueAt: Moment
  lastReminder?: string
  interval: number
  intervalType: IntervalType
  status: ReviewMasterStatusType
  iteration: number
  reviews?: Review[]
  teams?: Team[]
  reviewedUsers?: User[]
  reviewingUsers?: User[]
  schema?: ReviewSchema
}

export interface ReviewMasterScoreItem {
  reviewedId: string
  reviewedMail: string
  reviewerId: string
  reviewerMail: string
  categoryId: string
  categoryName: string
  criterionId: string
  criterionName: string
  criterionType: ReviewCriterionType
  value: any
}

export interface Review {
  id: string
  iteration: number
  markedCompleted: boolean
  reviewUsers?: ReviewUserValueContainer[]
  master?: ReviewMaster
  reviewingUser?: User
}

export interface MarkedUser {
  id: string
  userId: string
}

export interface ReviewUserValueContainer {
  id: string
  review?: Review
  reviewedUser?: User
  values: ReviewCriterionValueContainer[]
}

export interface ReviewCriterionValueContainer {
  id: string
  criterion?: ReviewCriterion
  reviewLeader?: ReviewUserValueContainer
  type: ReviewCriterionType
  value: ReviewCriterionValue
}

export type ReviewCriterionValue =
  | ReviewCriterionValueScale
  | ReviewCriterionValueAssociation

export type ReviewCriterionType = "scale" | "text"

export interface ReviewCriterionValueAssociation {
  value: boolean
}

export interface ReviewCriterionValueScale {
  value: number
}

export interface ScoreContainer {
  data: {
    [reviewMasterId: string]: { [categoryId: string]: ScoreCategoryContainer }
  }
}

export interface ScoreCategoryContainer {
  overallScore: ScoreInnerContainer
}

export interface ScoreInnerContainer {
  avg: number
  min: number
  max: number
  count: number
  stdDev: number
}
