package polyvolve.prototype.api

import org.springframework.stereotype.Controller
import org.springframework.ui.Model
import org.springframework.web.bind.annotation.*

/**
 * The endpoint manager/controller. For description of an endpoint, look at the underlying function.
 */
@Controller
class PrototypeController {
    @GetMapping("/")
    fun index(model: Model): String {
        return ""
    }
}

