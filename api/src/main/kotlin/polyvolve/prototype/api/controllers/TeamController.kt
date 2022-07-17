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
import polyvolve.prototype.api.data.models.user.User
import polyvolve.prototype.api.services.AdminService
import polyvolve.prototype.api.services.RecentlyViewedService
import polyvolve.prototype.api.services.TeamService
import polyvolve.prototype.api.util.OkResponseEntity
import polyvolve.prototype.api.util.defaultOkResponse
import polyvolve.prototype.api.util.validateAndThrow
import java.security.Principal
import java.util.*
import javax.validation.constraints.NotEmpty
import javax.validation.constraints.NotNull

@RestController
@RequestMapping("/team")
class TeamController(val teamService: TeamService,
                     val adminService: AdminService,
                     val recentlyViewedService: RecentlyViewedService,
                     var validator: SpringValidatorAdapter) {
    @PostMapping("/create", consumes = [MediaType.APPLICATION_JSON_VALUE])
    fun createTeam(@RequestBody body: CreateTeamForm, bindingResult: BindingResult): OkResponseEntity {
        validator.validateAndThrow(body, bindingResult)

        val userId = teamService.create(body.name, body.description).toString()

        return defaultOkResponse(userId)
    }

    @PostMapping("/update", consumes = [MediaType.APPLICATION_JSON_VALUE])
    fun updateTeam(@RequestBody body: UpdateTeamForm, bindingResult: BindingResult): OkResponseEntity {
        validator.validateAndThrow(body, bindingResult)

        val team = teamService.update(body.id!!, body.name, body.description, body.userIds)

        return defaultOkResponse(GetTeamResponse(team, team.users, team.reviewMasters))
    }

    @PostMapping("/delete", consumes = [MediaType.APPLICATION_JSON_VALUE])
    fun deleteTeam(@RequestBody body: DeleteTeamForm, model: Model): OkResponseEntity {
        val uuid = UUID.fromString(body.id)

        return defaultOkResponse(teamService.delete(uuid).toString())
    }


    @GetMapping("/all")
    fun getAllTeams(model: Model): OkResponseEntity {
        return defaultOkResponse(teamService.getAll())
    }

    @GetMapping("/get/{teamId}")
    fun getTeam(@PathVariable teamId: UUID, @AuthenticationPrincipal principal: Principal?): OkResponseEntity {
        val team = teamService.get(teamId)
                ?: throw IllegalArgumentException("Team with criterion $teamId doesn't exist")

        val admin = adminService.retrieveAdminAndThrow(principal)
        val lastViewedItems = recentlyViewedService.getRecentForAdmin(admin)
        val itemIsAlreadyIncluded = lastViewedItems
                .find { item -> item.targetId == teamId && item.type == RecentlyViewedType.TEAM } != null
        if (!itemIsAlreadyIncluded) recentlyViewedService.createFrom(team, Date(), admin)

        return defaultOkResponse(GetTeamResponse(team, team.users, team.reviewMasters))
    }

    class CreateTeamForm {
        @field:NotEmpty
        var name = ""

        var description = ""
    }

    class UpdateTeamForm {
        @field:NotNull
        var id: UUID? = null

        var name: String? = null
        var description: String? = null

        // Not initialized for distinction when they are updated to be empty.
        var userIds: List<UUID>? = null
    }

    class GetTeamResponse(val team: Team, val users: Set<User>, val reviewMasters: Set<ReviewMaster>)

    class DeleteTeamForm(@field:NotEmpty var id: String = "")
}