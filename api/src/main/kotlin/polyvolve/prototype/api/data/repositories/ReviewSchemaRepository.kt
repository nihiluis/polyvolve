package polyvolve.prototype.api.data.repositories

import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository
import polyvolve.prototype.api.data.models.schema.ReviewSchema
import java.util.*

@Repository
interface ReviewSchemaRepository : CrudRepository<ReviewSchema, UUID> {
}