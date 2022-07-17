package polyvolve.prototype.api.services

import org.springframework.stereotype.Service
import polyvolve.prototype.api.data.models.admin.Admin
import polyvolve.prototype.api.data.models.admin.MarkedUser
import polyvolve.prototype.api.data.models.user.User
import polyvolve.prototype.api.data.models.user.Sex
import polyvolve.prototype.api.data.repositories.UserRepository
import polyvolve.prototype.api.data.repositories.MarkedUserRepository
import polyvolve.prototype.api.data.repositories.TeamRepository
import java.util.*

@Service
class UserService(private var userRepository: UserRepository,
                  private var teamRepository: TeamRepository,
                  private var markedUserRepository: MarkedUserRepository) {
    fun create(mail: String, name: String, surname: String, position: String, sex: Sex): UUID {
        val user = User(mail, name, surname, sex)
        user.position = position

        return create(user)
    }

    fun create(user: User): UUID {
        if (exists(user.mail)) {
            throw IllegalArgumentException("${user.mail} is already used")
        }

        val savedUser = userRepository.save(user)
        if (savedUser.id == null) {
            throw IllegalStateException("User ${user.mail} has no criterion after being saved!")
        }

        return savedUser.id!!
    }

    fun getByMail(mail: String): User? {
        return userRepository.findByMail(mail).orElse(null)
    }

    fun exists(mail: String): Boolean {
        return getByMail(mail) != null
    }

    fun get(id: UUID): User? {
        return userRepository.findById(id).orElse(null)
    }

    fun getAll(): Iterable<User> {
        return userRepository.findAll()
    }

    fun delete(id: UUID) {
        userRepository.findById(id).ifPresent { user ->
            userRepository.delete(user)
        }
    }

    fun delete(mail: String) {
        userRepository.findByMail(mail).ifPresent { user ->
            userRepository.delete(user)
        }
    }

    fun update(id: UUID,
               name: String?,
               surname: String?,
               description: String?,
               position: String?,
               teamIds: List<UUID>?): User {
        val user = userRepository.findById(id).orElse(null)
                ?: throw IllegalArgumentException("Unable to find user with criterion $id.")

        if (name != null) {
            user.name = name
        }

        if (surname != null) {
            user.surname = surname
        }

        if (description != null) {
            user.description = description
        }

        if (position != null) {
            user.position = position
        }

        val updatedUser = update(user)

        if (teamIds != null) {
            val teams = teamRepository.findAllById(teamIds).toList()

            if (teams.size != teamIds.size) {
                val missingTeamIds = teamIds.subtract(teams.filter { team -> teamIds.contains(team.id) }).joinToString(", ")
                throw IllegalArgumentException("Teams with ids [$missingTeamIds] don't exist.")
            }

            for (team in teams) {
                team.users.add(updatedUser)
            }

            teamRepository.saveAll(teams)
        }

        return updatedUser
    }

    fun update(user: User): User = userRepository.save(user)

    fun markUser(admin: Admin, user: User): MarkedUser {
        val markedUser = MarkedUser(admin, user)

        return markedUserRepository.save(markedUser)
    }

    fun getMarkedUser(markedUserId: UUID) = markedUserRepository.findById(markedUserId).orElse(null)

    fun getMarkedUsers(admin: Admin): Iterable<MarkedUser> {
        return markedUserRepository.findAllByAdmin(admin)
    }

    fun removeMarkedUser(markedUser: MarkedUser) = removeMarkedUser(markedUser.id!!)

    fun removeMarkedUser(markedUserId: UUID)  = markedUserRepository.deleteById(markedUserId)
}