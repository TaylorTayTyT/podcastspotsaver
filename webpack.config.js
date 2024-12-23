const path = require("path");
const HTMLPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: {
        index: "./src/index.tsx",
        callback: "./src/callback.tsx"
    },
    mode: "production",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: "ts-loader",
                        options: {
                            compilerOptions: { noEmit: false },
                        }
                    }],
                exclude: /node_modules/,
            },
            {
                exclude: /node_modules/,
                test: /\.css$/i,
                use: [
                    "style-loader",
                    "css-loader",
                ]

            },
        ],
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: "manifest.json", to: "../manifest.json" },
                { from: "background.js", to: "../background.js" },
                {from: "config.json", to: "../config.json"},
                {from: "content-script.js", to: "../content-script.js"},
                {from: "podcastsaverlogo - 16.png", to: "../podcastsaverlogo - 16.png"},
                {from: "podcastsaverlogo - 48.png", to: "../podcastsaverlogo - 48.png"},
                {from: "podcastsaverlogo - 128.png", to: "../podcastsaverlogo - 128.png"},
                {from: "podcastsaverlogo - 32.png", to: "../podcastsaverlogo - 32.png"},
            ],
        }),
        ...getHtmlPlugins(["index", "callback"]),
    ],
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    output: {
        path: path.join(__dirname, "dist/js"),
        filename: "[name].js",
    },
};

function getHtmlPlugins(chunks) {
    return chunks.map(
        (chunk) =>
            new HTMLPlugin({
                title: "Spot Saver",
                filename: `${chunk}.html`,
                chunks: [chunk],
            })
    );
}