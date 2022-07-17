import React from "react"

import { authStyle, cx } from "../../lib/reexports"
import { Logo, Load } from "polyvolve-ui/lib"

const AuthLoadingScreen: React.FC = () => (
  <div className={authStyle.loadingScreen}>
    <Logo size={48} className={cx(authStyle.loadingScreenLogo, "mb1")} />
    <Load size={48} />
    <p className="mt1">Authenticating...</p>
  </div>
)

export default AuthLoadingScreen
