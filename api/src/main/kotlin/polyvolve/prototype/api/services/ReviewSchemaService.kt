package polyvolve.prototype.api.services

import org.springframework.stereotype.Service
import polyvolve.prototype.api.data.models.schema.ReviewCategory
import polyvolve.prototype.api.data.models.schema.ReviewCriterion
import polyvolve.prototype.api.data.models.schema.ReviewCriterionType
import polyvolve.prototype.api.data.models.schema.ReviewSchema
import polyvolve.prototype.api.data.repositories.ReviewCategoryRepository
import polyvolve.prototype.api.data.repositories.ReviewCriterionRepository
import polyvolve.prototype.api.data.repositories.ReviewSchemaRepository
import java.util.*

@Service
class ReviewSchemaService(private val reviewSchemaRepository: ReviewSchemaRepository,
                          private val reviewCategoryRepository: ReviewCategoryRepository,
                          private val reviewCriterionRepository: ReviewCriterionRepository) {
    fun getAllSchemas(): Iterable<ReviewSchema> = reviewSchemaRepository.findAll()
    fun getSchema(schemaId: UUID): ReviewSchema? = reviewSchemaRepository.findById(schemaId).orElse(null)

    fun createSchema(name: String,
                     description: String): UUID {
        val schema = ReviewSchema(name, description)
        val newSchema = reviewSchemaRepository.save(schema)

        return newSchema.id!!
    }

    fun updateSchema(id: UUID,
                     name: String?,
                     description: String?): ReviewSchema {
        val schema = reviewSchemaRepository.findById(id).orElse(null)
                ?: throw IllegalArgumentException("Unable to find ReviewSchema with criterion $id.")

        if (name != null) schema.name = name
        if (description != null) schema.description = description

        return reviewSchemaRepository.save(schema)
    }

    fun removeSchema(id: UUID) {
        reviewSchemaRepository.deleteById(id)
    }

    fun createReviewCategory(name: String,
                             description: String,
                             schema: ReviewSchema): UUID {
        val category = ReviewCategory(name, description, schema, schema.categories.size)
        val newCategory = reviewCategoryRepository.save(category)

        return newCategory.id!!
    }

    fun updateReviewCategory(id: UUID,
                             name: String?,
                             description: String?): ReviewCategory {
        val category = reviewCategoryRepository.findById(id).orElse(null)
                ?: throw IllegalArgumentException("Unable to find ReviewCategory with criterion $id.")

        if (name != null) category.name = name
        if (description != null) category.description = description

        return updateReviewCategory(category)
    }

    fun updateReviewCategories(reviewCategories: Collection<ReviewCategory>) {
        reviewCategoryRepository.saveAll(reviewCategories)
    }

    fun updateReviewCategory(reviewCategory: ReviewCategory): ReviewCategory =
            reviewCategoryRepository.save(reviewCategory)

    fun removeReviewCategory(reviewCategory: ReviewCategory) {
        reviewCategoryRepository.delete(reviewCategory)
    }

    fun removeReviewCategory(id: UUID) {
        reviewCategoryRepository.deleteById(id)
    }

    fun getAllReviewCategories(schema: ReviewSchema): Iterable<ReviewCategory> = reviewCategoryRepository.findAllBySchema(schema)
    fun getReviewCategory(reviewCategoryId: UUID): ReviewCategory? = reviewCategoryRepository.findById(reviewCategoryId).orElse(null)

    fun createReviewCriterion(category: ReviewCategory,
                              name: String,
                              description: String,
                              type: ReviewCriterionType): UUID {
        val criterion = ReviewCriterion(name, description, type, category.criteria.size)
        criterion.category = category

        val newCriterion = reviewCriterionRepository.save(criterion)

        return newCriterion.id!!
    }

    fun updateReviewCriteria(reviewCriteria: Collection<ReviewCriterion>) {
        reviewCriterionRepository.saveAll(reviewCriteria)
    }

    fun updateReviewCriterion(id: UUID,
                              name: String?,
                              description: String?,
                              type: ReviewCriterionType?): ReviewCriterion {
        val criterion = reviewCriterionRepository.findById(id).orElse(null)
                ?: throw IllegalArgumentException("Unable to find ReviewCriterion with criterion $id.")

        if (name != null) criterion.name = name
        if (description != null) criterion.description = description
        if (type != null) criterion.type = type

        return updateReviewCriterion(criterion)
    }

    fun updateReviewCriterion(reviewCriterion: ReviewCriterion): ReviewCriterion {
        return reviewCriterionRepository.save(reviewCriterion)
    }

    fun removeReviewCriterion(reviewCriterion: ReviewCriterion) {
        reviewCriterionRepository.delete(reviewCriterion)
    }

    fun removeReviewCriterion(id: UUID) {
        reviewCriterionRepository.deleteById(id)
    }

    fun getAllReviewCriterions(): Iterable<ReviewCriterion> = reviewCriterionRepository.findAll()
    fun getReviewCriterion(reviewCriterionId: UUID): ReviewCriterion? = reviewCriterionRepository.findById(reviewCriterionId).orElse(null)
}