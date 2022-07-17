package polyvolve.prototype.api.util

import com.auth0.jwt.exceptions.TokenExpiredException
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.MessageSource
import org.springframework.validation.BindException
import org.springframework.validation.BindingResult
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import polyvolve.prototype.api.util.ErrorResponseEntity.Companion.badRequest
import polyvolve.prototype.api.util.ErrorResponseEntity.Companion.unauthorized
import polyvolve.prototype.api.util.exceptions.AuthException
import java.util.*

@ControllerAdvice
class ExceptionHandlers @Autowired constructor(var messageSource: MessageSource) {
    @ExceptionHandler(AuthException::class)
    fun resourceNotFoundException(exception: AuthException, locale: Locale) =
            unauthorized(exception.message ?: "Unspecified")


    @ExceptionHandler(IllegalArgumentException::class)
    fun illegalArgumentException(exception: IllegalArgumentException, locale: Locale) =
            badRequest(exception.message ?: "Unspecified")

    @ExceptionHandler(MethodArgumentNotValidException::class)
    fun methodArgumentNotValidException(exception: MethodArgumentNotValidException, locale: Locale) =
            badRequest("Method argument not valid.", mapBindingResult(exception.bindingResult, locale));

    @ExceptionHandler(BindException::class)
    fun bindException(exception: BindException, locale: Locale) =
            badRequest("Binding not possible.", mapBindingResult(exception.bindingResult, locale));

    @ExceptionHandler(TokenExpiredException::class)
    fun tokenExpiredException(exception: TokenExpiredException, locale: Locale) = unauthorized("Token expired. Log in again!")

    fun mapBindingResult(bindingResult: BindingResult, locale: Locale) =
            bindingResult.allErrors.map { messageSource.getMessage(it, locale) }

}