package polyvolve.prototype.api.data.repositories

import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository
import polyvolve.prototype.api.data.models.admin.Admin
import polyvolve.prototype.api.data.models.admin.MarkedUser
import java.util.*

@Repository
interface MarkedUserRepository : CrudRepository<MarkedUser, UUID> {
    fun findAllByAdmin(admin: Admin): Iterable<MarkedUser>
}