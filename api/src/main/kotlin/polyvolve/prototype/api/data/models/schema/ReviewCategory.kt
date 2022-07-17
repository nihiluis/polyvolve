package polyvolve.prototype.api.data.models.schema

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import org.hibernate.annotations.GenericGenerator
import java.util.*
import javax.persistence.*

@Entity
@Table(name = "review_categories",
        uniqueConstraints = [UniqueConstraint(columnNames = ["schema_id", "name"])])
class ReviewCategory() {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(
            name = "UUID",
            strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id", updatable = false, nullable = false)
    var id: UUID? = null

    var name = ""
    var description = ""
    @Column(name = "sortOrder")
    var order = 1

    @OneToMany(
            cascade = [CascadeType.ALL],
            fetch = FetchType.LAZY,
            mappedBy = "category")
    @JsonIgnoreProperties("category")
    var criteria: Set<ReviewCriterion> = emptySet()

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "schema_id")
    @JsonIgnoreProperties("schema")
    var schema: ReviewSchema? = null

    constructor(name: String, description: String, schema: ReviewSchema, order: Int) : this() {
        this.name = name
        this.description = description
        this.schema = schema
        this.order = order
    }

    override fun equals(other: Any?): Boolean {
        return other is ReviewCategory && other.id == this.id
    }

    override fun hashCode(): Int {
        var result = id?.hashCode() ?: 0
        result = 31 * result + name.hashCode()
        result = 31 * result + description.hashCode()
        result = 31 * result + order
        result = 31 * result + criteria.hashCode()
        result = 31 * result + (schema?.hashCode() ?: 0)
        return result
    }
}