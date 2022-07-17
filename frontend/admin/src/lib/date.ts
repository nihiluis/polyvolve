import moment from "moment"

import { DEFAULT_DUE_DATE_ADDITION } from "../constants/env";
import { IntervalType } from "polyvolve-ui/lib/@types";

export interface DateRecommendation {
  periodStart?: moment.Moment
  periodEnd?: moment.Moment
  dueAt?: moment.Moment
  recursFirstOn?: moment.Moment
}

function addOrdinalSuffix(n: number) {
  let j = n % 10
  let k = n % 100
  if (j == 1 && k != 11) {
    return n + "st"
  }
  if (j == 2 && k != 12) {
    return n + "nd"
  }
  if (j == 3 && k != 13) {
    return n + "rd"
  }
  return n + "th"
}

export const formatRecur = (every: number, intervalType: IntervalType): string => {
  let formatted = `${addOrdinalSuffix(every)} ${getTimeUnitFromIntervalType(intervalType)}`

  return formatted
}

export const getTimeUnitFromIntervalType = (intervalType: IntervalType): string => {
  var timeUnit: string
  switch (intervalType.toLowerCase()) {
    case "annually":
      timeUnit = "year"
      break
    case "weekly":
      timeUnit = "week"
      break
    case "monthly":
      timeUnit = "month"
      break
  }

  return timeUnit
}

export const getRecurInfoText = (intervalType: IntervalType, periodStart: string, every: number): string => {
  const formatted = formatRecur(every, intervalType)

  let dayFormat: string
  switch (intervalType) {
    case "Annually":
      dayFormat = moment(periodStart, "YYYY-MM-DD").format("Do of MMMM")
      return `Will recur every ${formatted} on ${dayFormat}.`
    case "Monthly":
      dayFormat = moment(periodStart, "YYYY-MM-DD").format("Do")
      return `Will recur every ${formatted} on the ${dayFormat} day.`
    case "Weekly":
    default:
      dayFormat = moment(periodStart, "YYYY-MM-DD").format("dddd")
      return `Will recur every ${formatted} on ${dayFormat}.`
  }
}

export const recommendDate = (interval: number, intervalType: IntervalType, periodStartParam?: string): DateRecommendation => {
  const now = moment()

  var periodStart: moment.Moment

  if (periodStartParam) {
    periodStart = moment(periodStartParam, "YYYY-MM-DD")
  } else {
    switch (intervalType.toLowerCase()) {
      case "annually":
        periodStart = moment([now.year(), 0, 1])
        break
      case "weekly":
        let targetDay = now.date() + 7 - now.day() + 1
        let targetMonth = now.month()
        let targetYear = now.year()
        if (targetDay > now.daysInMonth()) {
          targetDay -= now.daysInMonth()
          if (targetMonth === 12) {
            targetYear += 1
            targetMonth = 1
          } else {
            targetMonth += 1
          }
        }
        periodStart = moment([targetYear, targetMonth, targetDay])
        periodEnd = periodStart.clone()
        break
      case "monthly":
        const dayInMonth = now.daysInMonth()
        if (dayInMonth === 1) {
          periodStart = now
        } else {
          periodStart = moment([now.year(), now.month(), 1])
        }
        break
    }
  }

  var periodEnd: moment.Moment

  switch (intervalType.toLowerCase()) {
    case "annually":
      periodEnd = periodStart.clone()
        .add(1 * interval, "year")
        .subtract(1, "day")
      break
    case "weekly":
      periodEnd = periodStart.clone()
        .add(1 * interval, "week")
        .subtract(1, "day")
      break
    case "monthly":
      const dayInMonth = now.daysInMonth()
      if (dayInMonth === 1) {
        periodEnd = periodStart.clone()
          .add(1 * interval, "month")
          .subtract(1, "day")
      } else {
        periodEnd = periodStart.clone()
          .add(1 * interval, "month")
          .subtract(1, "day")
      }
      break
  }

  const dueAt = periodEnd.clone()
    .add(DEFAULT_DUE_DATE_ADDITION, "day")

  return {
    periodStart,
    periodEnd,
    dueAt,
    recursFirstOn: periodEnd.clone().add(1, "day")
  }
}
