package polyvolve.prototype.api.services

import org.springframework.stereotype.Service
import polyvolve.prototype.api.data.models.DataHash
import polyvolve.prototype.api.data.models.review.master.ReviewMaster
import polyvolve.prototype.api.data.models.user.User
import polyvolve.prototype.api.data.repositories.DataHashRepository
import java.util.*

@Service
class DataHashService(private var dataHashRepository: DataHashRepository) {
    fun createDataHash(reviewMaster: ReviewMaster, user: User): DataHash {
        val dataHash = DataHash(reviewMaster, user)

        return dataHashRepository.save(dataHash)
    }

    fun getDataHash(dataHashId: UUID): DataHash? = dataHashRepository.findById(dataHashId).orElse(null)
}