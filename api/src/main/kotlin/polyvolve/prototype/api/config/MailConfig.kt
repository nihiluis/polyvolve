package polyvolve.prototype.api.config

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.stereotype.Component

@Component
@ConfigurationProperties("polyvolve.mail")
class MailConfig {
    lateinit var from: String
}