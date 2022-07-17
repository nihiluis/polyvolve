package polyvolve.prototype.api.data.models.recentlyviewed

import com.fasterxml.jackson.annotation.JsonIgnore
import com.fasterxml.jackson.annotation.JsonInclude
import org.hibernate.annotations.GenericGenerator
import polyvolve.prototype.api.data.models.admin.Admin
import java.util.*
import javax.persistence.*
import kotlin.jvm.Transient


@Entity
@Table(name = "recently_viewed")
class RecentlyViewedItem() {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(
            name = "UUID",
            strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id", updatable = false, nullable = false)
    var id: UUID? = null

    lateinit var type: RecentlyViewedType
    lateinit var targetId: UUID
    lateinit var date: Date

    @JsonInclude
    @Transient
    var name: String? = null

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "admin_id", nullable = false)
    @JsonIgnore
    lateinit var admin: Admin

    constructor(type: RecentlyViewedType,
                targetId: UUID,
                date: Date,
                admin: Admin): this() {
        this.type = type
        this.targetId = targetId
        this.date = date
        this.admin = admin
    }
}