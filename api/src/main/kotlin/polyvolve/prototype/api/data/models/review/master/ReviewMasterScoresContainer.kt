package polyvolve.prototype.api.data.models.review.master

import java.util.*

class ReviewMasterScoreItem(val reviewedId: UUID,
                            val reviewedMail: String,
                            val reviewerId: UUID,
                            val reviewerMail: String,
                            val categoryId: UUID,
                            val categoryName: String,
                            val criterionId: UUID,
                            val criterionName: String,
                            val criterionType: String,
                            var value: Any?)