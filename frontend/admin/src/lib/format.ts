import { User, Sex } from "polyvolve-ui/lib/@types"

import {
  COLOR_TYPE_TEAM,
  COLOR_TYPE_USER,
  COLOR_TYPE_DEFAULT,
  COLOR_TYPE_REVIEW_MASTER
} from "../constants/env";

export function getUserName(user: User): string {
  return `${user.name} ${user.surname}`
}

export function getUserFromNames(name: string, surname: string): string {
  return `${name} ${surname}`
}

export function getColor(type: string): string {
  let color: string

  switch (type.toUpperCase().replace(" ", "")) {
    case "TEAM":
      color = COLOR_TYPE_TEAM
      break
    case "USER":
      color = COLOR_TYPE_USER
      break
    case "REVIEW_MASTER":
      color = COLOR_TYPE_REVIEW_MASTER
      break
    default:
      color = COLOR_TYPE_DEFAULT
      break
  }

  return color
}

export function formatSex(sex: Sex): string {
  return sex.charAt(0).toUpperCase() + sex.slice(1)
}

export function getReviewCriterionTypeDisplayName(type: string): string {
  if (!type) return ""

  return type.charAt(0).toUpperCase() + type.slice(1)
}
