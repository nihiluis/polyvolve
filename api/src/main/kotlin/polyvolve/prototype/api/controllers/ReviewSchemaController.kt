package polyvolve.prototype.api.controllers

import org.springframework.http.MediaType
import org.springframework.validation.BindingResult
import org.springframework.validation.beanvalidation.SpringValidatorAdapter
import org.springframework.web.bind.annotation.*
import polyvolve.prototype.api.data.models.schema.ReviewCriterionType
import polyvolve.prototype.api.services.ReviewSchemaService
import polyvolve.prototype.api.util.OkResponseEntity
import polyvolve.prototype.api.util.defaultOkResponse
import polyvolve.prototype.api.util.validateAndThrow
import java.util.*
import javax.validation.constraints.NotEmpty
import javax.validation.constraints.NotNull
import kotlin.IllegalArgumentException

@RestController
@RequestMapping("/review/schema")
class ReviewSchemaController(val reviewSchemaService: ReviewSchemaService,
                             var validator: SpringValidatorAdapter) {
    @GetMapping("/all")
    fun getAllSchemas(): OkResponseEntity {
        val schemas = reviewSchemaService.getAllSchemas()

        return defaultOkResponse(schemas)
    }

    @PostMapping("/create", consumes = [MediaType.APPLICATION_JSON_VALUE])
    fun createSchema(@RequestBody body: CreateSchemaForm, bindingResult: BindingResult): OkResponseEntity {
        validator.validateAndThrow(body, bindingResult)


        return defaultOkResponse(reviewSchemaService.createSchema(body.name, body.description))
    }

    @PostMapping("/update", consumes = [MediaType.APPLICATION_JSON_VALUE])
    fun updateSchema(@RequestBody body: UpdateSchemaForm, bindingResult: BindingResult): OkResponseEntity {
        validator.validateAndThrow(body, bindingResult)

        reviewSchemaService.updateSchema(body.id!!, body.name, body.description)

        return defaultOkResponse()
    }

    @GetMapping("/delete/{id}")
    fun removeSchema(@PathVariable id: UUID): OkResponseEntity {
        reviewSchemaService.removeSchema(id)

        return defaultOkResponse()
    }
    
    @PostMapping("/category/create", consumes = [MediaType.APPLICATION_JSON_VALUE])
    fun createCategory(@RequestBody body: CreateCategoryForm, bindingResult: BindingResult): OkResponseEntity {
        validator.validateAndThrow(body, bindingResult)

        val schema = reviewSchemaService.getSchema(body.schemaId!!)
                ?: throw IllegalArgumentException("Unable to find reviewSchema with criterion $body.schemaId.")

        return defaultOkResponse(reviewSchemaService.createReviewCategory(body.name, body.description, schema))
    }

    @PostMapping("/category/update", consumes = [MediaType.APPLICATION_JSON_VALUE])
    fun updateCategory(@RequestBody body: UpdateCategoryForm, bindingResult: BindingResult): OkResponseEntity {
        validator.validateAndThrow(body, bindingResult)

        val data = reviewSchemaService.updateReviewCategory(body.id!!, body.name, body.description)

        return defaultOkResponse(data)
    }

    @GetMapping("/category/delete/{id}")
    fun removeCategory(@PathVariable id: UUID): OkResponseEntity {
        reviewSchemaService.removeReviewCategory(id)

        return defaultOkResponse()
    }

    @GetMapping("/category/all/{schemaId}")
    fun getAllCategories(@PathVariable schemaId: UUID): OkResponseEntity {
        val schema = reviewSchemaService.getSchema(schemaId)
                ?: throw IllegalArgumentException("Unable to find reviewSchema with criterion $schemaId.")

        val categories = reviewSchemaService.getAllReviewCategories(schema)

        return defaultOkResponse(categories)
    }


    @PostMapping("/criterion/create", consumes = [MediaType.APPLICATION_JSON_VALUE])
    fun createCriterion(@RequestBody body: CreateCriterionForm, bindingResult: BindingResult): OkResponseEntity {
        validator.validateAndThrow(body, bindingResult)

        val category = reviewSchemaService.getReviewCategory(body.categoryId!!)
                ?: throw IllegalArgumentException("Unable to find ReviewCategory with criterion ${body.categoryId}.")
        val type = ReviewCriterionType.fromName(body.type) ?: throw IllegalArgumentException("Unknown ReviewCriterionType of name ${body.type}.")

        return defaultOkResponse(reviewSchemaService.createReviewCriterion(category, body.name, body.description, type))
    }

    @PostMapping("/criterion/update", consumes = [MediaType.APPLICATION_JSON_VALUE])
    fun updateCriterion(@RequestBody body: UpdateCriterionForm, bindingResult: BindingResult): OkResponseEntity {
        validator.validateAndThrow(body, bindingResult)

        val type = ReviewCriterionType.fromName(body.type ?: "")
        val data = reviewSchemaService.updateReviewCriterion(body.id!!, body.name, body.description, type)

        return defaultOkResponse(data)
    }

    @GetMapping("/criterion/delete/{id}")
    fun removeCriterion(@PathVariable id: UUID): OkResponseEntity {
        reviewSchemaService.removeReviewCriterion(id)

        return defaultOkResponse()
    }

    @PostMapping("/category/order/set", consumes = [MediaType.APPLICATION_JSON_VALUE])
    fun categorySetOrder(@RequestBody body: SetOrderCategoryForm, bindingResult: BindingResult): OkResponseEntity {
        validator.validateAndThrow(body, bindingResult)

        val schema = reviewSchemaService.getSchema(body.schemaId!!)
                ?: throw IllegalArgumentException("ReviewSchema ${body.schemaId} does not exist")

        val sortedCategories = schema.categories.sortedBy { cat -> cat.order }.toMutableList()

        val targetCategory = sortedCategories.withIndex().find { category -> category.value.id == body.categoryId }
                ?: throw IllegalArgumentException("ReviewCategory ${body.categoryId} does not belong to ReviewSchema ${body.schemaId}")

        if (targetCategory.value.order == body.order) throw IllegalArgumentException("Order of category ${body.categoryId} is already at ${body.order}")

        val newOrder = body.order!!

        sortedCategories.removeAt(targetCategory.index)
        sortedCategories.add(newOrder, targetCategory.value)

        sortedCategories.forEachIndexed { index, reviewCategory ->
            reviewCategory.order = index
        }

        reviewSchemaService.updateReviewCategories(sortedCategories)

        return defaultOkResponse()
    }


    @PostMapping("/criterion/order/set", consumes = [MediaType.APPLICATION_JSON_VALUE])
    fun criterionSetOrder(@RequestBody body: SetOrderCriterionForm, bindingResult: BindingResult): OkResponseEntity {
        validator.validateAndThrow(body, bindingResult)

        val category = reviewSchemaService.getReviewCategory(body.categoryId!!)
                ?: throw IllegalArgumentException("ReviewCategory ${body.categoryId} does not exist")

        val sortedCriteria = category.criteria.sortedBy { criterion -> criterion.order }.toMutableList()

        val targetCriterion = sortedCriteria.withIndex().find { criterion -> criterion.value.id == body.criterionId }
                ?: throw IllegalArgumentException("ReviewCriterion ${body.criterionId} does not belong to ReviewCategory ${body.categoryId}")

        if (targetCriterion.value.order == body.order) throw IllegalArgumentException("Order of criterion ${body.criterionId} is already at ${body.order}")

        val newOrder = body.order!!

        sortedCriteria.removeAt(targetCriterion.index)
        sortedCriteria.add(newOrder, targetCriterion.value)

        sortedCriteria.forEachIndexed { index, reviewCriterion ->
            reviewCriterion.order = index
        }

        reviewSchemaService.updateReviewCriteria(sortedCriteria)

        return defaultOkResponse()
    }

    class CreateSchemaForm {
        @NotEmpty
        var name = ""
        @NotEmpty
        var description = ""
    }

    class UpdateSchemaForm {
        @field:NotNull
        var id: UUID? = null
        var name: String? = null
        var description: String? = null
    }
    
    class CreateCategoryForm {
        @NotEmpty
        var name = ""
        @NotEmpty
        var description = ""
        @NotNull
        var schemaId: UUID? = null
    }

    class UpdateCategoryForm {
        @field:NotNull
        var id: UUID? = null
        var name: String? = null
        var description: String? = null
    }

    class CreateCriterionForm {
        @field:NotNull
        var categoryId: UUID? = null
        @NotEmpty
        var name = ""
        @NotEmpty
        var description = ""
        @NotEmpty
        var type = ""
    }

    class UpdateCriterionForm {
        @field:NotNull
        var id: UUID? = null
        var name: String? = null
        var description: String? = null
        var type: String? = null
    }

    class SetOrderCategoryForm {
        @field:NotNull
        var schemaId: UUID? = null
        @field:NotNull
        var categoryId: UUID? = null
        @field:NotNull
        var order: Int? = null
    }

    class SetOrderCriterionForm {
        @field:NotNull
        var categoryId: UUID? = null
        @field:NotNull
        var criterionId: UUID? = null
        @field:NotNull
        var order: Int? = null
    }
}