package polyvolve.prototype.api.data.repositories

import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository
import polyvolve.prototype.api.data.models.schema.ReviewCategory
import polyvolve.prototype.api.data.models.schema.ReviewSchema
import java.util.*

@Repository
interface ReviewCategoryRepository : CrudRepository<ReviewCategory, UUID> {
    fun findAllBySchema(schema: ReviewSchema): Iterable<ReviewCategory>
}