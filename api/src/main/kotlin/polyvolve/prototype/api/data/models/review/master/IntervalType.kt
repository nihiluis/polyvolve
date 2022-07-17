package polyvolve.prototype.api.data.models.review.master

import com.fasterxml.jackson.annotation.JsonValue

enum class IntervalType(@field:JsonValue val id: String) {
    ANNUALLY("Annually"),
    WEEKLY("Weekly"),
    MONTHLY("Monthly"),
    SINGULAR("Singular")
}