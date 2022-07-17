package polyvolve.prototype.api.data.models.schema

import com.fasterxml.jackson.annotation.JsonProperty
import polyvolve.prototype.api.data.models.review.value.ReviewCriterionValue
import polyvolve.prototype.api.data.models.review.value.ReviewCriterionValueScale
import polyvolve.prototype.api.data.models.review.value.ReviewCriterionValueText

enum class ReviewCriterionType(val string: String) {
    @JsonProperty("text")
    TEXT("text"),
    @JsonProperty("scale")
    SCALE("scale");

    fun createForType(value: Any): ReviewCriterionValue<*> = when (this) {
        TEXT -> {
            val valueAsString = value as? String ?: throw IllegalArgumentException("Passed non string value to ReviewCriterionValueText (type = ${this.name})")

            ReviewCriterionValueText(valueAsString)
        }
        SCALE -> {
            val valueAsInt = value as? Int ?: throw IllegalArgumentException("Passed non integer value to ReviewCriterionValueScale (type = ${this.name})")

            ReviewCriterionValueScale(valueAsInt)
        }
    }
    companion object {
        fun fromName(name: String) = when (name.toLowerCase()) {
            "scale" -> SCALE
            "text" -> TEXT
            else -> null
        }
    }
}