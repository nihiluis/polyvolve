package polyvolve.prototype.api.data.models.review.value

import com.vladmihalcea.hibernate.type.json.JsonBinaryType
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.Type
import org.hibernate.annotations.TypeDef
import org.hibernate.annotations.TypeDefs
import polyvolve.prototype.api.data.models.review.user.ReviewUser
import polyvolve.prototype.api.data.models.schema.ReviewCriterion
import java.util.*
import javax.persistence.*

@Entity
@Table(name = "review_criterion_values", uniqueConstraints = [UniqueConstraint(columnNames = ["criterion_id", "review_user_id"])])
@TypeDefs(TypeDef(name = "jsonb", typeClass = JsonBinaryType::class))
class ReviewCriterionValueObject() {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(
            name = "UUID",
            strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id", updatable = false, nullable = false)
    var id: UUID? = null

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "criterion_id", nullable = false)
    var criterion: ReviewCriterion? = null

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "review_user_id", nullable = false)
    var reviewUser: ReviewUser? = null

    //var type = ReviewCriterionType.SCALE

    @Type(type = "jsonb")
    @Column(columnDefinition = "jsonb", nullable = false)
    //@JsonDeserialize(`as` = ReviewCriterionValueAny::class)
    var value: ReviewCriterionValue<*>? = null

    constructor(criterion: ReviewCriterion,
                reviewUser: ReviewUser,
                //type: ReviewCriterionType,
                value: ReviewCriterionValue<*>) : this() {
        this.criterion = criterion
        this.reviewUser = reviewUser
        //this.type = type
        this.value = value
    }
}