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
            exclude: /(node_modules)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['env']
                }
            }
        }
    ]
}
}