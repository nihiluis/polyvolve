package polyvolve.prototype.api.data.repositories

import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository
import polyvolve.prototype.api.data.models.review.Review
import polyvolve.prototype.api.data.models.review.master.ReviewMaster
import polyvolve.prototype.api.data.models.user.User
import java.util.*

@Repository
interface ReviewRepository : CrudRepository<Review, UUID> {
    fun findAllByReviewingUser(user: User): Iterable<Review>
    fun findByMasterAndReviewingUser(master: ReviewMaster, user: User): Review?
}