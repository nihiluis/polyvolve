package polyvolve.prototype.api.services

import org.slf4j.LoggerFactory
import org.springframework.mail.SimpleMailMessage
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.stereotype.Service
import org.springframework.mail.javamail.MimeMessageHelper
import polyvolve.prototype.api.config.GeneralConfig
import polyvolve.prototype.api.config.MailConfig
import polyvolve.prototype.api.data.models.DataHash
import polyvolve.prototype.api.data.models.admin.Admin
import polyvolve.prototype.api.util.exceptions.MissingRelationException
import java.text.SimpleDateFormat
import javax.mail.internet.MimeMessage


@Service
class MailService(private val sender: JavaMailSender,
                  private val mailContentBuilder: MailContentBuilderService,
                  private val mailConfig: MailConfig,
                  private val generalConfig: GeneralConfig) {
    private val logger = LoggerFactory.getLogger(javaClass)

    fun sendSimpleMessage(to: String, subject: String, text: String) {
        val message = SimpleMailMessage()
        message.setTo(to)
        message.setSubject(subject)
        message.setText(text)

        //sender.send(message)
    }

    fun sendReminderMessage(dataHash: DataHash, admin: Admin?, isFirstReminder: Boolean = false) {
        val messagePreparator = { mimeMessage: MimeMessage ->
            val dateFormatter = SimpleDateFormat("MM-dd-YYYY")

            val link = generalConfig.reviewUrl + "/?id=${dataHash.id}"

            val master = dataHash.master ?: throw MissingRelationException("DataHash ${dataHash.id} has no master! Unable to send mail.")
            val user = dataHash.user ?: throw MissingRelationException("DataHash ${dataHash.id} has no user! Unable to send mail.")

            val formattedDueDate = dateFormatter.format(master.dueAt)

            val messageHelper = MimeMessageHelper(mimeMessage)
            messageHelper.setFrom(mailConfig.from)
            messageHelper.setTo(user.mail)
            messageHelper.setSubject("Polyvolve review reminder: ${master.name}")

            messageHelper.setText(mailContentBuilder.build(
                    admin?.getDisplayName() ?: "Polyvolve",
                    user.getDisplayName(),
                    master.getDisplayName(),
                    master.iteration + 1,
                    link,
                    formattedDueDate,
                    isFirstReminder), true)

            logger.debug("Sending reminder for ReviewMaster ${master.id} to User ${user.mail}")
        }


        //sender.send(messagePreparator)
    }
}