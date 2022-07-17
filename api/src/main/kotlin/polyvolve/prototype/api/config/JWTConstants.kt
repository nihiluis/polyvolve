package polyvolve.prototype.api.config

object JWTConstants {
    const val SECRET = "SecretKeyToGenJWTs"
    const val EXPIRATION_TIME = 864000000L // 10 days
    const val TOKEN_PREFIX = "Bearer "
    const val HEADER_STRING = "Authorization"
    val allowedOrigins = listOf("http://localhost:3000", "http://localhost:3333", "https://polyvolve-admin.herokuapp.com")
}