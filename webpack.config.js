const path = require('path');
const {iconPlug} = require("../../icons");


/**
 * We use the NX_TSCONFIG_PATH environment variable when using the @nrwl/angular:webpack-browser
 * builder as it will generate a temporary tsconfig file which contains any required remappings of
 * shared libraries.
 * A remapping will occur when a library is buildable, as webpack needs to know the location of the
 * built files for the buildable library.
 * This NX_TSCONFIG_PATH environment variable is set by the @nrwl/angular:webpack-browser and it contains
 * the location of the generated temporary tsconfig file.
 */
const tsConfigPath =
    process.env.NX_TSCONFIG_PATH ??
    path.join(__dirname, '../../tsconfig.base.json');

const workspaceRootPath = path.join(__dirname, '../../');


module.exports = {
    output: {
        uniqueName: 'ci',
        publicPath: 'auto',
    },
    optimization: {
        runtimeChunk: false,
    },
    experiments: {
        outputModule: true,
    },
    resolve: {
        alias: {},
    },
    plugins: [
        iconPlug(
          'packages/uimatrix/ui-icons/src',
          'dist/packages/fronts/fr-converged',
          'packages/fronts/fr-converged/src/assets/menu.json'
        ),
    ],
};
