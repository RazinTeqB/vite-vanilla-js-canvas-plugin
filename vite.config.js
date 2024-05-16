import path from "path";
import { defineConfig } from "vite";
import { transform } from "esbuild";

function minifyEs() {
    return {
        name: "minifyEs",
        renderChunk: {
            order: "post",
            async handler(code, chunk, outputOptions) {
                if (
                    outputOptions.format === "es" &&
                    chunk.fileName.endsWith(".es.js")
                ) {
                    return await transform(code, { minify: true });
                }
                return code;
            },
        },
    };
}

export default defineConfig({
    esbuild: {
        drop: ['console', 'debugger']
    },
    plugins: [minifyEs()], // TODO: Disabled for development purpose only.
    build: {
        // emptyOutDir: false,
        outDir: "./dist",
        assetsDir: "assets",
        minify: "terser",
        lib: {
            entry: "main.js", // Main entry file
            name: "mkd-plugin",
            // formats: ["es", "umd"], // Output formats: ES module and UMD
            formats: ["es"], // Output formats: ES module and UMD
            fileName: (format) => `mkd-plugin.${format}.js`,
        },
        rollupOptions: {
            // External dependencies to exclude from the bundle
            external: [],
            output: {
                inlineDynamicImports: false, // should be false for code splitting
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name.endsWith(".css")) {
                        return "assets/css/[name][extname]";
                    } else {
                        return "[name][extname]";
                    }
                },
                // Global variables to use in UMD format for external imports
                globals: {},
                manualChunks(id) {
                    if (id.includes("node_modules")) {
                        return "@vendor";
                    } else if (id.includes("/src/templates/")) {
                        // Check if file is inside the templates directory
                        // Extract folder name and use it as chunk name
                        const match = id.match(/src\/templates\/([^\/]+)\//);
                        if (match) {
                            return `${match[1]}`; // This groups all files in the same sub-directory into one chunk
                        }
                    }
                },
            },
        },
        cssCodeSplit: false,
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"),
        },
    },
});
