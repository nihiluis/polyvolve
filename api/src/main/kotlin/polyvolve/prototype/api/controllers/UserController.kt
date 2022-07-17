package polyvolve.prototype.api.controllers

import org.springframework.http.MediaType
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.ui.Model
import org.springframework.validation.BindingResult
import org.springframework.validation.beanvalidation.SpringValidatorAdapter
import org.springframework.web.bind.annotation.*
import polyvolve.prototype.api.data.models.recentlyviewed.RecentlyViewedType
import polyvolve.prototype.api.data.models.review.master.ReviewMaster
import polyvolve.prototype.api.data.models.team.Team
import polyvolve.prototype.api.data.models.user.Sex
import polyvolve.prototype.api.data.models.user.User
import polyvolve.prototype.api.services.*
import polyvolve.prototype.api.util.OkResponseEntity
import polyvolve.prototype.api.util.defaultOkResponse
import polyvolve.prototype.api.util.exceptions.AuthException
import polyvolve.prototype.api.util.validateAndThrow
import java.security.Principal
import java.util.*
import javax.validation.constraints.NotEmpty
import javax.validation.constraints.NotNull

@RestController
@RequestMapping("/user")
class UserController(val userService: UserService,
                     val adminService: AdminService,
                     val recentlyViewedService: RecentlyViewedService,
                     val reviewService: ReviewService,
                     val scoreService: ScoreService,
                     var validator: SpringValidatorAdapter) {
    @PostMapping("/create", consumes = [MediaType.APPLICATION_JSON_VALUE])
    fun createUser(@RequestBody body: CreateUserForm, bindingResult: BindingResult): OkResponseEntity {
        validator.validateAndThrow(body, bindingResult)

        val userId = userService.create(body.mail, body.name, body.surname, body.position, body.sex!!).toString()

        return defaultOkResponse(userId)
    }

    @PostMapping("/update", consumes = [MediaType.APPLICATION_JSON_VALUE])
    fun updateUser(@RequestBody body: UpdateUserForm, bindingResult: BindingResult): OkResponseEntity {
        validator.validateAndThrow(body, bindingResult)

        val user = userService.update(
                body.id!!,
                body.name,
                body.surname,
                body.description,
                body.position,
                body.teamIds)
        val reviewingMasters = user.teams.flatMap { team -> team.reviewMasters }

        return defaultOkResponse(GetUserResponse(user, user.teams, user.reviewMasters, reviewingMasters))
    }

    @PostMapping("/delete", consumes = [MediaType.APPLICATION_JSON_VALUE])
    fun deleteUser(@RequestBody body: DeleteUserForm, model: Model): OkResponseEntity {
        val uuid = UUID.fromString(body.id)

        return defaultOkResponse(userService.delete(uuid).toString())
    }

    @GetMapping("/get/{userId}")
    fun getUser(@PathVariable userId: UUID, @AuthenticationPrincipal principal: Principal?): OkResponseEntity {
        val user = userService.get(userId)
                ?: throw IllegalArgumentException("User with criterion $userId doesn't exist")

        val admin = adminService.retrieveAdminAndThrow(principal)
        val lastViewedItems = recentlyViewedService.getRecentForAdmin(admin)
        val itemIsAlreadyIncluded = lastViewedItems
                .find { item -> item.targetId == userId && item.type == RecentlyViewedType.USER } != null
        if (!itemIsAlreadyIncluded) recentlyViewedService.createFrom(user, Date(), admin)

        val reviewingMasters = user.teams.flatMap { team -> team.reviewMasters }

        return defaultOkResponse(GetUserResponse(user, user.teams, user.reviewMasters, reviewingMasters))
    }

    @GetMapping("/all")
    fun getUsers(model: Model): OkResponseEntity {
        return defaultOkResponse(userService.getAll())
    }

    @GetMapping("/mark/add/{userId}")
    fun addMarkedUser(@PathVariable userId: UUID, @AuthenticationPrincipal principal: Principal?): OkResponseEntity {
        if (principal == null) throw AuthException("Not logged in.")

        val admin = adminService.getAdmin(principal.name)
                ?: throw AuthException("Unknown admin.")
        val user = userService.get(userId) ?: throw IllegalArgumentException("Unknown user $userId.")

        userService.markUser(admin, user)

        return defaultOkResponse()
    }

    @GetMapping("/mark/remove/{markedUserId}")
    fun removeMarkedUser(@PathVariable markedUserId: UUID, @AuthenticationPrincipal principal: Principal?): OkResponseEntity {
        if (principal == null) throw AuthException("Not logged in.")

        val admin = adminService.getAdmin(principal.name)
                ?: throw AuthException("Unknown admin.")

        val markedUser = userService.getMarkedUser(markedUserId)
                ?: throw IllegalArgumentException("MarkedUser $markedUserId does not exist.")

        val ownerAdmin = markedUser.admin
        if (ownerAdmin.id != admin.id) {
            throw IllegalArgumentException("Not allowed to delete someone else's MarkedUser.")
        }

        userService.removeMarkedUser(markedUserId)

        return defaultOkResponse()
    }

    @GetMapping("/mark/all")
    fun getMarkedUsers(@AuthenticationPrincipal principal: Principal?): OkResponseEntity {
        if (principal == null) throw AuthException("Not logged in.")

        val admin = adminService.getAdmin(principal.name)
                ?: throw AuthException("Unknown admin.")

        return defaultOkResponse(userService.getMarkedUsers(admin))
    }

    @GetMapping("/scores/{userId}")
    fun getScores(@PathVariable userId: UUID): OkResponseEntity {
        val user = userService.get(userId)
                ?: throw IllegalArgumentException("Unable to find user for id $userId")

        val reviewUsers = reviewService.getReviewUsersFromUser(user)

        val scores = scoreService.calculateScores(user, reviewUsers)

        return defaultOkResponse(scores)
    }

    class CreateUserForm {
        @field:NotEmpty
        var mail = ""

        @field:NotEmpty
        var name = ""

        @field:NotEmpty
        var surname = ""

        @field:NotEmpty
        var position = ""

        @field:NotNull
        var sex: Sex? = null
    }

    class UpdateUserForm {
        @field:NotNull
        var id: UUID? = null
        var mail: String? = null
        var name: String? = null
        var surname: String? = null
        var description: String? = null
        var position: String? = null
        var teamIds: List<UUID>? = null
    }

    class DeleteUserForm(@field:NotNull var id: String?)

    class GetUserResponse(val user: User,
                          val teams: Collection<Team>,
                          val reviewMasters: Collection<ReviewMaster>,
                          val reviewingMasters: Collection<ReviewMaster>)
}