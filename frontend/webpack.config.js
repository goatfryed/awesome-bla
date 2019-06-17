
// encore is actually an webpack config generator. we can remove it, if it's confusing or annoying, but it provides some useful
// defaults without losing configuration potential
const Encore = require('@symfony/webpack-encore');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// make sure a runtime environment is set for ide introspection or intellij gets annoying
if (!Encore.isRuntimeEnvironmentConfigured()) {
    Encore.configureRuntimeEnvironment(process.env.NODE_ENV || 'dev');
}

module.exports = Encore
    .setOutputPath('public')

    .addEntry( "app", "./src/app.jsx")

    // output path for generated javascript from project point of view
    .setOutputPath("public/build")
    // path to generated javascript from browser point of view
    .setPublicPath("/build")
    .cleanupOutputBeforeBuild()

    .addPlugin(
        new HtmlWebpackPlugin({
            template: "./templates/index.html",
            filename: "../index.html", //we want everything in build to cleanup generated stuff, but the index must be on top lvl
        })
    )

    .configureBabel(
        () => {
        },
        {
            useBuiltIns: "usage",
            corejs: 3,
        }
    )
    .enableReactPreset()

    // as we build a single-page-application, we'll generated only one chunk prob. maybe split libraries later on
    // .splitEntryChunks()
    // .enableSingleRuntimeChunk()

    .enableSourceMaps(!Encore.isProduction())
    // some cache busting mechanism for older browsers
    .enableVersioning(Encore.isProduction())

    // notifications are fun
    .enableBuildNotifications()

    .getWebpackConfig()
;
