package polyvolve.prototype.api.data.models.abstr

/**
 * A natural person.
 */
interface Person : HasName {
    var name: String
    var surname: String

    override fun getDisplayName(): String = "$name $surname"
}