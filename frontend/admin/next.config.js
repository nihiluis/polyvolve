const withTM = require("next-transpile-modules")(["polyvolve-ui"])
const withPlugins = require("next-compose-plugins")
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer")
const path = require("path")

if (typeof require !== "undefined") {
  require.extensions[".less"] = () => {}
  require.extensions[".css"] = file => {}
}

module.exports = withPlugins(
  [withTM],
  {
    webpack(config) {
      if (process.env.ANALYZE) {
        config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: "server",
            analyzerPort: 8888,
            openAnalyzer: true,
          })
        )
      }

      config.module.rules.push({
        test: /\.isvg$/,
        use: "raw-loader",
      })

      config.resolve.alias["components"] = path.join(
        __dirname,
        "src",
        "components"
      )
      config.resolve.alias["style"] = path.join(__dirname, "src", "style")

      return config
    },
    sassOptions: {
      includePaths: [
        path.join(__dirname, "src", "style"),
        path.join(__dirname, "node_modules", "polyvolve-ui", "src", "style"),
      ],
    },
  },

  {
    onDemandEntries: {
      // period (in ms) where the server will keep pages in the buffer
      maxInactiveAge: 25 * 1000,
      // number of pages that should be kept simultaneously without being disposed
      pagesBufferLength: 5,
    },
  }
)
