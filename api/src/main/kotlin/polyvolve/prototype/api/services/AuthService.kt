package polyvolve.prototype.api.services

import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import polyvolve.prototype.api.data.repositories.AdminRepository
import polyvolve.prototype.api.data.repositories.InviteRepository
import polyvolve.prototype.api.util.PasswordUtils


@Service
class AuthService(val adminRepository: AdminRepository,
                  val inviteRepository: InviteRepository,
                  val authenticationManager: AuthenticationManager,
                  val adminDetailsService: UserDetailsService,
                  val passwordEncoder: PasswordEncoder) {
    fun autoLogin(mail: String, password: String) {
        val adminDetails = adminDetailsService.loadUserByUsername(mail)
        val usernamePasswordAuthenticationToken = UsernamePasswordAuthenticationToken(adminDetails, password, adminDetails.authorities)

        authenticationManager.authenticate(usernamePasswordAuthenticationToken)

        if (usernamePasswordAuthenticationToken.isAuthenticated) {
            SecurityContextHolder.getContext().authentication = usernamePasswordAuthenticationToken
        }
    }

    fun createRandomPassword(length: Int): String {
        return PasswordUtils.getRandomPassword(9)
    }

    fun hashPassword(password: String): String {
        return passwordEncoder.encode(password)
    }
}