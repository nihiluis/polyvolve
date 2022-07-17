package polyvolve.prototype.api.data.repositories

import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository
import polyvolve.prototype.api.data.models.user.User
import java.util.*

/**
 * The repository interfaces are automatically implemented on runtime by Spring Boot. Therefore we use Optional here,
 * instead of nullable types.
 */

@Repository
interface UserRepository : CrudRepository<User, UUID> {
    fun findByMail(mail: String): Optional<User>
    //fun findAllByTeam(team: Team): Iterable<Leader>
}