package polyvolve.prototype.api.data.models.user

import com.fasterxml.jackson.annotation.*
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.OnDelete
import org.hibernate.annotations.OnDeleteAction
import polyvolve.prototype.api.data.models.abstr.Colored
import polyvolve.prototype.api.data.models.abstr.HasName
import polyvolve.prototype.api.data.models.abstr.Person
import polyvolve.prototype.api.data.models.review.Review
import polyvolve.prototype.api.data.models.review.master.ReviewMaster
import polyvolve.prototype.api.data.models.team.Team
import java.util.*
import javax.persistence.*

@Entity
@Table(name = "users")
class User() : Person, Colored, HasName {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(
            name = "UUID",
            strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id", updatable = false, nullable = false)
    var id: UUID? = null

    lateinit var mail: String
    override lateinit var name: String
    override lateinit var surname: String

    var sex = Sex.MALE
    var description = ""
    override var color = "#fff"
    var avatar = ""
    var position = ""
    var isReviewed = false
    var level = UserLevel.EMPLOYEE

    override fun getDisplayName(): String = "$name $surname"

    @ManyToMany(mappedBy = "reviewedUsers")
    @JsonIgnore
    var reviewMasters: Set<ReviewMaster> = setOf()

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "reviewingUser")
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    var reviews: Set<Review> = emptySet()

    @ManyToMany(fetch = FetchType.LAZY, mappedBy = "users")
    @JsonIgnore
    var teams: Set<Team> = emptySet()

    constructor(mail: String,
                name: String,
                surname: String,
                sex: Sex,
                level: UserLevel = UserLevel.EMPLOYEE) : this() {
        this.mail = mail
        this.name = name
        this.surname = surname
        this.sex = sex
        this.level = level
    }
}