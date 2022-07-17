package polyvolve.prototype.api.services

import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service
import polyvolve.prototype.api.data.repositories.AdminRepository
import javax.transaction.Transactional
import org.springframework.security.core.userdetails.User as SpringUser

@Service
@Transactional
class AdminDetailsService(val adminRepository: AdminRepository) : UserDetailsService {
    @Throws(UsernameNotFoundException::class)
    override fun loadUserByUsername(mail: String): UserDetails {
        val admin = adminRepository.findByMail(mail).orElse(null) ?: throw UsernameNotFoundException(
                "No admin found with mail: $mail")

        val enabled = true
        val accountNonExpired = true
        val credentialsNonExpired = true
        val accountNonLocked = true
        val grantedAuthorities = listOf<GrantedAuthority>()

        return SpringUser(
                admin.mail,
                admin.password,
                enabled,
                accountNonExpired,
                credentialsNonExpired,
                accountNonLocked,
                grantedAuthorities)
    }
}