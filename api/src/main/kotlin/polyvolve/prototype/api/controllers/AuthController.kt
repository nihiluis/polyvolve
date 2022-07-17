package polyvolve.prototype.api.controllers

import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import polyvolve.prototype.api.services.AdminService
import polyvolve.prototype.api.util.OkResponseEntity
import polyvolve.prototype.api.util.defaultOkResponse
import java.security.Principal
import javax.validation.constraints.Email
import javax.validation.constraints.NotEmpty
import javax.validation.constraints.NotNull

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = ["http://localhost:3000"])
class AuthController(private val adminService: AdminService) {
    @GetMapping("/dummy")
    fun dummy(@AuthenticationPrincipal principal: Principal?): OkResponseEntity {
        val admin = adminService.retrieveAdminAndThrow(principal)

        return defaultOkResponse(admin.id)
    }

    class LoginForm {
        @Email
        @NotNull
        @NotEmpty
        var mail: String? = null

        @NotNull
        @NotEmpty
        var password: String? = null
    }
}