package polyvolve.prototype.api.data.models.review

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.OnDelete
import org.hibernate.annotations.OnDeleteAction
import polyvolve.prototype.api.data.models.review.user.ReviewUser
import polyvolve.prototype.api.data.models.review.master.ReviewMaster
import polyvolve.prototype.api.data.models.user.User
import java.util.*
import javax.persistence.*

@Entity
@Table(name = "reviews")
class Review() {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(
            name = "UUID",
            strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id", updatable = false, nullable = false)
    var id: UUID? = null

    var iteration = 0

    var markedCompleted = false

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "review")
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnoreProperties("review")
    var reviewUsers: Set<ReviewUser> = emptySet()

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "review_master_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnoreProperties("reviews")
    lateinit var master: ReviewMaster

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnoreProperties("reviews", "masters")
    lateinit var reviewingUser: User

    constructor(master: ReviewMaster, user: User) : this() {
        this.master = master
        this.reviewingUser = user
    }
}