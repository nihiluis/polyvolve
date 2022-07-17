package polyvolve.prototype.api.data.repositories

import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository
import polyvolve.prototype.api.data.models.admin.Admin
import polyvolve.prototype.api.data.models.recentlyviewed.RecentlyViewedItem
import polyvolve.prototype.api.data.models.recentlyviewed.RecentlyViewedType
import java.util.*

@Repository
interface RecentlyViewedRepository : CrudRepository<RecentlyViewedItem, UUID> {
    fun findByTypeAndTargetId(type: RecentlyViewedType, targetId: UUID): Optional<RecentlyViewedItem>
    fun findAllByAdmin(admin: Admin): Iterable<RecentlyViewedItem>
    fun findTop10ByAdminOrderByDateDesc(admin: Admin): Iterable<RecentlyViewedItem>
    fun findTop5ByAdminOrderByDateDesc(admin: Admin): Iterable<RecentlyViewedItem>
}