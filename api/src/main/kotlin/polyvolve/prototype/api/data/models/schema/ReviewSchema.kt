package polyvolve.prototype.api.data.models.schema

import com.fasterxml.jackson.annotation.JsonIdentityInfo
import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.annotation.ObjectIdGenerators
import org.hibernate.annotations.GenericGenerator
import polyvolve.prototype.api.data.models.review.master.ReviewMaster
import java.util.*
import javax.persistence.*

@Entity
@Table(name = "review_schema",
        uniqueConstraints = [
            UniqueConstraint(columnNames = ["name"])])
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator::class,
        property = "id", scope = ReviewSchema::class)
class ReviewSchema() {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(
            name = "UUID",
            strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id", updatable = false, nullable = false)
    var id: UUID? = null

    var name = ""
    var description = ""

    @OneToMany(
            cascade = [CascadeType.ALL],
            fetch = FetchType.LAZY,
            mappedBy = "schema")
    @JsonIgnoreProperties("schema")
    // why was this on ignore?
    //@JsonIgnore
    var categories: Set<ReviewCategory> = emptySet()

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "schema")
    //@JsonIgnoreProperties("schema")
    var masters: Set<ReviewMaster> = emptySet()

    constructor(name: String, description: String) : this() {
        this.name = name
        this.description = description
    }
}