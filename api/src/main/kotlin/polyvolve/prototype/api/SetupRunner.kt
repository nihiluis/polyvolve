package polyvolve.prototype.api

import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.boot.ApplicationArguments
import org.springframework.boot.ApplicationRunner
import org.springframework.stereotype.Component
import polyvolve.prototype.api.data.models.admin.Admin
import polyvolve.prototype.api.data.repositories.AdminRepository
import polyvolve.prototype.api.services.AdminService
import polyvolve.prototype.api.services.AuthService

/**
 * Adds additional database setup steps.
 *
 * 1) If no [Admin]s can be found, add a default account.
 *    TODO add additional check later, so this really gets run only once.
 */
@Component
class SetupRunner(val adminRepository: AdminRepository,
                  val adminService: AdminService,
                  val authService: AuthService) : ApplicationRunner {
    private val logger: Logger = LoggerFactory.getLogger(SetupRunner::class.java)

    @Throws(Exception::class)
    override fun run(args: ApplicationArguments) {
        val count = adminRepository.count()
        if (count == 0L) {
            val randomPassword = "test"
            val mail = "info@info.com"
            val adminId = adminService.createDummyAccount(mail, randomPassword, "Bartolomaeus", "Rolf")

            logger.info("First startup: created Admin $adminId with mail $mail with password $randomPassword." +
                    " Make sure to delete the account/change the password.")
        }
    }
}