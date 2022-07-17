package polyvolve.prototype.api.data.repositories

import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository
import polyvolve.prototype.api.data.models.review.master.ReviewMaster
import java.util.*

@Repository
interface ReviewMasterRepository : CrudRepository<ReviewMaster, UUID> {
    fun findAllByIteration(iteration: Int): Iterable<ReviewMaster>
}