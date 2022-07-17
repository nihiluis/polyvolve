package polyvolve.prototype.api.util

import org.springframework.validation.BindException
import org.springframework.validation.BindingResult
import org.springframework.validation.beanvalidation.SpringValidatorAdapter

fun SpringValidatorAdapter.validateAndThrow(target: Any, bindingResult: BindingResult, vararg validationHints: Any) {
    validate(target, bindingResult)
    validate(target, bindingResult, *validationHints)

    if (bindingResult.hasErrors()) {
        throw BindException(bindingResult)
    }
}