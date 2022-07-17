package polyvolve.prototype.api.controllers

import org.springframework.http.MediaType
import org.springframework.validation.BindingResult
import org.springframework.validation.beanvalidation.SpringValidatorAdapter
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import polyvolve.prototype.api.services.InviteService
import polyvolve.prototype.api.util.OkResponseEntity
import polyvolve.prototype.api.util.defaultOkResponse
import polyvolve.prototype.api.util.validateAndThrow
import java.util.*
import javax.validation.constraints.Email
import javax.validation.constraints.NotEmpty
import javax.validation.constraints.NotNull

@RestController
@RequestMapping("/invite")
class InviteController(val inviteService: InviteService) {
    @GetMapping("/all", consumes = [MediaType.APPLICATION_JSON_VALUE])
    fun getAllInvites(): OkResponseEntity {
        val data = inviteService.getInvites().toList()

        return defaultOkResponse(data)
    }

    @PostMapping("/accept", consumes = [MediaType.APPLICATION_JSON_VALUE])
    fun acceptInvite(body: AcceptInviteForm, bindingResult: BindingResult, validator: SpringValidatorAdapter): OkResponseEntity {
        validator.validateAndThrow(body, bindingResult)

        val inviteUuid = inviteService.acceptInvite(body.inviteId!!, body.mail!!, body.password!!, body.name!!, body.surname!!)

        return defaultOkResponse(inviteUuid)
    }

    @PostMapping("/create", consumes = [MediaType.APPLICATION_JSON_VALUE])
    fun createInvite(body: CreateInviteForm, bindingResult: BindingResult, validator: SpringValidatorAdapter): OkResponseEntity {
        validator.validateAndThrow(body, bindingResult)

        val inviteUuid = inviteService.createInvite(body.mail!!)

        return defaultOkResponse(inviteUuid)
    }

    @PostMapping("/remove", consumes = [MediaType.APPLICATION_JSON_VALUE])
    fun removeInvite(body: RemoveInviteForm, bindingResult: BindingResult, validator: SpringValidatorAdapter): OkResponseEntity {
        validator.validateAndThrow(body, bindingResult)

        inviteService.removeInvite(body.mail!!)

        return defaultOkResponse()
    }

    class AcceptInviteForm {
        @NotNull
        var inviteId: UUID? = null

        @Email
        @NotNull
        @NotEmpty
        var mail: String? = null

        @NotNull
        @NotEmpty
        var password: String? = null

        @NotNull
        @NotEmpty
        var name: String? = null

        @NotNull
        @NotEmpty
        var surname: String? = null
    }

    class CreateInviteForm {
        @Email
        @NotNull
        @NotEmpty
        var mail: String? = null
    }

    class RemoveInviteForm {
        @Email
        @NotNull
        @NotEmpty
        var mail: String? = null
    }
}