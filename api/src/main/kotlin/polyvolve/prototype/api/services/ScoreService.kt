package polyvolve.prototype.api.services

import org.apache.commons.math3.stat.descriptive.DescriptiveStatistics
import org.springframework.stereotype.Service
import polyvolve.prototype.api.data.models.ScoreCategoryContainer
import polyvolve.prototype.api.data.models.ScoreContainer
import polyvolve.prototype.api.data.models.ScoreInnerContainer
import polyvolve.prototype.api.data.models.user.User
import polyvolve.prototype.api.data.models.review.user.ReviewUser
import polyvolve.prototype.api.data.models.review.master.ReviewMaster
import polyvolve.prototype.api.data.models.review.value.ReviewCriterionValueScale
import polyvolve.prototype.api.data.models.schema.ReviewCategory
import java.util.*
import kotlin.collections.HashMap

@Service
class ScoreService {
    /**
     * The scores should actually be calculated on the client, not on the server. I didn't think this through.
     */
    fun calculateScores(user: User, reviewUsers: Iterable<ReviewUser>): ScoreContainer {
        val reviewMasterMap = HashMap<ReviewMaster, HashMap<ReviewCategory, ArrayList<ReviewCriterionValueScale>>>()
        //val teamMap = HashMap<Team, HashMap<ReviewCategory, ArrayList<ReviewCriterionValueScale>>>()
        val allCategoryMap = HashMap<ReviewCategory, ArrayList<ReviewCriterionValueScale>>()

        val scoresByMaster = HashMap<String, HashMap<UUID, ScoreCategoryContainer>>()

        for (reviewUser in reviewUsers) {
            val review = reviewUser.review
            val reviewMaster = review.master

            for (value in reviewUser.values) {
                val valueAlias = value.value as? ReviewCriterionValueScale ?: continue

                if (!reviewMasterMap.containsKey(reviewMaster)) {
                    reviewMasterMap[reviewMaster] = HashMap()
                }
                val categoryMap = reviewMasterMap[reviewMaster]!!


                val category = value.criterion!!.category!!

                if (!categoryMap.containsKey(category)) {
                    categoryMap[category] = ArrayList()
                }
                categoryMap[category]!!.add(valueAlias)

                if (!allCategoryMap.containsKey(category)) {
                    allCategoryMap[category] = ArrayList()
                }

                allCategoryMap[category]!!.add(valueAlias)

                /*
                for (team in user.teams) {
                    if (!teamMap.containsKey(team)) {
                        teamMap[team] = HashMap()
                    }

                    val teamCategoryMap = teamMap[team]!!
                    if (!teamCategoryMap.containsKey(category)) {
                        teamCategoryMap[category]!!.add(valueAlias)
                    }
                }
                */
            }
        }

        val scores = ScoreContainer(scoresByMaster)

        val allMastersCategoryMap = HashMap<UUID, ScoreCategoryContainer>()
        scoresByMaster[""] = allMastersCategoryMap
        for ((category, values) in allCategoryMap) {
            val arr = DoubleArray(values.size)
            for (i in 0 until values.size) {
                val value = values[i]

                arr[i] = value.value.toDouble()
            }
            val stats = DescriptiveStatistics(arr)
            val overallCategoryScore = ScoreInnerContainer(stats.mean, stats.min, stats.max, values.size, stats.standardDeviation)
            val categoryScore = ScoreCategoryContainer(overallCategoryScore)

            allMastersCategoryMap[category.id!!] = categoryScore
        }

        for ((master, categoryMap) in reviewMasterMap) {
            val masterCategoryMap = HashMap<UUID, ScoreCategoryContainer>()
            scoresByMaster[master.id.toString()] = masterCategoryMap

            for ((category, values) in categoryMap) {
                val arr = DoubleArray(values.size)
                for (i in 0 until values.size) {
                    val value = values[i]

                    arr[i] = value.value.toDouble()
                }
                val stats = DescriptiveStatistics(arr)
                val overallCategoryScore = ScoreInnerContainer(stats.mean, stats.min, stats.max, values.size, stats.standardDeviation)
                val categoryScore = ScoreCategoryContainer(overallCategoryScore)

                masterCategoryMap[category.id!!] = categoryScore
            }
        }

        return scores
    }
}