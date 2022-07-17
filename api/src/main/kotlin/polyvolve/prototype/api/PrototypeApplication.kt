package polyvolve.prototype.api

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.scheduling.annotation.EnableScheduling

/**
 * Manages an instance of Polyvolve.
 */
@SpringBootApplication
@EnableScheduling
class PrototypeApplication

fun main(args: Array<String>) {
    runApplication<PrototypeApplication>()
}
