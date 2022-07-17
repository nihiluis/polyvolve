package polyvolve.prototype.api.data.models.invite

import org.hibernate.annotations.GenericGenerator
import polyvolve.prototype.api.data.models.admin.Admin
import java.util.*
import javax.persistence.*

@Entity
@Table(name = "invites")
class Invite() {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(
            name = "UUID",
            strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id", updatable = false, nullable = false)
    var id: UUID? = null

    @Column(unique = true)
    var mail = ""

    @ManyToOne(cascade = [CascadeType.ALL],
            fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_id")
    var createdBy: Admin? = null

    var validTo: Date? = null

    constructor(mail: String, createdBy: Admin?) : this() {
        this.mail = mail
        this.createdBy = createdBy
    }
}