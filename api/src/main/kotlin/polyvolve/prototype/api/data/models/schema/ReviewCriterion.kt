package polyvolve.prototype.api.data.models.schema

import com.fasterxml.jackson.annotation.JsonIgnore
import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import org.hibernate.annotations.GenericGenerator
import polyvolve.prototype.api.data.models.review.value.ReviewCriterionValueObject
import java.util.*
import javax.persistence.*

@Entity
@Table(name = "review_criteria",
        uniqueConstraints = [
            UniqueConstraint(columnNames = ["category_id", "name"])])
class ReviewCriterion() {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(
            name = "UUID",
            strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id", updatable = false, nullable = false)
    var id: UUID? = null

    var name = ""
    var description = ""
    var type = ReviewCriterionType.SCALE
    @Column(name = "sortOrder")
    var order = 1

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    @JsonIgnoreProperties("category")
    var category: ReviewCategory? = null


    @OneToMany(fetch = FetchType.LAZY, cascade = [CascadeType.ALL], mappedBy = "criterion")
    @JsonIgnore
    var values: Set<ReviewCriterionValueObject> = emptySet()

    constructor(name: String, description: String, type: ReviewCriterionType, order: Int) : this() {
        this.name = name
        this.description = description
        this.type = type
        this.order = order
    }
}

