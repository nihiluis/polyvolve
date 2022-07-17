package polyvolve.prototype.api.config

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.stereotype.Component

@Component
@ConfigurationProperties("polyvolve.reminder")
class ReminderConfig {
    var leftDaysForCriticalReviewMaster = 3L
    var regularReminderInterval = 7L
    var delayForClosureAfterDueDateWasReached = 3L
}