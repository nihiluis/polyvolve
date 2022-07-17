package polyvolve.prototype.api.services

import org.springframework.stereotype.Service
import polyvolve.prototype.api.data.models.DataHash
import polyvolve.prototype.api.data.models.admin.Admin
import polyvolve.prototype.api.data.models.review.master.IntervalType
import polyvolve.prototype.api.data.models.review.master.ReviewMaster
import polyvolve.prototype.api.data.models.review.master.ReviewMasterScoreItem
import polyvolve.prototype.api.data.models.review.master.StatusType
import polyvolve.prototype.api.data.models.schema.ReviewSchema
import polyvolve.prototype.api.data.models.user.User
import polyvolve.prototype.api.data.repositories.*
import java.util.*

@Service
class ReviewMasterService(private var dataHashService: DataHashService,
                          private var reviewMasterRepository: ReviewMasterRepository,
                          private var teamRepository: TeamRepository,
                          private var userRepository: UserRepository,
                          private var dataHashRepository: DataHashRepository,
                          private var mailService: MailService) {
    fun createReviewMaster(name: String,
                           dueAt: Date,
                           periodStart: Date,
                           periodEnd: Date,
                           scope: String,
                           interval: Long,
                           schema: ReviewSchema,
                           intervalType: IntervalType?): UUID {
        val reviewMaster = ReviewMaster(
                name,
                periodStart,
                periodEnd,
                dueAt,
                scope,
                interval,
                schema,
                intervalType)

        val newReviewMaster = reviewMasterRepository.save(reviewMaster)

        return newReviewMaster.id!!
    }

    fun updateReviewMaster(id: UUID,
                           name: String?,
                           description: String?,
                           periodStart: Date?,
                           periodEnd: Date?,
                           dueAt: Date?,
                           interval: Long?,
                           intervalType: IntervalType?,
                           status: StatusType?,
                           userIds: List<UUID>?,
                           teamIds: List<UUID>?): ReviewMaster {
        val reviewMaster = reviewMasterRepository.findById(id).orElse(null)
                ?: throw IllegalArgumentException("Unable to find reviewMaster with criterion $id.")

        if (name != null) reviewMaster.name = name
        if (description != null) reviewMaster.description = description
        if (periodStart != null) reviewMaster.periodStart = periodStart
        if (periodEnd != null) reviewMaster.periodEnd = periodEnd
        if (interval != null) reviewMaster.interval = interval
        if (intervalType != null) reviewMaster.intervalType = intervalType
        if (status != null) reviewMaster.status = status
        if (userIds != null) {
            val users = userRepository.findAllById(userIds)

            reviewMaster.reviewedUsers = users.toMutableSet()
        }
        if (teamIds != null) {
            val teams = teamRepository.findAllById(teamIds)

            reviewMaster.teams = teams.toMutableSet()
        }

        return updateReviewMaster(reviewMaster)
    }

    fun updateReviewMaster(reviewMaster: ReviewMaster): ReviewMaster {
        if (!reviewMaster.hasConsistentDates()) throw IllegalArgumentException("Inconsistent dates for ${reviewMaster.name}")

        return reviewMasterRepository.save(reviewMaster)
    }

    fun getAllReviewMasters(): Iterable<ReviewMaster> = reviewMasterRepository.findAll()
    fun getReviewMaster(reviewMasterId: UUID): ReviewMaster? = reviewMasterRepository.findById(reviewMasterId).orElse(null)

    fun getOrCreateDataHash(reviewMaster: ReviewMaster, user: User): DataHash {
        var dataHash = dataHashRepository.findByMasterAndUser(reviewMaster, user)
        if (dataHash == null) {
            dataHash = dataHashService.createDataHash(reviewMaster, user)
        }

        return dataHash
    }

    fun triggerReminder(reviewMaster: ReviewMaster, byAdmin: Admin? = null, targetUser: User? = null) {
        //val userReviewMap = HashMap<User, Review>()

        val notDoneByUsers = if (targetUser == null) {
            val alreadyDoneByUsers = reviewMaster.reviews.asSequence()
                    .filter { review ->
                        //if (!hasCompleted) {
                        //    userReviewMap[review.user] = review
                        //}

                        return@filter review.iteration == reviewMaster.iteration && review.markedCompleted
                    }
                    .map { review -> review.reviewingUser }
                    .toList()

            val allUsers = reviewMaster.getReviewingUsers()

            allUsers.subtract(alreadyDoneByUsers)
        } else listOf(targetUser)

        val dataHashes = dataHashRepository.findAllByMaster(reviewMaster).associateBy({ it.user!!.id!! }, { it })

        val isFirstReminder = reviewMaster.lastReminder == null

        // Might be resource intensive due to unnecessary blocking IO. Not sure if this is transactional.
        for (user in notDoneByUsers) {
            var dataHash = dataHashes[user.id]
            if (dataHash == null) {
                dataHash = dataHashService.createDataHash(reviewMaster, user)
            }

            mailService.sendReminderMessage(dataHash, byAdmin, isFirstReminder)
        }

        reviewMaster.lastReminder = Date()

        reviewMasterRepository.save(reviewMaster)
    }

    /**
     * Looks like a bottleneck method. Has total size of reviewedUsers.size * reviewingUsers.size * allCriteria.size.
     */
    fun getScores(reviewMaster: ReviewMaster): List<ReviewMasterScoreItem> {
        val scoreItems = HashMap<UUID, HashMap<UUID, HashMap<UUID, ReviewMasterScoreItem>>>()
        val reviewedUsers = reviewMaster.reviewedUsers
        val reviewingUsers = reviewMaster.getReviewingUsers()

        reviewedUsers.forEach { reviewedUser ->
            scoreItems[reviewedUser.id!!] = HashMap()
            reviewingUsers.forEach { reviewingUser ->
                scoreItems[reviewedUser.id!!]!![reviewingUser.id!!] = HashMap()

                reviewMaster.schema!!.categories.forEach { category ->
                    category.criteria.forEach { criterion ->
                        scoreItems[reviewedUser.id!!]!![reviewingUser.id!!]!![criterion.id!!] = ReviewMasterScoreItem(
                                reviewedId = reviewedUser.id!!,
                                reviewedMail = reviewedUser.mail,
                                reviewerId = reviewingUser.id!!,
                                reviewerMail = reviewingUser.mail,
                                categoryId = category.id!!,
                                categoryName = category.name,
                                criterionId = criterion.id!!,
                                criterionName = criterion.name,
                                criterionType = criterion.type.string,
                                value = null)
                    }
                }
            }
        }

        reviewMaster.reviews
                .flatMap { review -> review.reviewUsers }
                .forEach { reviewUser ->
                    val reviewingUser = reviewUser.review.reviewingUser
                    val reviewedUser = reviewUser.reviewedUser

                    reviewUser.values.map { value ->
                        val criterion = value.criterion!!

                        scoreItems[reviewedUser.id!!]!![reviewingUser.id!!]!![criterion.id!!]!!.value = value.value!!.value
                    }
                }

        return scoreItems.values.flatMap { map -> map.values }.flatMap { map -> map.values }
    }
}