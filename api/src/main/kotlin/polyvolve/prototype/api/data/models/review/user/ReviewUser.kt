package polyvolve.prototype.api.data.models.review.user

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.vladmihalcea.hibernate.type.json.JsonBinaryType
import org.hibernate.annotations.*
import polyvolve.prototype.api.data.models.user.User
import polyvolve.prototype.api.data.models.review.Review
import polyvolve.prototype.api.data.models.review.value.ReviewCriterionValueObject
import java.util.*
import javax.persistence.*
import javax.persistence.CascadeType
import javax.persistence.Entity
import javax.persistence.Table

/**
 * A survey about [User] performance which is subject of being reviewed by a [User].
 */
@Entity
@Table(name = "review_users")
@TypeDefs(TypeDef(name = "jsonb", typeClass = JsonBinaryType::class))
class ReviewUser() {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(
            name = "UUID",
            strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id", updatable = false, nullable = false)
    var id: UUID? = null

    var markedCompleted = false

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "reviewUser", cascade = [CascadeType.ALL])
    @JsonIgnoreProperties("reviewUser")
    var values: Set<ReviewCriterionValueObject> = emptySet()

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "review_id", nullable = false)
    @JsonIgnoreProperties("reviewUsers")
    lateinit var review: Review

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties("reviewUsers")
    lateinit var reviewedUser: User

    constructor(review: Review, user: User) : this() {
        this.review = review
        this.reviewedUser = user
    }
}