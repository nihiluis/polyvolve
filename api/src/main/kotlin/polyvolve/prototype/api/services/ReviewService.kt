package polyvolve.prototype.api.services

import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import polyvolve.prototype.api.data.models.user.User
import polyvolve.prototype.api.data.models.review.Review
import polyvolve.prototype.api.data.models.review.user.ReviewUser
import polyvolve.prototype.api.data.models.review.value.ReviewCriterionValueObject
import polyvolve.prototype.api.data.models.schema.ReviewCriterion
import polyvolve.prototype.api.data.repositories.*
import polyvolve.prototype.api.util.ReviewCriterionWithValue
import java.util.*

@Service
class ReviewService(private var reviewMasterRepository: ReviewMasterRepository,
                    private var reviewUserRepository: ReviewUserRepository,
                    private var reviewRepository: ReviewRepository,
                    private var reviewCriterionValueRepository: ReviewCriterionValueRepository,
                    private var userRepository: UserRepository) : PolyvolveService {
    private val logger = LoggerFactory.getLogger(this::class.java)

    fun createReview(userId: UUID, masterId: UUID): UUID {
        val master = reviewMasterRepository.findById(masterId).orElse(null)
                ?: throw IllegalArgumentException("Unable to find master with criterion $masterId")
        val user = userRepository.findById(userId).orElse(null)
                ?: throw IllegalArgumentException("Unable to find user with criterion $userId")

        val review = Review(master, user)

        return reviewRepository.save(review).id ?: throw IllegalStateException("UUID was not generated")
    }

    fun createReview(review: Review): Review = reviewRepository.save(review)

    fun getReview(reviewId: UUID): Review? = reviewRepository.findById(reviewId).orElse(null)

    fun createReviewUser(reviewId: UUID, userId: UUID): ReviewUser {
        val review = reviewRepository.findById(reviewId).orElse(null)
                ?: throw IllegalArgumentException("Unable to find review with criterion $reviewId")
        val user = userRepository.findById(userId).orElse(null)
                ?: throw IllegalArgumentException("Unable to find user with criterion $userId")

        return createReviewUser(review, user)
    }

    fun createReviewUser(review: Review, user: User): ReviewUser {
        val reviewUser = ReviewUser(review, user)

        return reviewUserRepository.save(reviewUser)
    }


    fun getAllReviewsByUser(userId: String): Iterable<Review> {
        val user = userRepository.findById(UUID.fromString(userId)).orElse(null)
                ?: throw IllegalArgumentException("Unable to find user with criterion $userId")

        return reviewRepository.findAllByReviewingUser(user)
    }

    fun getAllReviewUsers(reviewId: String): Iterable<ReviewUser> {
        val review = reviewRepository.findById(UUID.fromString(reviewId)).orElse(null)
                ?: throw IllegalArgumentException("Unable to find review with criterion $reviewId")

        return reviewUserRepository.findAllByReview(review)
    }

    fun getReviewUser(reviewUserId: UUID): ReviewUser? = reviewUserRepository.findById(reviewUserId).orElse(null)

    fun getValuesOnReviewUser(reviewUser: ReviewUser): Iterable<ReviewCriterionValueObject> =
            reviewCriterionValueRepository.findByReviewUser(reviewUser)

    fun setValueOnReviewUser(reviewUser: ReviewUser, criterion: ReviewCriterion, value: Any) {
        val valueCast = criterion.type.createForType(value)
        var reviewCriterionValue = reviewCriterionValueRepository.findByReviewUserAndCriterion(reviewUser, criterion).orElse(null)
        if (reviewCriterionValue == null) {
            reviewCriterionValue = ReviewCriterionValueObject(criterion, reviewUser, valueCast)
        } else {
            reviewCriterionValue.value = valueCast
        }

        reviewCriterionValueRepository.save(reviewCriterionValue)
    }

    fun setValuesOnReviewUser(reviewUser: ReviewUser, criterionAndValues: Iterable<ReviewCriterionWithValue>) {
        val reviewCriterionValues = criterionAndValues.map { criterionAndValue ->
            val criterion = criterionAndValue.criterion
            val valueCast = criterion.type.createForType(criterionAndValue.value)

            var reviewCriterionValue = reviewCriterionValueRepository.findByReviewUserAndCriterion(reviewUser, criterion).orElse(null)
            if (reviewCriterionValue == null) {
                reviewCriterionValue = ReviewCriterionValueObject(criterion, reviewUser, valueCast)
            } else {
                reviewCriterionValue.value = valueCast
            }

            reviewCriterionValue
        }

        reviewCriterionValueRepository.saveAll(reviewCriterionValues)
    }

    fun getReviewUsersFromUser(user: User): Iterable<ReviewUser> = reviewUserRepository.findAllByReviewedUser(user)
}