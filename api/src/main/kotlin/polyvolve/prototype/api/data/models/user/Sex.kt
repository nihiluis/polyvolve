package polyvolve.prototype.api.data.models.user

import com.fasterxml.jackson.annotation.JsonProperty

enum class Sex {
    @JsonProperty("male")
    MALE,
    @JsonProperty("female")
    FEMALE;
}