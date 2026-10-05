:root {

    --page-bg: #0b1016;

    --panel-bg: #111923;

    --panel-secondary: #17212d;

    --text: #eef3f8;

    --muted: #94a3b5;

    --border: #293747;

    --accent: #4aa3ff;

    --accent-hover: #268ced;

    --success: #5ccc8a;

    --warning: #f1c75b;

    --danger: #ff6969;

    --radius: 14px;

}


body.light-theme {

    --page-bg: #f3f6f9;

    --panel-bg: #ffffff;

    --panel-secondary: #f4f7fa;

    --text: #18212b;

    --muted: #637083;

    --border: #d3dbe5;

    --accent: #1565c0;

    --accent-hover: #0d4fa0;

}


* {

    box-sizing: border-box;

}


html {

    scroll-behavior: smooth;

}


body {

    margin: 0;

    font-family:
        Inter,
        system-ui,
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        sans-serif;

    color: var(--text);

    background: var(--page-bg);

    line-height: 1.5;

}


/* =========================================================
   HEADER
   ========================================================= */

.app-header {

    border-bottom:
        1px solid
        var(--border);

    background:
        var(--panel-bg);

}


.header-inner {

    max-width: 1400px;

    margin: 0 auto;

    padding: 26px 24px;

    display: flex;

    align-items: center;

    justify-content: space-between;

    gap: 30px;

}


.app-header h1 {

    margin: 0 0 5px;

    font-size:
        clamp(
            1.7rem,
            3vw,
            2.5rem
        );

}


.app-header p {

    margin: 0;

    color: var(--muted);

}


.header-controls {

    min-width: 160px;

}


/* =========================================================
   LAYOUT
   ========================================================= */

.app-container {

    max-width: 1400px;

    margin: 0 auto;

    padding:
        26px
        24px
        50px;

    display: grid;

    gap: 22px;

}


/* =========================================================
   PANEL
   ========================================================= */

.panel {

    background:
        var(--panel-bg);

    border:
        1px solid
        var(--border);

    border-radius:
        var(--radius);

    padding:
        24px;

}


.panel h2 {

    margin:
        0
        0
        18px;

}


.panel h3 {

    margin:
        28px
        0
        14px;

    font-size:
        1rem;

}


.section-heading {

    display: flex;

    align-items: flex-start;

    justify-content: space-between;

    gap: 20px;

    margin-bottom: 18px;

}


.section-heading h2 {

    margin-bottom: 3px;

}


.section-heading p {

    margin: 0;

    color: var(--muted);

}


.version-badge {

    background:
        var(--panel-secondary);

    border:
        1px solid
        var(--border);

    border-radius:
        999px;

    padding:
        5px 10px;

    color:
        var(--muted);

    font-size:
        0.8rem;

}


/* =========================================================
   FORMS
   ========================================================= */

.form-grid,
.parameter-grid {

    display: grid;

    gap: 15px;

}


.two-columns {

    grid-template-columns:
        repeat(
            2,
            minmax(0, 1fr)
        );

}


.three-columns {

    grid-template-columns:
        repeat(
            3,
            minmax(0, 1fr)
        );

}


.parameter-grid {

    grid-template-columns:
        repeat(
            5,
            minmax(0, 1fr)
        );

}


.form-group {

    min-width: 0;

    display: flex;

    flex-direction: column;

    gap: 6px;

}


label {

    color:
        var(--muted);

    font-size:
        0.85rem;

}


input,
select {

    width: 100%;

    min-height:
        44px;

    padding:
        9px
        11px;

    border:
        1px solid
        var(--border);

    border-radius:
        8px;

    background:
        var(--panel-secondary);

    color:
        var(--text);

    font:
        inherit;

    outline:
        none;

}


input:focus,
select:focus {

    border-color:
        var(--accent);

    box-shadow:
        0 0 0 3px
        color-mix(
            in srgb,
            var(--accent) 20%,
            transparent
        );

}


/* =========================================================
   DROP ZONE
   ========================================================= */

.drop-zone {

    border:
        2px dashed
        var(--border);

    border-radius:
        12px;

    padding:
        28px;

    display:
        flex;

    flex-direction:
        column;

    align-items:
        center;

    justify-content:
        center;

    gap:
        9px;

    text-align:
        center;

    background:
        var(--panel-secondary);

    cursor:
        pointer;

    transition:
        border-color .2s ease,
        transform .15s ease;

}


.drop-zone:hover,
.drop-zone.drag-over {

    border-color:
        var(--accent);

}


.drop-zone.drag-over {

    transform:
        scale(1.005);

}


.drop-zone span {

    color:
        var(--muted);

    font-size:
        .85rem;

}


.import-options {

    margin-top:
        18px;

}


/* =========================================================
   STATUS
   ========================================================= */

.status-box {

    margin-top:
        15px;

    padding:
        10px
        12px;

    border-left:
        4px solid
        var(--accent);

    border-radius:
        7px;

    background:
        var(--panel-secondary);

    color:
        var(--muted);

    font-size:
        .85rem;

}


.status-box.success {

    border-left-color:
        var(--success);

}


.status-box.warning {

    border-left-color:
        var(--warning);

}


.status-box.error {

    border-left-color:
        var(--danger);

}


/* =========================================================
   BUTTONS
   ========================================================= */

.button-row {

    display:
        flex;

    flex-wrap:
        wrap;

    gap:
        10px;

    margin-top:
        26px;

}


button {

    min-height:
        44px;

    padding:
        10px
        15px;

    border-radius:
        8px;

    border:
        1px solid
        var(--border);

    cursor:
        pointer;

    font:
        inherit;

    font-weight:
        600;

}


.primary-button {

    background:
        var(--accent);

    border-color:
        var(--accent);

    color:
        white;

}


.primary-button:hover {

    background:
        var(--accent-hover);

}


.secondary-button {

    color:
        var(--text);

    background:
        var(--panel-secondary);

}


.secondary-button:hover {

    border-color:
        var(--accent);

}


/* =========================================================
   EQUATION
   ========================================================= */

.equation-box {

    padding:
        22px;

    border:
        1px solid
        var(--border);

    border-radius:
        11px;

    background:
        var(--panel-secondary);

    text-align:
        center;

    overflow-wrap:
        anywhere;

    font-family:
        "Cambria Math",
        "Times New Roman",
        serif;

    font-size:
        clamp(
            1.05rem,
            2vw,
            1.45rem
        );

}


/* =========================================================
   CHART
   ========================================================= */

.chart-container {

    position:
        relative;

    width:
        100%;

    height:
        500px;

    border:
        1px solid
        var(--border);

    border-radius:
        10px;

    overflow:
        hidden;

}


.graph-panel {

    min-width: 0;

}


/* =========================================================
   RESULTS
   ========================================================= */

.result-grid {

    display:
        grid;

    grid-template-columns:
        repeat(
            4,
            minmax(0, 1fr)
        );

    gap:
        14px;

}


.result-card {

    padding:
        16px;

    background:
        var(--panel-secondary);

    border:
        1px solid
        var(--border);

    border-radius:
        9px;

}


.result-card span {

    display:
        block;

    margin-bottom:
        7px;

    color:
        var(--muted);

    font-size:
        .8rem;

}


.result-card strong {

    font-size:
        1.1rem;

}


/* =========================================================
   NOTES
   ========================================================= */

.notes p {

    margin:
        7px 0;

    color:
        var(--muted);

}


/* =========================================================
   FOOTER
   ========================================================= */

.app-footer {

    padding:
        24px;

    text-align:
        center;

    color:
        var(--muted);

    border-top:
        1px solid
        var(--border);

    background:
        var(--panel-bg);

    font-size:
        .85rem;

}


/* =========================================================
   UTILITIES
   ========================================================= */

.hidden {

    display:
        none !important;

}


/* =========================================================
   RESPONSIVE
   ========================================================= */

@media
(max-width: 1100px) {

    .parameter-grid {

        grid-template-columns:
            repeat(
                3,
                minmax(0, 1fr)
            );

    }

}


@media
(max-width: 800px) {

    .header-inner {

        flex-direction:
            column;

        align-items:
            stretch;

    }


    .two-columns,
    .three-columns,
    .parameter-grid,
    .result-grid {

        grid-template-columns:
            repeat(
                2,
                minmax(0, 1fr)
            );

    }


    .chart-container {

        height:
            420px;

    }

}


@media
(max-width: 520px) {

    .app-container,
    .header-inner {

        padding-left:
            14px;

        padding-right:
            14px;

    }


    .panel {

        padding:
            17px;

    }


    .two-columns,
    .three-columns,
    .parameter-grid,
    .result-grid {

        grid-template-columns:
            1fr;

    }


    .button-row {

        flex-direction:
            column;

    }


    button {

        width:
            100%;

    }


    .chart-container {

        height:
            350px;

    }

}
