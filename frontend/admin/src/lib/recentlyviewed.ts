import { RecentlyViewedItem } from "../redux/recentlyviewed";
import { COLOR_TYPE_DEFAULT, COLOR_TYPE_TEAM, COLOR_TYPE_LEADER, COLOR_TYPE_USER } from "../constants/env";
import { getColor } from "./format";

function getRecentlyViewedItemPath(recentlyViewedItem): string {
  switch (recentlyViewedItem.type) {
    case "REVIEW_MASTER":
      return "review/master"
    default:
      return recentlyViewedItem.type.toLowerCase()
  }
}

export function getRecentlyViewedItemUrl(recentlyViewedItem: RecentlyViewedItem): string {
  return `/${getRecentlyViewedItemPath(recentlyViewedItem)}/${recentlyViewedItem.targetId}`
}

export function getRecentlyViewedItemColor(recentlyViewedItem: RecentlyViewedItem): string {
  return getColor(recentlyViewedItem.type)
}
