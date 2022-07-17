package polyvolve.prototype.api.data.repositories

import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository
import polyvolve.prototype.api.data.models.DataHash
import polyvolve.prototype.api.data.models.review.master.ReviewMaster
import polyvolve.prototype.api.data.models.user.User
import java.util.*

@Repository
interface DataHashRepository : CrudRepository<DataHash, UUID> {
    fun findAllByMaster(master: ReviewMaster): Iterable<DataHash>
    fun findByMasterAndUser(master: ReviewMaster, user: User): DataHash?
}