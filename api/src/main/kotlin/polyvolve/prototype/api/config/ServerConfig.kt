package polyvolve.prototype.api.config

import org.slf4j.LoggerFactory
import org.springframework.boot.web.server.ConfigurableWebServerFactory
import org.springframework.boot.web.server.WebServerFactoryCustomizer
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.jdbc.datasource.DriverManagerDataSource
import javax.sql.DataSource

@Configuration
class ServerConfig : WebServerFactoryCustomizer<ConfigurableWebServerFactory> {
    private val logger = LoggerFactory.getLogger(ServerConfig::class.java)

    override fun customize(factory: ConfigurableWebServerFactory) {
        val port = System.getenv()["PORT"]?.toInt() ?: 8080

        factory.setPort(port)
    }

    @Bean
    fun dataSource(): DataSource {
        val dataSource = DriverManagerDataSource()

        val herokuDatabaseUrl = System.getenv()["JDBC_DATABASE_URL"]
        if (herokuDatabaseUrl != null) {
            dataSource.setDriverClassName("org.postgresql.Driver")
            dataSource.url = herokuDatabaseUrl
        } else {
            dataSource.url = "jdbc:postgresql://localhost:5432/polyvolve?ssl=false"
            // dataSource.username = "poly"
            // dataSource.password = "vITM9ZxUaaMfI7hmJ6Ki"
        }

        logger.info("Connecting to database_url ${dataSource.url}")

        return dataSource
    }
}