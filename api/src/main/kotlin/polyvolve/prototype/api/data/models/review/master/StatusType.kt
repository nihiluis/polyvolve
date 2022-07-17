package polyvolve.prototype.api.data.models.review.master

import com.fasterxml.jackson.annotation.JsonValue

enum class StatusType(@field:JsonValue val id: String) {
    ACTIVE("Active"),
    INACTIVE("Inactive");
}