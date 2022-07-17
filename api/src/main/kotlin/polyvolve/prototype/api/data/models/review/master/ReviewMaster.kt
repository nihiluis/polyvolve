package polyvolve.prototype.api.data.models.review.master

import com.fasterxml.jackson.annotation.*
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.OnDelete
import org.hibernate.annotations.OnDeleteAction
import polyvolve.prototype.api.config.ReminderConfig
import polyvolve.prototype.api.data.models.abstr.HasName
import polyvolve.prototype.api.data.models.review.Review
import polyvolve.prototype.api.data.models.schema.ReviewSchema
import polyvolve.prototype.api.data.models.team.Team
import polyvolve.prototype.api.data.models.user.User
import java.time.temporal.ChronoUnit
import java.util.*
import javax.persistence.*

/**
 * Contains master data for a [Review].
 *
 * TODO create separate iteration table and map values to these iterations.
 */
@Entity
@Table(name = "review_masters")
class ReviewMaster() : HasName {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(
            name = "UUID",
            strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id", updatable = false, nullable = false)
    var id: UUID? = null

    @Column(unique = true)
    lateinit var name: String
    lateinit var periodStart: Date
    lateinit var periodEnd: Date
    lateinit var dueAt: Date
    lateinit var scope: String
    var interval = -1L
    var intervalType: IntervalType? = null
    var description = ""
    var status = StatusType.INACTIVE
    var lastReminder: Date? = null
    var iteration = 0
    var createdAt = Date()
    var allowSelfEvaluation = true

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "review_schema_id", nullable = false)
    var schema: ReviewSchema? = null
    // TODO add priority

    /**
     * The [User]s which are subject to being reviewed in the [ReviewMaster].
     */
    @ManyToMany
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinTable(
            name = "review_master_user",
            joinColumns = [JoinColumn(name = "review_master_id")],
            inverseJoinColumns = [JoinColumn(name = "user_id")])
    @JsonIgnore
    var reviewedUsers: MutableSet<User> = mutableSetOf()

    /**
     * The associated [User]s of a [Team] will review the [reviewedUsers].
     */
    @ManyToMany
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinTable(
            name = "review_master_team",
            joinColumns = [JoinColumn(name = "review_master_id")],
            inverseJoinColumns = [JoinColumn(name = "team_id")])
    @JsonIgnore
    var teams: MutableSet<Team> = mutableSetOf()

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "master", cascade = [CascadeType.ALL])
    @JsonIgnore
    var reviews: Set<Review> = emptySet()

    fun getReviewingUsers(): List<User> = teams.flatMap { team -> team.users }.distinct()

    @JsonIgnore
    private fun hasEnded(reminderConfig: ReminderConfig): Boolean = Date().toInstant()
            .isAfter(dueAt.toInstant().plus(reminderConfig.delayForClosureAfterDueDateWasReached, ChronoUnit.DAYS))

    @JsonIgnore
    override fun getDisplayName(): String = name

    @JsonIgnore
    fun hasConsistentDates(): Boolean {
        return true
    }

    @JsonIgnore
    fun isActive(reminderConfig: ReminderConfig): Boolean = status == StatusType.ACTIVE && !hasEnded(reminderConfig)

    /**
     * See return.
     *
     * @return Indicates whether the reminders should be scheduled.
     */
    @JsonIgnore
    fun isCriticallyDue(reminderConfig: ReminderConfig): Boolean = !hasEnded(reminderConfig) &&
            dueAt.toInstant().minus(reminderConfig.leftDaysForCriticalReviewMaster, ChronoUnit.DAYS)
                    .isBefore(Date().toInstant())

    constructor(name: String,
                periodStart: Date,
                periodEnd: Date,
                dueAt: Date,
                scope: String,
                interval: Long,
                schema: ReviewSchema,
                intervalType: IntervalType?) : this() {
        this.name = name
        this.periodStart = periodStart
        this.periodEnd = periodEnd
        this.dueAt = dueAt
        this.scope = scope
        this.interval = interval
        this.schema = schema
        this.intervalType = intervalType
    }

    override fun equals(other: Any?): Boolean {
        return other is ReviewMaster && other.id == this.id
    }

    override fun hashCode(): Int {
        var result = id?.hashCode() ?: 0
        result = 31 * result + name.hashCode()
        result = 31 * result + periodStart.hashCode()
        result = 31 * result + periodEnd.hashCode()
        result = 31 * result + dueAt.hashCode()
        result = 31 * result + scope.hashCode()
        result = 31 * result + interval.hashCode()
        result = 31 * result + (intervalType?.hashCode() ?: 0)
        result = 31 * result + description.hashCode()
        result = 31 * result + status.hashCode()
        result = 31 * result + (lastReminder?.hashCode() ?: 0)
        result = 31 * result + iteration
        result = 31 * result + createdAt.hashCode()
        result = 31 * result + allowSelfEvaluation.hashCode()
        result = 31 * result + (schema?.hashCode() ?: 0)
        result = 31 * result + reviewedUsers.hashCode()
        result = 31 * result + teams.hashCode()
        result = 31 * result + reviews.hashCode()
        return result
    }
}