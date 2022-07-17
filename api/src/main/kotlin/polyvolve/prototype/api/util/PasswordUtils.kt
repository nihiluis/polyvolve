package polyvolve.prototype.api.util

import java.security.SecureRandom
import java.util.Random

object PasswordUtils {
    private var SYMBOLS = "^$*.[]()?-!@#%&/,><':;|_~`".toCharArray()
    private var LOWERCASE = "abcdefghijklmnopqrstuvwxyz".toCharArray()
    private var UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".toCharArray()
    private var NUMBERS = "0123456789".toCharArray()
    private var ALL_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789^$*.[]()?-!@#%&/,><':;|_~`".toCharArray()
    private var rand: Random = SecureRandom()

    fun getRandomPassword(length: Int): String {
        assert(length >= 4)
        val password = CharArray(length)

        //get the requirements out of the way
        password[0] = LOWERCASE[rand.nextInt(LOWERCASE.size)]
        password[1] = UPPERCASE[rand.nextInt(UPPERCASE.size)]
        password[2] = NUMBERS[rand.nextInt(NUMBERS.size)]
        password[3] = SYMBOLS[rand.nextInt(SYMBOLS.size)]

        //populate rest of the password with random chars
        for (i in 4 until length) {
            password[i] = ALL_CHARS[rand.nextInt(ALL_CHARS.size)]
        }

        //shuffle it up
        for (i in password.indices) {
            val randomPosition = rand.nextInt(password.size)
            val temp = password[i]
            password[i] = password[randomPosition]
            password[randomPosition] = temp
        }

        return String(password)
    }
}