package polyvolve.prototype.api.filters

import java.util.ArrayList
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import javax.servlet.http.HttpServletRequest
import org.springframework.security.core.context.SecurityContextHolder
import javax.servlet.ServletException
import java.io.IOException
import javax.servlet.FilterChain
import javax.servlet.http.HttpServletResponse
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter
import polyvolve.prototype.api.config.JWTConstants.HEADER_STRING
import polyvolve.prototype.api.config.JWTConstants.SECRET
import polyvolve.prototype.api.config.JWTConstants.TOKEN_PREFIX
import java.lang.Exception

class JWTAuthorizationFilter(authenticationManager: AuthenticationManager) : BasicAuthenticationFilter(authenticationManager) {
    @Throws(IOException::class, ServletException::class)
    override fun doFilterInternal(req: HttpServletRequest,
                                  res: HttpServletResponse,
                                  chain: FilterChain) {
        val header = req.getHeader(HEADER_STRING)

        if (header == null || !header.startsWith(TOKEN_PREFIX)) {
            chain.doFilter(req, res)
            return
        }

        val authentication = getAuthentication(req)

        SecurityContextHolder.getContext().authentication = authentication
        chain.doFilter(req, res)
    }

    private fun getAuthentication(request: HttpServletRequest): UsernamePasswordAuthenticationToken? {
        val token = request.getHeader(HEADER_STRING)
        if (token != null) {
            // parse the token.
            try {
                val user = JWT.require(Algorithm.HMAC512(SECRET.toByteArray()))
                    .build()
                    .verify(token.replace(TOKEN_PREFIX, ""))
                    .subject

                return if (user != null) {
                    UsernamePasswordAuthenticationToken(user, null, ArrayList<GrantedAuthority>())
                } else null
            } catch (ex: Exception) {
                return null
            }
        }
        return null
    }
}