package polyvolve.prototype.api.data.repositories

import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository
import polyvolve.prototype.api.data.models.team.Team
import java.util.*

@Repository
interface TeamRepository : CrudRepository<Team, UUID> {
    fun findByName(name: String): Optional<Team>
}