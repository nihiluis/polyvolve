package polyvolve.prototype.api.config

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.stereotype.Component
import java.nio.file.Path
import java.nio.file.Paths


@Component
@ConfigurationProperties("polyvolve.general")
class GeneralConfig {
    var debug = true
    var reviewUrl = ""

    val workingDirectory: Path
        get () {
            return if (debug) {
                Paths.get("").toAbsolutePath()
            } else {
                Paths.get(this::class.java.protectionDomain.codeSource.location.toURI()).parent
            }
        }
}