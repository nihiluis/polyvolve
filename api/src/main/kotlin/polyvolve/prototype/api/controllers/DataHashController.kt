package polyvolve.prototype.api.controllers

import org.springframework.http.MediaType
import org.springframework.validation.BindingResult
import org.springframework.validation.beanvalidation.SpringValidatorAdapter
import org.springframework.web.bind.annotation.*
import polyvolve.prototype.api.data.models.review.Review
import polyvolve.prototype.api.data.repositories.ReviewUserRepository
import polyvolve.prototype.api.data.repositories.ReviewRepository
import polyvolve.prototype.api.services.DataHashService
import polyvolve.prototype.api.services.UserService
import polyvolve.prototype.api.services.ReviewSchemaService
import polyvolve.prototype.api.services.ReviewService
import polyvolve.prototype.api.util.*
import polyvolve.prototype.api.util.exceptions.MissingRelationException
import java.util.*
import javax.validation.constraints.NotNull

@RestController
@RequestMapping("/datahash")
class DataHashController(private val dataHashService: DataHashService,
                         private val reviewService: ReviewService,
                         private val userService: UserService,
                         private val reviewRepository: ReviewRepository,
                         private val reviewUserRepository: ReviewUserRepository,
                         private val reviewSchemaService: ReviewSchemaService,
                         var validator: SpringValidatorAdapter) {
    @GetMapping("/get/{dataHashId}")
    fun getDataHash(@PathVariable dataHashId: UUID): OkResponseEntity {
        val dataHash = dataHashService.getDataHash(dataHashId)
                ?: throw IllegalArgumentException("Unknown dataHashId $dataHashId")

        return defaultOkResponse(dataHash)
    }

    @GetMapping("/review/create/{dataHashId}")
    fun createReview(@PathVariable dataHashId: UUID): OkResponseEntity {
        val dataHash = dataHashService.getDataHash(dataHashId)
                ?: throw IllegalArgumentException("Unknown dataHashId $dataHashId")

        if (dataHash.master == null) throw MissingRelationException("Unable to retrieve master for dataHash $dataHashId")
        if (dataHash.user == null) throw MissingRelationException("Unable to retrieve user for dataHash $dataHashId")

        val review = Review(dataHash.master!!, dataHash.user!!)

        return defaultOkResponse(reviewService.createReview(review))
    }

    @GetMapping("/review/getorcreate/{dataHashId}")
    fun getOrCreateReview(@PathVariable dataHashId: UUID): OkResponseEntity {
        val dataHash = dataHashService.getDataHash(dataHashId)
                ?: throw IllegalArgumentException("Unknown dataHashId $dataHashId")

        if (dataHash.master == null) throw MissingRelationException("Unable to retrieve master for dataHash $dataHashId")
        if (dataHash.user == null) throw MissingRelationException("Unable to retrieve user for dataHash $dataHashId")

        val master = dataHash.master!!
        val user = dataHash.user!!

        var review = reviewRepository.findByMasterAndReviewingUser(master, user)
        if (review == null) {
            val tmpReview = Review(master, user)

            review = reviewService.createReview(tmpReview)
        }

        return defaultOkResponse(review)
    }

    @PostMapping("/review/user/getorcreate", consumes = [MediaType.APPLICATION_JSON_VALUE])
    fun getOrCreateReviewUser(@RequestBody body: GetOrCreateReviewUserForm, bindingResult: BindingResult): OkResponseEntity {
        validator.validateAndThrow(body, bindingResult)

        val dataHashId = body.dataHashId!!
        val reviewId = body.reviewId!!
        val userId = body.userId!!

        dataHashService.getDataHash(dataHashId)
                ?: throw IllegalArgumentException("Unknown dataHashId $dataHashId")

        val review = reviewService.getReview(reviewId)
                ?: throw IllegalArgumentException("Unable to find review with criterion $reviewId")
        val user = userService.get(userId)
                ?: throw IllegalArgumentException("Unable to find user with criterion $userId")


        var reviewUser = reviewUserRepository.findByReviewAndReviewedUser(review, user).orElse(null)

        if (reviewUser == null) {
            reviewUser = reviewService.createReviewUser(reviewId, userId)
        }

        return defaultOkResponse(reviewUser)
    }

    @PostMapping("/review/user/value/get/all", consumes = [MediaType.APPLICATION_JSON_VALUE])
    fun getAllValues(@RequestBody body: GetReviewUserCriterionValuesForm, bindingResult: BindingResult): OkResponseEntity {
        validator.validateAndThrow(body, bindingResult)

        val dataHashId = body.dataHashId!!
        val reviewUserId = body.reviewUserId!!

        dataHashService.getDataHash(dataHashId)
                ?: throw IllegalArgumentException("Unknown dataHashId $dataHashId")

        val reviewUser = reviewService.getReviewUser(reviewUserId)
                ?: throw IllegalArgumentException("Unable to find ReviewUser $reviewUserId")

        return defaultOkResponse(reviewUser.values)
    }

    @PostMapping("/review/user/value/save/all", consumes = [MediaType.APPLICATION_JSON_VALUE])
    fun saveAllValues(@RequestBody body: SaveAllValuesForm, bindingResult: BindingResult): OkResponseEntity {
        validator.validateAndThrow(body, bindingResult)

        val dataHashId = body.dataHashId!!
        val reviewUserId = body.reviewUserId!!
        val values = body.values!!
        if (values.isEmpty()) {
            throw IllegalArgumentException("Cannot save empty values!")
        }

        dataHashService.getDataHash(dataHashId)
                ?: throw IllegalArgumentException("Unknown dataHashId $dataHashId")

        val reviewUser = reviewService.getReviewUser(reviewUserId)
                ?: throw IllegalArgumentException("Unable to find ReviewUser $reviewUserId")
        val criteriaWithValues = values.map { (criterionId, value) ->
            val criterion = reviewSchemaService.getReviewCriterion(criterionId!!)
                    ?: throw IllegalArgumentException("Unable to find criterion $criterionId")

            ReviewCriterionWithValue(criterion, value!!)
        }

        reviewService.setValuesOnReviewUser(reviewUser, criteriaWithValues)

        return defaultOkResponse()
    }

    class GetOrCreateReviewUserForm {
        @field:NotNull
        var dataHashId: UUID? = null
        @field:NotNull
        var reviewId: UUID? = null
        @field:NotNull
        var userId: UUID? = null
    }

    class GetReviewUserCriterionValuesForm {
        @field:NotNull
        var dataHashId: UUID? = null
        @field:NotNull
        var reviewUserId: UUID? = null
    }

    class SaveAllValuesForm {
        @field:NotNull
        var dataHashId: UUID? = null
        @field:NotNull
        var reviewUserId: UUID? = null
        @field:NotNull
        var values: Set<Item>? = null

        class Item {
            operator fun component1(): UUID? = criterionId
            operator fun component2(): Any? = value

            @field:NotNull
            var criterionId: UUID? = null
            @field:NotNull
            var value: Any? = null
        }
    }
}