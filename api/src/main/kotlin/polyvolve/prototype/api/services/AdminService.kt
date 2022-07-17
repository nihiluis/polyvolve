package polyvolve.prototype.api.services

import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import polyvolve.prototype.api.data.models.admin.Admin
import polyvolve.prototype.api.data.repositories.AdminRepository
import polyvolve.prototype.api.util.exceptions.AuthException
import java.security.Principal
import java.util.*

@Service
class AdminService(val adminRepository: AdminRepository,
                   val authService: AuthService) {
    private val logger: Logger = LoggerFactory.getLogger(this::class.java)

    fun getAdmin(mail: String): Admin? = adminRepository.findByMail(mail).orElse(null)

    fun createDummyAccount(mail: String, password: String, name: String, surname: String): UUID {
        val hashedPassword = authService.hashPassword(password)

        val admin = adminRepository.save(Admin(mail, hashedPassword, name, surname, null))

        return admin.id!!
    }

    fun retrieveAdminAndThrow(principal: Principal?): Admin {
        if (principal == null) throw AuthException("Not logged in.")

        val admin =  getAdmin(principal.name)
                ?: throw AuthException("Unknown user.")

        logger.debug("Retrieved admin ${admin.name} ${admin.surname} with criterion ${admin.id}.")

        return admin
    }
}