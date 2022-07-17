package polyvolve.prototype.api.data.repositories

import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository
import polyvolve.prototype.api.data.models.invite.Invite
import java.util.*

@Repository
interface InviteRepository : CrudRepository<Invite, UUID> {
    fun findByMail(mail: String): Optional<Invite>
}