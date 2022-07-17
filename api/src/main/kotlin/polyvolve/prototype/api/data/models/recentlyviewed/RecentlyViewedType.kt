package polyvolve.prototype.api.data.models.recentlyviewed

enum class RecentlyViewedType(val tableName: String) {
    TEAM("teams"),
    USER("users"),
    REVIEW_MASTER("review_masters"),
}