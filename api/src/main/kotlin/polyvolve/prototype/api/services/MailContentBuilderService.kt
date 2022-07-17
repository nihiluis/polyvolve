package polyvolve.prototype.api.services

import org.springframework.stereotype.Service
import org.thymeleaf.TemplateEngine
import org.thymeleaf.context.Context

@Service
class MailContentBuilderService(private val templateEngine: TemplateEngine) {
    fun build(adminName: String,
              userName: String,
              reviewMasterName: String,
              reviewMasterIteration: Int,
              link: String,
              dueDate: String,
              isFirstReminder: Boolean): String {
        val context = Context()
        context.setVariable("adminName", adminName)
        context.setVariable("userName", userName)
        context.setVariable("reviewMasterName", reviewMasterName)
        context.setVariable("reviewMasterIteration", reviewMasterIteration)
        context.setVariable("reviewLink", link)
        context.setVariable("dueDate", dueDate)

        val templateName = if (isFirstReminder) "first-reminder-mail" else "regular-reminder-mail"

        return templateEngine.process(templateName, context)
    }
}