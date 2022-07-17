package polyvolve.prototype.api.filters

import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm.HMAC512
import javax.servlet.ServletException
import java.io.IOException
import javax.servlet.FilterChain
import javax.servlet.http.HttpServletResponse
import javax.servlet.http.HttpServletRequest
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import com.fasterxml.jackson.databind.ObjectMapper
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.core.Authentication
import org.springframework.security.core.AuthenticationException
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.userdetails.User
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter
import polyvolve.prototype.api.config.JWTConstants.EXPIRATION_TIME
import polyvolve.prototype.api.config.JWTConstants.HEADER_STRING
import polyvolve.prototype.api.config.JWTConstants.SECRET
import polyvolve.prototype.api.config.JWTConstants.TOKEN_PREFIX
import polyvolve.prototype.api.controllers.AuthController
import java.util.*


class JWTAuthenticationFilter(authenticationManager: AuthenticationManager) : UsernamePasswordAuthenticationFilter() {
    init {
        this.authenticationManager = authenticationManager
    }

    @Throws(AuthenticationException::class)
    override fun attemptAuthentication(req: HttpServletRequest,
                                       res: HttpServletResponse?): Authentication {
        try {
            val credentials = ObjectMapper()
                    .readValue(req.inputStream, AuthController.LoginForm::class.java)

            return authenticationManager.authenticate(
                    UsernamePasswordAuthenticationToken(
                            credentials.mail,
                            credentials.password,
                            ArrayList<GrantedAuthority>())
            )
        } catch (e: IOException) {
            throw RuntimeException(e)
        }

    }

    @Throws(IOException::class, ServletException::class)
    override fun successfulAuthentication(req: HttpServletRequest,
                                                    res: HttpServletResponse,
                                                    chain: FilterChain,
                                                    auth: Authentication) {
        val token = JWT.create()
                .withSubject((auth.principal as User).username)
                .withExpiresAt(Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .sign(HMAC512(SECRET.toByteArray()))
        res.addHeader(HEADER_STRING, TOKEN_PREFIX + token)
    }
}