package polyvolve.prototype.api

import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional
import polyvolve.prototype.api.config.ReminderConfig
import polyvolve.prototype.api.services.ReviewMasterService
import java.time.temporal.ChronoUnit
import java.util.*

@Component
class ScheduledTasks(private val reviewMasterService: ReviewMasterService,
                     private val reminderConfig: ReminderConfig) {
    private val logger: Logger = LoggerFactory.getLogger(ScheduledTasks::class.java)

    companion object {
        const val MIN_INTERVAL_BETWEEN_REMINDERS_IN_DAYS = 1L
    }

    /**
     * Check reminders every 600 seconds.
     */
    @Scheduled(fixedRate = 60 * 1000 * 10)
    @Transactional
    fun scheduleReminder() {
        logger.info("Scheduling reminders...")

        val reviewMasters = reviewMasterService.getAllReviewMasters()

        reviewMasters.asSequence()
                .filter { reviewMaster ->
                    if (!reviewMaster.isActive(reminderConfig)) {
                        logger.debug("Not triggering reminder for ReviewMaster ${reviewMaster.id} because it is not active")
                        return@filter false
                    }

                    if (reviewMaster.lastReminder == null) {
                        logger.debug("Triggering reminder for ReviewMaster ${reviewMaster.id} because no reminder has been made yet")
                        return@filter true
                    }

                    if (reviewMaster.lastReminder!!.toInstant().plus(MIN_INTERVAL_BETWEEN_REMINDERS_IN_DAYS, ChronoUnit.DAYS).isAfter(Date().toInstant())) {
                        logger.debug("Not triggering reminder for ReviewMaster ${reviewMaster.id} because the minimum period of days between reminders has not passed yet")

                        // This indicates that the minimum interval between reminders in days has not yet passed
                        return@filter false
                    }

                    if (reviewMaster.isCriticallyDue(reminderConfig)) {
                        logger.debug("Triggering reminder for ReviewMaster ${reviewMaster.id} because the dueDate will be reached soon")

                        return@filter true
                    }

                    if (reviewMaster.lastReminder!!.toInstant().plus(reminderConfig.regularReminderInterval, ChronoUnit.DAYS).isBefore(Date().toInstant())) {
                        // This indicates that the regular reminder interval has passed since the last issued reminder. Therefore we can start again.
                        logger.debug("Triggering reminder for ReviewMaster ${reviewMaster.id} because the interval for the regular reminder has been reached")

                        return@filter true
                    }

                    logger.debug("Not triggering reminder for ReviewMaster ${reviewMaster.id} because no remind criterion is fulfilled")

                    return@filter false
                }
                .forEach { reviewMaster ->
                    logger.debug("Executing trigger reminder for ReviewMaster ${reviewMaster.id}")

                    reviewMasterService.triggerReminder(reviewMaster, null, null)

                    // TODO send status report about who has yet to participate to the Admin
                }

        reviewMasters.asSequence().filter {
            // TODO on finish send mail to Admin
            true
        }
    }
}