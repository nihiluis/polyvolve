package polyvolve.prototype.api.data.models.admin

import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.OnDelete
import org.hibernate.annotations.OnDeleteAction
import polyvolve.prototype.api.data.models.abstr.Person
import polyvolve.prototype.api.data.models.recentlyviewed.RecentlyViewedItem
import java.util.*
import javax.persistence.*

/**
 * The person who is administrating the Polyvolve instance and operating the admin SaaS.
 */
@Entity
@Table(name = "admins")
//@JsonIgnoreProperties(ignoreUnknown = true)
class Admin() : Person {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(
            name = "UUID",
            strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id", updatable = false, nullable = false)
    var id: UUID? = null

    @Column(unique = true)
    lateinit var mail: String
    lateinit var password: String

    override var name = ""
    override var surname = ""
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_id")
    var invitedBy: Admin? = null

    @OneToMany(cascade = [CascadeType.ALL],
            fetch = FetchType.LAZY,
            mappedBy = "admin")
    @OnDelete(action = OnDeleteAction.CASCADE)
    var markedUsers: Set<MarkedUser> = emptySet()

    @OneToMany(cascade = [CascadeType.ALL],
            fetch = FetchType.LAZY,
            mappedBy = "admin")
    @OnDelete(action = OnDeleteAction.CASCADE)
    var recentlyViewed: Set<RecentlyViewedItem> = emptySet()

    constructor(mail: String, password: String, name: String, surname: String, invitedBy: Admin?) : this() {
        this.mail = mail
        this.password = password
        this.name = name
        this.surname = surname
        this.invitedBy = invitedBy
    }
}