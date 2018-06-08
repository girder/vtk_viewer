module.exports = function (config) {
    // Rules from https://github.com/Kitware/vtk-js/blob/30dc011/Utilities/config/dependency.js#L21-L44
    config.module.rules.push({
        test: /\.glsl$/i,
        include: /node_modules(\/|\\)vtk\.js(\/|\\)/,
        loader: 'shader-loader'
    });
    config.module.rules.push({
        test: /\.js$/,
        include: /node_modules(\/|\\)vtk\.js(\/|\\)/,
        loader: 'babel-loader?presets[]=env'
    });
    config.module.rules.push({
        test: /\.worker\.js$/,
        include: /node_modules(\/|\\)vtk\.js(\/|\\)/,
        use: [
            {
                loader: 'worker-loader',
                options: { inline: true, fallback: false }
            }
        ]
    });
    return config;
};
