package polyvolve.prototype.api.data.models.admin

import org.hibernate.annotations.GenericGenerator
import polyvolve.prototype.api.data.models.user.User
import java.util.*
import javax.persistence.*

@Entity
@Table(name = "marked_users", uniqueConstraints = [
    UniqueConstraint(columnNames = ["admin_id", "user_id"])])
class MarkedUser() {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(
            name = "UUID",
            strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id", updatable = false, nullable = false)
    var id: UUID? = null

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "admin_id", nullable = false)
    lateinit var admin: Admin

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    lateinit var user: User

    constructor(admin: Admin, user: User) : this() {
        this.admin = admin
        this.user = user
    }
}