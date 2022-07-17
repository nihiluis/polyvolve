package polyvolve.prototype.api.data.models

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import org.hibernate.annotations.GenericGenerator
import polyvolve.prototype.api.data.models.review.master.ReviewMaster
import polyvolve.prototype.api.data.models.user.User
import java.util.*
import javax.persistence.*

@Entity
@Table(name = "data_hashes",
        uniqueConstraints = [UniqueConstraint(columnNames = ["user_id", "review_master_id"])])
class DataHash() {
    // This should be a real hash, not just a UUID...
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(
            name = "UUID",
            strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id", updatable = false, nullable = false)
    var id: UUID? = null

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "review_master_id")
    var master: ReviewMaster? = null

    fun getReviewedUsers(): Set<User> = master?.reviewedUsers ?: setOf()

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties("leaders")
    var user: User? = null

    constructor(master: ReviewMaster, user: User) : this() {
        this.master = master
        this.user = user
    }
}