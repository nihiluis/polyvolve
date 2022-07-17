package polyvolve.prototype.api.services

import org.springframework.stereotype.Service
import polyvolve.prototype.api.data.models.team.Team
import polyvolve.prototype.api.data.repositories.UserRepository
import polyvolve.prototype.api.data.repositories.TeamRepository
import java.util.*

@Service
class TeamService(private val teamRepository: TeamRepository,
                  private val userRepository: UserRepository) {
    fun create(name: String, description: String): UUID {
        val team = Team(name)

        team.description = description

        return create(team)
    }

    fun create(team: Team): UUID {
        if (exists(team.name)) {
            throw IllegalArgumentException("Name ${team.name} is already used")
        }

        val savedTeam = teamRepository.save(team)
        if (savedTeam.id == null) {
            throw IllegalStateException("Team ${team.name} has no criterion after being saved!")
        }

        return savedTeam.id!!
    }

    fun getFromName(name: String): Team? = teamRepository.findByName(name).orElse(null)

    fun exists(name: String): Boolean = getFromName(name) != null

    fun get(id: UUID): Team? = teamRepository.findById(id).orElse(null)

    fun getAll(): Iterable<Team> = teamRepository.findAll()

    fun delete(id: UUID) {
        teamRepository.findById(id).ifPresent { team ->
            teamRepository.delete(team)
        }
    }

    fun delete(name: String) {
        teamRepository.findByName(name).ifPresent { team ->
            teamRepository.delete(team)
        }
    }

    fun update(id: UUID, name: String?, description: String?, userIds: List<UUID>?): Team  {
        val team = teamRepository.findById(id).orElse(null)
                ?: throw IllegalArgumentException("Unable to find team with criterion $id.")

        if (name != null) {
            team.name = name
        }

        if (description != null) {
            team.description = description
        }

        if (userIds != null) {
            val users = userRepository.findAllById(userIds)

            team.users = users.toMutableSet()
        }

        return update(team)
    }

    fun update(team: Team): Team = teamRepository.save(team)
}