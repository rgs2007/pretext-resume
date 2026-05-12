(function attachPretextCompat(global) {
    /*
     * Local Pretext compatibility layer.
     *
     * The original demo imported `prepareWithSegments` and `layoutWithLines` from a
     * moving jsDelivr GitHub URL. That remote path disappeared, so the resume now
     * vendors the tiny subset of behavior it needs: prepare text with a font,
     * measure words with Canvas, and return stable line objects for pagination.
     *
     * This file intentionally attaches to `window` instead of using ES modules so
     * the static demo works from GitHub Pages and from a direct local file open.
     */

    function createMeasurementContext(font) {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        context.font = font;
        return context;
    }

    function measureTextWidth(context, text) {
        return context.measureText(text).width;
    }

    function tokenizePreservingSpaces(text) {
        return text.match(/\S+|\s+/g) || [];
    }

    function normalizeSpaceToken(token, whiteSpace) {
        if (whiteSpace === "pre-wrap") {
            return token.replace(/\n/g, "\n");
        }

        return token.replace(/\s+/g, " ");
    }

    function pushLine(lines, text, lineHeight) {
        lines.push({
            text,
            width: 0,
            height: lineHeight,
        });
    }

    /*
     * Prepare keeps a measured context and token list together. The shape is small,
     * but it mirrors the old external API enough for the rest of the page to stay
     * focused on layout and animation.
     */
    function prepareWithSegments(text, font, options = {}) {
        return {
            text,
            font,
            whiteSpace: options.whiteSpace || "normal",
            context: createMeasurementContext(font),
            tokens: tokenizePreservingSpaces(text),
        };
    }

    /*
     * Layout computes browser-like soft wrapping with explicit newline support. It
     * is intentionally conservative rather than clever: resume pagination needs
     * stable lines more than full typography-engine complexity.
     */
    function layoutWithLines(prepared, maxWidth, lineHeight) {
        const lines = [];
        let currentLine = "";
        let currentWidth = 0;

        function commitCurrentLine() {
            pushLine(lines, currentLine, lineHeight);
            currentLine = "";
            currentWidth = 0;
        }

        prepared.tokens.forEach((rawToken) => {
            const token = normalizeSpaceToken(rawToken, prepared.whiteSpace);
            const parts = token.split(/(\n)/);

            parts.forEach((part) => {
                if (part === "") {
                    return;
                }

                if (part === "\n") {
                    commitCurrentLine();
                    return;
                }

                const measuredPart = currentLine === "" ? part.trimStart() : part;
                const partWidth = measureTextWidth(prepared.context, measuredPart);

                if (currentLine !== "" && currentWidth + partWidth > maxWidth) {
                    commitCurrentLine();
                }

                const nextPart = currentLine === "" ? measuredPart.trimStart() : measuredPart;
                currentLine += nextPart;
                currentWidth = measureTextWidth(prepared.context, currentLine);
            });
        });

        if (currentLine !== "" || lines.length === 0) {
            commitCurrentLine();
        }

        lines.forEach((line) => {
            line.width = measureTextWidth(prepared.context, line.text);
        });

        return {
            lines,
            lineCount: lines.length,
            height: lines.length * lineHeight,
        };
    }

    global.PretextCompat = Object.freeze({
        layoutWithLines,
        prepareWithSegments,
    });
})(window);
