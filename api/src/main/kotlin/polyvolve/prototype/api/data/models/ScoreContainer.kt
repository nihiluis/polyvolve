package polyvolve.prototype.api.data.models

import java.util.*

class ScoreContainer(
        /**
         * Maps ReviewMasters to scores for a category.
         */
        val data: Map<String, Map<UUID, ScoreCategoryContainer>>)

class ScoreCategoryContainer(val overallScore: ScoreInnerContainer)

class ScoreInnerContainer(val avg: Double,
                          val min: Double,
                          val max: Double,
                          val count: Int,
                          val stdDev: Double)