package polyvolve.prototype.api.data.models.user

import com.fasterxml.jackson.annotation.JsonProperty

enum class UserLevel {
    @JsonProperty("lowly")
    LOWLY_LEADER,
    @JsonProperty("none")
    EMPLOYEE
}