package polyvolve.prototype.api.services

import org.springframework.stereotype.Service
import polyvolve.prototype.api.data.models.admin.Admin
import polyvolve.prototype.api.data.models.invite.Invite
import polyvolve.prototype.api.data.repositories.AdminRepository
import polyvolve.prototype.api.data.repositories.InviteRepository
import java.util.*

@Service
class InviteService(val adminRepository: AdminRepository,
                    val inviteRepository: InviteRepository,
                    val authService: AuthService) {
    fun createInvite(mail: String): UUID {
        val existingInvite = inviteRepository.findByMail(mail).orElse(null)
        if (existingInvite != null) {
            throw IllegalArgumentException("Mail $mail is already invited.")
        }

        val invite = Invite(mail, null)

        val newInvite = inviteRepository.save(invite)

        return newInvite.id!!
    }

    fun acceptInvite(inviteId: UUID, mail: String, password: String, name: String, surname: String): UUID {
        val existingInvite = inviteRepository.findById(inviteId).orElse(null)
                ?: throw IllegalArgumentException("$inviteId is not associated to a valid Invite.")

        val hashedPassword = authService.hashPassword(password)

        val admin = adminRepository.save(Admin(mail, hashedPassword, name, surname, existingInvite.createdBy))

        inviteRepository.delete(existingInvite)

        return admin.id!!
    }

    fun getInvites(): Iterable<Invite> {
        return inviteRepository.findAll()
    }

    fun removeInvite(mail: String) {
        val existingInvite = inviteRepository.findByMail(mail).orElse(null)
                ?: throw IllegalArgumentException("Invite for mail $mail does not exist.")

        inviteRepository.delete(existingInvite)
    }
}