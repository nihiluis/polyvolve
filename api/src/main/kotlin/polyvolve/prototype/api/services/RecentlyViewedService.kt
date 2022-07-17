package polyvolve.prototype.api.services

import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Service
import polyvolve.prototype.api.data.models.abstr.HasName
import polyvolve.prototype.api.data.models.admin.Admin
import polyvolve.prototype.api.data.models.user.User
import polyvolve.prototype.api.data.models.recentlyviewed.RecentlyViewedItem
import polyvolve.prototype.api.data.models.recentlyviewed.RecentlyViewedType
import polyvolve.prototype.api.data.models.review.master.ReviewMaster
import polyvolve.prototype.api.data.models.team.Team
import polyvolve.prototype.api.data.repositories.*
import java.util.*

@Service
class RecentlyViewedService(private val recentlyViewedRepository: RecentlyViewedRepository,
                            private val teamRepository: TeamRepository,
                            private val userRepository: UserRepository,
                            private val reviewMasterRepository: ReviewMasterRepository,
                            private val adminRepository: AdminRepository) {
    private val logger: Logger = LoggerFactory.getLogger(this::class.java)

    fun mapTypeToRepository(type: RecentlyViewedType): CrudRepository<*, UUID> = when(type) {
        RecentlyViewedType.TEAM -> teamRepository
        RecentlyViewedType.USER -> userRepository
        RecentlyViewedType.REVIEW_MASTER -> reviewMasterRepository
    }

    fun createFrom(team: Team, date: Date, admin: Admin): UUID = create(RecentlyViewedType.TEAM, team.id!!, date, admin)
    fun createFrom(user: User, date: Date, admin: Admin): UUID = create(RecentlyViewedType.USER, user.id!!, date, admin)
    fun createFrom(reviewMaster: ReviewMaster, date: Date, admin: Admin): UUID = create(RecentlyViewedType.REVIEW_MASTER, reviewMaster.id!!, date, admin)

    fun create(type: RecentlyViewedType, id: UUID, date: Date, admin: Admin): UUID {
        val recentlyViewedItem = RecentlyViewedItem(type, id, date, admin)

        val savedRecentlyViewedItem = recentlyViewedRepository.save(recentlyViewedItem)
        if (savedRecentlyViewedItem.id == null) {
            throw IllegalStateException("RecentlyViewedItem with date ${recentlyViewedItem.date} has no criterion after being saved!")
        }

        return savedRecentlyViewedItem.id!!
    }

    fun get(id: UUID): RecentlyViewedItem? = recentlyViewedRepository.findById(id).orElse(null)

    fun getAllForAdmin(admin: Admin): Iterable<RecentlyViewedItem> =
            addNames(recentlyViewedRepository.findAllByAdmin(admin).toSet())

    private fun addNames(items: Set<RecentlyViewedItem>): Set<RecentlyViewedItem> {
        val toRemove = ArrayList<RecentlyViewedItem>()

        for (item in items) {
            val repo = mapTypeToRepository(item.type)

            val viewedItem = repo.findById(item.targetId).orElse(null) as? HasName

            if (viewedItem == null) {
                logger.warn("RecentlyViewedItem found with no underlying item. Might be deleted.")
                toRemove.add(item)
                continue
            }

            item.name = viewedItem.getDisplayName()
        }

        recentlyViewedRepository.deleteAll(toRemove)

        return items.subtract(toRemove)
    }

    fun getRecentForAdmin(admin: Admin): Iterable<RecentlyViewedItem> =
            recentlyViewedRepository.findTop5ByAdminOrderByDateDesc(admin)

    fun getRecentForAdminWithNames(admin: Admin): Iterable<RecentlyViewedItem> =
            addNames(getRecentForAdmin(admin).toSet())

    fun getAll(): Iterable<RecentlyViewedItem> = recentlyViewedRepository.findAll()

    fun delete(id: UUID) {
        recentlyViewedRepository.findById(id).ifPresent { recentlyViewed ->
            recentlyViewedRepository.delete(recentlyViewed)
        }
    }
}