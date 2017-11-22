module.exports = {
    resolve: {
        alias: {
          'osc-js': './node_modules/osc-js/lib/osc.browser.js',
        },
    },
    module: {
        rules: [
        {
            test: /\.(js|jsx)$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: 'babel-loader',
                query: {
                    presets: ["env", "stage-0"],
                    babelrc: false,
                },
                // options: {
                //     //presets: ['env'],
                //     babelrc: false,
                // }
            }
        }
    ]
}
}