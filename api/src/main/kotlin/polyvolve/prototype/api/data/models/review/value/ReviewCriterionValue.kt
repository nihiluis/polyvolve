package polyvolve.prototype.api.data.models.review.value

import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo
import com.fasterxml.jackson.annotation.JsonTypeName
import java.io.Serializable

@JsonTypeName("text")
class ReviewCriterionValueText() : ReviewCriterionValue<String> {
    override var value = ""
    override var type = "text"

    override fun copy(): ReviewCriterionValue<String> = ReviewCriterionValueText(value)

    constructor(value: String) : this() {
        this.value = value
    }
}

@JsonTypeName("scale")
class ReviewCriterionValueScale() : ReviewCriterionValue<Int> {
    override var value = 0
    override var type = "scale"

    override fun copy(): ReviewCriterionValue<Int> = ReviewCriterionValueScale(value)

    constructor(value: Int) : this() {
        this.value = value
    }
}

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "type", include = JsonTypeInfo.As.PROPERTY)
@JsonSubTypes(value = [
    JsonSubTypes.Type(value = ReviewCriterionValueScale::class, name = "scale"),
    JsonSubTypes.Type(value = ReviewCriterionValueText::class, name = "text")
])
interface ReviewCriterionValue<T> : Serializable {
    var value: T
    var type: String

    fun copy(): ReviewCriterionValue<T>
}