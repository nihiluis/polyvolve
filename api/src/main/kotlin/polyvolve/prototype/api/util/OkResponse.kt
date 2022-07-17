package polyvolve.prototype.api.util

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.util.MultiValueMap
import java.util.*

data class OkResponse(val status: HttpStatus,
                         val data: Any?,
                         val message: String,
                         val timestamp: Date) {
    constructor(status: HttpStatus, message: String, data: Any? = null) : this(status, data, message, Date())
}

class OkResponseEntity : ResponseEntity<OkResponse> {
    constructor(body: OkResponse) : super(body, body.status)
    constructor(body: OkResponse, headers: MultiValueMap<String, String>) : super(body, headers, body.status)
}

fun okResponse(message: String, data: Any? = null) = OkResponseEntity(OkResponse(HttpStatus.OK, message, data))
fun defaultOkResponse(data: Any? = null) = OkResponseEntity(OkResponse(HttpStatus.OK, "OK", data))