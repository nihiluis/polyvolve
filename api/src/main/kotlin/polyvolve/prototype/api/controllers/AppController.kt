package polyvolve.prototype.api.controllers

import org.springframework.http.MediaType
import org.springframework.validation.beanvalidation.SpringValidatorAdapter
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import polyvolve.prototype.api.services.ReviewService
import java.util.*

/**
 * Endpoints specifically for the frontend reviewing app (called app).
 */
@RestController
@RequestMapping("/review")
class AppController(val reviewService: ReviewService,
                    var validator: SpringValidatorAdapter) {
    @PostMapping("/get/{hashId}", consumes = [MediaType.APPLICATION_JSON_VALUE])
    fun getDataForHash(@PathVariable hashId: UUID) {

    }
}