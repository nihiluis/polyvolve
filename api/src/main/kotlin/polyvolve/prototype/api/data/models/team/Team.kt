package polyvolve.prototype.api.data.models.team

import com.fasterxml.jackson.annotation.*
import org.hibernate.annotations.GenericGenerator
import polyvolve.prototype.api.data.models.abstr.Colored
import polyvolve.prototype.api.data.models.abstr.HasName
import polyvolve.prototype.api.data.models.review.master.ReviewMaster
import polyvolve.prototype.api.data.models.user.User
import java.util.*
import javax.persistence.*

/**
 * An organizational entity or team that [User]s and [User]s can belong to.
 */
@Entity
@Table(name = "teams")
class Team() : Colored, HasName {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(
            name = "UUID",
            strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id", updatable = false, nullable = false)
    var id: UUID? = null

    @Column(unique = true)
    var name = ""
    var description = ""
    override var color = "#fff"

    @ManyToMany(cascade = [CascadeType.ALL])
    @JoinTable(
            name = "team_user",
            joinColumns = [JoinColumn(name = "team_id")],
            inverseJoinColumns = [JoinColumn(name = "user_id")])
    @JsonIgnore
    var users: MutableSet<User> = mutableSetOf()

    @ManyToMany(mappedBy = "teams")
    @JsonIgnore
    var reviewMasters: Set<ReviewMaster> = setOf()

    override fun getDisplayName(): String = name

    constructor(name: String) : this() {
        this.name = name
    }
}