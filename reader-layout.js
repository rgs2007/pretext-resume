(function attachReaderLayout(global) {
    // These sizes are the Kindle-style zoom stops. The UI moves through this list
    // instead of accepting any arbitrary number so the page stays readable and stable.
    const READER_SIZES = [16, 18, 20, 22, 24, 26, 28, 30];

    // The default index points to 20px, which is treated as the normal 100% reader size.
    const DEFAULT_SIZE_INDEX = 2;
    const BASE_FONT_SIZE = 20;

    // This line-height ratio gives the resume text a book-like rhythm. It is shared
    // with the pretext.js measurement code so the measured height matches the CSS.
    const READER_LINE_HEIGHT = 1.62;

    // The progress bar is decorative, but it still responds to line count so zooming
    // feels like it changes the reader's location inside a Kindle page.
    const MIN_PROGRESS = 12;
    const MAX_PROGRESS = 96;
    const PROGRESS_PER_LINE = 7.5;
    const LOCATION_FONT_WEIGHT = 1.2;

    // Keep the font string in one place because pretext.js needs the same family that
    // the browser uses for the visible reader text.
    const READER_FONT_FAMILY = 'Georgia, "Times New Roman", serif';

    // Keeps calculated values inside a known range. This prevents zoom and progress
    // math from drifting outside what the Kindle interface can display well.
    function clamp(value, minimum, maximum) {
        return Math.min(maximum, Math.max(minimum, value));
    }

    // Extracts only the readable resume copy from an element. Child elements such as
    // the blinking cursor are intentionally ignored so layout measurement uses text
    // content rather than decorative markup.
    function getReadableText(element) {
        return Array.from(element.childNodes)
            .filter((node) => node.nodeType === Node.TEXT_NODE)
            .map((node) => node.textContent)
            .join(' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    // Moves the current zoom index up or down by one stop while respecting the first
    // and last available Kindle-style text sizes.
    function getNextSizeIndex(currentIndex, direction, sizes = READER_SIZES) {
        return clamp(currentIndex + direction, 0, sizes.length - 1);
    }

    // Builds the exact font declaration that pretext.js expects for text measurement.
    // Keeping it here avoids a mismatch between the UI and the measurement engine.
    function getReaderFont(fontSize) {
        return `400 ${fontSize}px ${READER_FONT_FAMILY}`;
    }

    // Converts the active pixel size into the familiar percentage shown between the
    // two Aa buttons.
    function getZoomPercent(fontSize) {
        return Math.round((fontSize / BASE_FONT_SIZE) * 100);
    }

    // Converts measured line count into a bounded footer progress value. This is not
    // a full pagination engine yet; it is a lightweight approximation for the demo.
    function getProgressPercent(lineCount) {
        return clamp(Math.round(lineCount * PROGRESS_PER_LINE), MIN_PROGRESS, MAX_PROGRESS);
    }

    // Converts a current page and total page count into a real measured progress
    // value. Pagination uses this instead of the older decorative line-count progress.
    function getPageProgressPercent(currentPageIndex, pageCount) {
        if (pageCount <= 1) {
            return 100;
        }

        return Math.round(((currentPageIndex + 1) / pageCount) * 100);
    }

    // Splits pretext.js measured lines into exact pages. This is the core of the
    // glitch-free pagination effect: page boundaries come from measured line height
    // and visible reader height instead of guessed character counts.
    function paginateLines(lines, linesPerPage) {
        const safeLinesPerPage = Math.max(1, linesPerPage);
        const pages = [];

        for (let index = 0; index < lines.length; index += safeLinesPerPage) {
            pages.push(lines.slice(index, index + safeLinesPerPage));
        }

        return pages.length > 0 ? pages : [[]];
    }

    // Builds a Kindle-like location number from the current text size and line count.
    // Larger text produces a later-looking location because fewer words fit on screen.
    function getLocation(fontSize, lineCount) {
        return Math.round(fontSize * LOCATION_FONT_WEIGHT + lineCount);
    }

    // Formats the measurement readout shown in the footer and asserted by the tests.
    function formatLayoutStats(lineCount, measuredHeight) {
        return `${lineCount} lines / ${Math.round(measuredHeight)}px`;
    }

    // Expose the helper functions on window so index.html and local browser tests use
    // the same production code without adding a bundler or package manager.
    global.ReaderLayout = Object.freeze({
        READER_SIZES,
        DEFAULT_SIZE_INDEX,
        READER_LINE_HEIGHT,
        clamp,
        formatLayoutStats,
        getLocation,
        getNextSizeIndex,
        getPageProgressPercent,
        getProgressPercent,
        getReadableText,
        getReaderFont,
        getZoomPercent,
        paginateLines,
    });
})(window);
