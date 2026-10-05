"use strict";


/* =========================================================
   JOHNSON-COOK CURVE STUDIO
   V1.1
   ========================================================= */


const $ = id =>
    document.getElementById(id);


/* =========================================================
   PRESETS
   ========================================================= */

const PRESETS = {

    weldox700: {

        name:
            "Weldox 700E",

        model:
            "modified",

        A:
            0.819,

        B:
            0.308,

        n:
            0.64,

        C:
            0.0098,

        m:
            1.0,

        Q1:
            0,

        C1:
            0,

        Q2:
            0,

        C2:
            0,

        refRate:
            5e-4,

        Tr:
            293,

        Tm:
            1800,

        rate:
            5e-4,

        T:
            293,

        maxStrain:
            1.5

    },


    hardox400: {

        name:
            "Hardox 400",

        model:
            "modified",

        A:
            1.350,

        B:
            0.362,

        n:
            1.0,

        C:
            0.0108,

        m:
            1.0,

        Q1:
            0,

        C1:
            0,

        Q2:
            0,

        C2:
            0,

        refRate:
            5e-4,

        Tr:
            293,

        Tm:
            1800,

        rate:
            5e-4,

        T:
            293,

        maxStrain:
            1.5

    },


    apm2: {

        name:
            "APM2 Hardened Steel Core",

        model:
            "simplified",

        A:
            1.2,

        B:
            50.0,

        n:
            1.0,

        C:
            0.0,

        VP:
            1.0,

        PSFAIL:
            1e17,

        SIGMAX:
            1e28,

        SIGSAT:
            1e28,

        /*
        LS-DYNA deck:
        EPS0 = 1 / ms

        Converted internally:
        1000 / s
        */

        refRate:
            1000,

        rate:
            1000,

        maxStrain:
            0.15

    }

};


/* =========================================================
   ELEMENTS
   ========================================================= */

const modelType =
    $("modelType");

const preset =
    $("preset");


const A =
    $("A");

const B =
    $("B");

const n =
    $("n");

const C =
    $("C");


const m =
    $("m");

const Q1 =
    $("Q1");

const C1 =
    $("C1");

const Q2 =
    $("Q2");

const C2 =
    $("C2");


const VP =
    $("VP");

const PSFAIL =
    $("PSFAIL");

const SIGMAX =
    $("SIGMAX");

const SIGSAT =
    $("SIGSAT");


const referenceStrainRate =
    $("referenceStrainRate");

const referenceTemperature =
    $("referenceTemperature");

const meltingTemperature =
    $("meltingTemperature");

const strainRate =
    $("strainRate");

const temperature =
    $("temperature");

const maxPlasticStrain =
    $("maxPlasticStrain");


const equationBox =
    $("equationBox");


const stressAtZero =
    $("stressAtZero");

const stressAt01 =
    $("stressAt01");

const strainRateMultiplier =
    $("strainRateMultiplier");

const thermalMultiplierDisplay =
    $("thermalMultiplier");


const chartBackground =
    $("chartBackground");

const appTheme =
    $("appTheme");


const dropZone =
    $("dropZone");

const browseKButton =
    $("browseKButton");

const kFileInput =
    $("kFileInput");

const detectedMaterials =
    $("detectedMaterials");

const fileStatus =
    $("fileStatus");

const kTimeUnit =
    $("kTimeUnit");

const kStressUnit =
    $("kStressUnit");


let importedMaterials =
    [];

let activeImportedName =
    "";

let comparisonColorIndex =
    1;


/* =========================================================
   COLORS
   ========================================================= */

const COLORS = [

    "#1565c0",
    "#d84315",
    "#2e7d32",
    "#7b1fa2",
    "#f9a825",
    "#00838f",
    "#c2185b",
    "#5d4037"

];


/* =========================================================
   CHART BACKGROUND PLUGIN
   ========================================================= */

const backgroundPlugin = {

    id:
        "customBackground",

    beforeDraw(
        chart,
        args,
        options
    ) {

        if (
            !options ||
            !options.color
        ) {

            return;

        }


        const ctx =
            chart.ctx;


        ctx.save();

        ctx.globalCompositeOperation =
            "destination-over";

        ctx.fillStyle =
            options.color;

        ctx.fillRect(
            0,
            0,
            chart.width,
            chart.height
        );

        ctx.restore();

    }

};


/* =========================================================
   CHART
   ========================================================= */

const chart =
    new Chart(

        $("jcChart")
            .getContext("2d"),

        {

            type:
                "line",

            plugins: [
                backgroundPlugin
            ],

            data: {

                datasets: []

            },

            options: {

                responsive:
                    true,

                maintainAspectRatio:
                    false,

                animation:
                    false,

                devicePixelRatio:
                    2,

                parsing:
                    false,

                normalized:
                    true,

                interaction: {

                    mode:
                        "nearest",

                    intersect:
                        false

                },

                plugins: {

                    customBackground: {

                        color:
                            "#ffffff"

                    },


                    legend: {

                        display:
                            true,

                        labels: {

                            color:
                                "#111827",

                            usePointStyle:
                                true

                        }

                    },


                    tooltip: {

                        callbacks: {

                            title(
                                items
                            ) {

                                if (
                                    !items.length
                                ) {

                                    return "";

                                }


                                return (

                                    "Plastic strain = " +

                                    items[0]
                                        .parsed
                                        .x
                                        .toFixed(5)

                                );

                            },


                            label(
                                context
                            ) {

                                return (

                                    context.dataset.label +

                                    ": " +

                                    context
                                        .parsed
                                        .y
                                        .toFixed(5) +

                                    " GPa"

                                );

                            }

                        }

                    }

                },


                scales: {

                    x: {

                        type:
                            "linear",

                        title: {

                            display:
                                true,

                            text:
                                "Equivalent Plastic Strain",

                            color:
                                "#111827"

                        },

                        ticks: {

                            color:
                                "#374151"

                        },

                        grid: {

                            color:
                                "rgba(31,41,55,0.13)"

                        }

                    },


                    y: {

                        beginAtZero:
                            true,

                        title: {

                            display:
                                true,

                            text:
                                "Flow Stress [GPa]",

                            color:
                                "#111827"

                        },

                        ticks: {

                            color:
                                "#374151"

                        },

                        grid: {

                            color:
                                "rgba(31,41,55,0.13)"

                        }

                    }

                }

            }

        }

    );


/* =========================================================
   NUMERIC UTILITIES
   ========================================================= */

function numeric(
    element,
    label
) {

    const value =
        Number(
            element.value
        );


    if (
        !Number.isFinite(
            value
        )
    ) {

        throw new Error(
            `${label} is not a valid number.`
        );

    }


    return value;

}


function setValue(
    element,
    value
) {

    if (
        element &&
        value !== undefined &&
        Number.isFinite(
            Number(value)
        )
    ) {

        element.value =
            value;

    }

}


/* =========================================================
   READ PARAMETERS
   ========================================================= */

function readParameters() {

    const p = {

        model:
            modelType.value,

        A:
            numeric(
                A,
                "A"
            ),

        B:
            numeric(
                B,
                "B"
            ),

        n:
            numeric(
                n,
                "n"
            ),

        C:
            numeric(
                C,
                "C"
            ),

        refRate:
            numeric(
                referenceStrainRate,
                "Reference strain rate"
            ),

        rate:
            numeric(
                strainRate,
                "Strain rate"
            ),

        maxStrain:
            numeric(
                maxPlasticStrain,
                "Maximum plastic strain"
            )

    };


    if (
        p.refRate <= 0
    ) {

        throw new Error(
            "Reference strain rate must be greater than zero."
        );

    }


    if (
        p.rate < 0
    ) {

        throw new Error(
            "Strain rate cannot be negative."
        );

    }


    if (
        p.maxStrain <= 0
    ) {

        throw new Error(
            "Maximum plastic strain must be greater than zero."
        );

    }


    if (
        p.model ===
        "modified"
    ) {

        p.m =
            numeric(
                m,
                "m"
            );


        p.Q1 =
            numeric(
                Q1,
                "Q1"
            );


        p.C1 =
            numeric(
                C1,
                "C1"
            );


        p.Q2 =
            numeric(
                Q2,
                "Q2"
            );


        p.C2 =
            numeric(
                C2,
                "C2"
            );


        p.Tr =
            numeric(
                referenceTemperature,
                "Reference temperature"
            );


        p.Tm =
            numeric(
                meltingTemperature,
                "Melting temperature"
            );


        p.T =
            numeric(
                temperature,
                "Temperature"
            );


        if (
            p.Tm <=
            p.Tr
        ) {

            throw new Error(
                "Melting temperature must be greater than Tr."
            );

        }

    }


    else {

        p.VP =
            numeric(
                VP,
                "VP"
            );


        p.PSFAIL =
            numeric(
                PSFAIL,
                "PSFAIL"
            );


        p.SIGMAX =
            numeric(
                SIGMAX,
                "SIGMAX"
            );


        p.SIGSAT =
            numeric(
                SIGSAT,
                "SIGSAT"
            );

    }


    return p;

}


/* =========================================================
   MAT 107
   MODIFIED JOHNSON-COOK
   ========================================================= */

function modifiedHardening(
    strain,
    p
) {

    const powerLaw =

        p.A +

        p.B *
        Math.pow(
            strain,
            p.n
        );


    const voce1 =

        p.Q1 *

        (
            1 -

            Math.exp(
                -p.C1 *
                strain
            )
        );


    const voce2 =

        p.Q2 *

        (
            1 -

            Math.exp(
                -p.C2 *
                strain
            )
        );


    return (

        powerLaw +

        voce1 +

        voce2

    );

}


function modifiedRateMultiplier(
    p
) {

    const normalizedRate =

        p.rate /
        p.refRate;


    return Math.pow(

        1 +
        normalizedRate,

        p.C

    );

}


function temperatureStar(
    p
) {

    let value =

        (
            p.T -
            p.Tr
        )

        /

        (
            p.Tm -
            p.Tr
        );


    value =
        Math.max(
            0,
            Math.min(
                1,
                value
            )
        );


    return value;

}


function thermalMultiplier(
    p
) {

    if (
        p.model !==
        "modified"
    ) {

        return 1;

    }


    return (

        1 -

        Math.pow(
            temperatureStar(p),
            p.m
        )

    );

}


/* =========================================================
   MAT 098
   SIMPLIFIED JOHNSON-COOK
   ========================================================= */

function simplifiedRateMultiplier(
    p
) {

    /*
    EPS0 is a quasi-static threshold.

    For visualization we do not reduce
    strength below the reference curve.
    */

    const ratio =

        Math.max(
            p.rate /
            p.refRate,
            1
        );


    return (

        1 +

        p.C *
        Math.log(
            ratio
        )

    );

}


/* =========================================================
   FLOW STRESS
   ========================================================= */

function flowStress(
    plasticStrain,
    p
) {

    if (
        p.model ===
        "modified"
    ) {

        return Math.max(

            0,

            modifiedHardening(
                plasticStrain,
                p
            )

            *

            modifiedRateMultiplier(
                p
            )

            *

            thermalMultiplier(
                p
            )

        );

    }


    let hardening =

        p.A +

        p.B *

        Math.pow(
            plasticStrain,
            p.n
        );


    /*
    LS-DYNA ignores SIGMAX and SIGSAT
    when VP = 1.
    */

    if (
        p.VP !== 1 &&
        p.SIGMAX > 0
    ) {

        hardening =
            Math.min(
                hardening,
                p.SIGMAX
            );

    }


    let stress =

        hardening *

        simplifiedRateMultiplier(
            p
        );


    if (
        p.VP !== 1 &&
        p.SIGSAT > 0
    ) {

        stress =
            Math.min(
                stress,
                p.SIGSAT
            );

    }


    return Math.max(
        0,
        stress
    );

}


/* =========================================================
   CURVE GENERATION
   ========================================================= */

function generateCurve(
    p
) {

    const N =
        500;


    let finalStrain =
        p.maxStrain;


    if (
        p.model ===
        "simplified" &&
        p.PSFAIL > 0 &&
        p.PSFAIL < 1000
    ) {

        finalStrain =

            Math.min(
                finalStrain,
                p.PSFAIL
            );

    }


    const output =
        [];


    for (
        let i = 0;
        i <= N;
        i++
    ) {

        const strain =

            finalStrain *
            i /
            N;


        output.push({

            x:
                strain,

            y:
                flowStress(
                    strain,
                    p
                )

        });

    }


    return output;

}


/* =========================================================
   LABEL
   ========================================================= */

function curveLabel(
    p
) {

    let name =
        activeImportedName ||
        "Custom Material";


    if (
        preset.value !==
        "custom"
    ) {

        name =
            PRESETS[
                preset.value
            ].name;

    }


    let label =

        `${name} | ` +

        `rate=${scientific(p.rate)} s⁻¹`;


    if (
        p.model ===
        "modified"
    ) {

        label +=

            ` | T=${p.T} K`;

    }


    return label;

}


/* =========================================================
   UPDATE CURRENT CURVE
   ========================================================= */

function updateCurve() {

    try {

        const p =
            readParameters();


        const dataset = {

            label:
                curveLabel(p),

            data:
                generateCurve(p),

            borderColor:
                COLORS[0],

            backgroundColor:
                COLORS[0],

            borderWidth:
                3,

            pointRadius:
                0,

            pointHoverRadius:
                4,

            tension:
                0

        };


        if (
            chart.data.datasets.length ===
            0
        ) {

            chart.data.datasets.push(
                dataset
            );

        }

        else {

            chart.data.datasets[0] =
                dataset;

        }


        updateResults(
            p
        );


        updateEquation();


        chart.update(
            "none"
        );

    }

    catch (error) {

        console.warn(
            error.message
        );

    }

}


/* =========================================================
   ADD / CLEAR COMPARISON
   ========================================================= */

function addComparison() {

    try {

        const p =
            readParameters();


        const color =

            COLORS[
                comparisonColorIndex %
                COLORS.length
            ];


        comparisonColorIndex++;


        chart.data.datasets.push({

            label:
                curveLabel(p),

            data:
                generateCurve(p),

            borderColor:
                color,

            backgroundColor:
                color,

            borderWidth:
                2.4,

            pointRadius:
                0,

            tension:
                0

        });


        chart.update(
            "none"
        );

    }

    catch (error) {

        alert(
            error.message
        );

    }

}


function clearComparisons() {

    if (
        chart.data.datasets.length
    ) {

        chart.data.datasets = [

            chart.data.datasets[0]

        ];

    }


    comparisonColorIndex =
        1;


    chart.update(
        "none"
    );

}


/* =========================================================
   RESULTS
   ========================================================= */

function updateResults(
    p
) {

    stressAtZero.textContent =

        flowStress(
            0,
            p
        ).toFixed(4)

        +

        " GPa";


    stressAt01.textContent =

        flowStress(
            0.1,
            p
        ).toFixed(4)

        +

        " GPa";


    const rate =

        p.model ===
        "modified"

        ?

        modifiedRateMultiplier(p)

        :

        simplifiedRateMultiplier(p);


    strainRateMultiplier.textContent =

        rate.toFixed(5);


    thermalMultiplierDisplay.textContent =

        thermalMultiplier(p)
            .toFixed(5);

}


/* =========================================================
   EQUATION
   ========================================================= */

function updateEquation() {

    if (
        modelType.value ===
        "modified"
    ) {

        equationBox.innerHTML =

            "σ<sub>Y</sub> = " +

            "{ A + Br<sup>n</sup> " +

            "+ Q<sub>1</sub>[1 − exp(−C<sub>1</sub>r)] " +

            "+ Q<sub>2</sub>[1 − exp(−C<sub>2</sub>r)] } " +

            "(1 + ṙ / ε̇<sub>0</sub>)<sup>C</sup> " +

            "[1 − (T*)<sup>m</sup>]";

    }

    else {

        equationBox.innerHTML =

            "σ<sub>Y</sub> = " +

            "[A + B(ε<sub>p</sub>)<sup>n</sup>] " +

            "[1 + C ln(ε̇ / EPS0)]";

    }

}


/* =========================================================
   MODEL UI
   ========================================================= */

function updateModelUI() {

    document
        .querySelectorAll(
            ".modified-only"
        )
        .forEach(
            element => {

                element.classList.toggle(

                    "hidden",

                    modelType.value !==
                    "modified"

                );

            }
        );


    document
        .querySelectorAll(
            ".simplified-only"
        )
        .forEach(
            element => {

                element.classList.toggle(

                    "hidden",

                    modelType.value !==
                    "simplified"

                );

            }
        );


    updateEquation();

}


/* =========================================================
   PRESETS
   ========================================================= */

function applyPreset() {

    const key =
        preset.value;


    if (
        key ===
        "custom"
    ) {

        return;

    }


    activeImportedName =
        "";


    const p =
        PRESETS[key];


    modelType.value =
        p.model;


    setValue(
        A,
        p.A
    );

    setValue(
        B,
        p.B
    );

    setValue(
        n,
        p.n
    );

    setValue(
        C,
        p.C
    );


    setValue(
        referenceStrainRate,
        p.refRate
    );


    setValue(
        strainRate,
        p.rate
    );


    setValue(
        maxPlasticStrain,
        p.maxStrain
    );


    if (
        p.model ===
        "modified"
    ) {

        setValue(
            m,
            p.m
        );

        setValue(
            Q1,
            p.Q1
        );

        setValue(
            C1,
            p.C1
        );

        setValue(
            Q2,
            p.Q2
        );

        setValue(
            C2,
            p.C2
        );

        setValue(
            referenceTemperature,
            p.Tr
        );

        setValue(
            meltingTemperature,
            p.Tm
        );

        setValue(
            temperature,
            p.T
        );

    }

    else {

        setValue(
            VP,
            p.VP
        );

        setValue(
            PSFAIL,
            p.PSFAIL
        );

        setValue(
            SIGMAX,
            p.SIGMAX
        );

        setValue(
            SIGSAT,
            p.SIGSAT
        );

    }


    updateModelUI();

    updateCurve();

}


/* =========================================================
   CHART APPEARANCE
   ========================================================= */

function updateChartAppearance() {

    const mode =
        chartBackground.value;


    let background;
    let text;
    let ticks;
    let grid;


    if (
        mode ===
        "dark"
    ) {

        background =
            "#0b1118";

        text =
            "#ecf2f8";

        ticks =
            "#b5c0cc";

        grid =
            "rgba(215,225,235,.15)";

    }

    else {

        background =

            mode ===
            "transparent"

            ?

            null

            :

            "#ffffff";


        const isDarkApp =

            !document.body
                .classList
                .contains(
                    "light-theme"
                );


        text =

            mode ===
            "transparent" &&
            isDarkApp

            ?

            "#ecf2f8"

            :

            "#111827";


        ticks =
            text;


        grid =

            mode === "transparent" &&
            isDarkApp

            ?

            "rgba(220,230,240,.15)"

            :

            "rgba(0,0,0,0.35)";

    }


    chart.options
        .plugins
        .customBackground
        .color =

        background;


    chart.options
        .plugins
        .legend
        .labels
        .color =

        text;


    ["x", "y"]
        .forEach(
            axisName => {

                const axis =

                    chart.options
                        .scales[
                            axisName
                        ];


                axis.title.color =
                    text;

                axis.ticks.color =
                    ticks;

                axis.grid.color =
                    grid;

            }
        );


    chart.update(
        "none"
    );

}


/* =========================================================
   CSV EXPORT
   ========================================================= */

function exportCSV() {

    try {

        const p =
            readParameters();


        const curve =
            generateCurve(p);


        let csv =

            "Equivalent_Plastic_Strain,Flow_Stress_GPa\n";


        curve.forEach(
            point => {

                csv +=

                    point.x.toFixed(8)

                    +

                    ","

                    +

                    point.y.toFixed(8)

                    +

                    "\n";

            }
        );


        downloadText(

            csv,

            "text/csv;charset=utf-8",

            "johnson_cook_curve.csv"

        );

    }

    catch (error) {

        alert(
            error.message
        );

    }

}


/* =========================================================
   PNG EXPORT
   ========================================================= */

async function exportPNG() {

    try {

        /*
         * Make sure the selected graph background
         * and axis appearance are applied.
         */
        updateChartAppearance();

        chart.update("none");


        /* -----------------------------------------
           FILE NAME
           ----------------------------------------- */

        let materialName =
            activeImportedName ||
            (
                preset.value !== "custom"
                    ? PRESETS[preset.value].name
                    : "Johnson_Cook"
            );


        materialName =
            materialName
                .replace(
                    /[^a-zA-Z0-9_-]+/g,
                    "_"
                )
                .replace(
                    /^_+|_+$/g,
                    ""
                );


        const fileName =
            `${materialName}_curve.png`;


        /* -----------------------------------------
           CHROME / EDGE:
           OPEN REAL SAVE-AS WINDOW FIRST
           ----------------------------------------- */

        let fileHandle = null;


        if (
            "showSaveFilePicker" in window
        ) {

            try {

                fileHandle =
                    await window.showSaveFilePicker({

                        suggestedName:
                            fileName,

                        types: [

                            {
                                description:
                                    "PNG Image",

                                accept: {

                                    "image/png": [
                                        ".png"
                                    ]

                                }

                            }

                        ]

                    });

            }

            catch (error) {

                /*
                 * User pressed Cancel.
                 * Do not report this as an application error.
                 */
                if (
                    error.name ===
                    "AbortError"
                ) {

                    return;

                }


                throw error;

            }

        }


        /* -----------------------------------------
           CONVERT CHART CANVAS TO PNG BLOB
           ----------------------------------------- */

        const blob =
            await new Promise(
                (
                    resolve,
                    reject
                ) => {

                    chart.canvas.toBlob(

                        result => {

                            if (
                                result
                            ) {

                                resolve(
                                    result
                                );

                            }

                            else {

                                reject(
                                    new Error(
                                        "Canvas could not be converted to PNG."
                                    )
                                );

                            }

                        },

                        "image/png",

                        1.0

                    );

                }
            );


        /* -----------------------------------------
           SAVE WITH FILE SYSTEM ACCESS API
           ----------------------------------------- */

        if (
            fileHandle
        ) {

            const writable =
                await fileHandle.createWritable();


            await writable.write(
                blob
            );


            await writable.close();


            console.log(
                "PNG saved:",
                fileName
            );


            return;

        }


        /* -----------------------------------------
           FALLBACK FOR OTHER BROWSERS
           ----------------------------------------- */

        const url =
            URL.createObjectURL(
                blob
            );


        const link =
            document.createElement(
                "a"
            );


        link.href =
            url;


        link.download =
            fileName;


        link.style.display =
            "none";


        document.body.appendChild(
            link
        );


        link.click();


        setTimeout(
            () => {

                URL.revokeObjectURL(
                    url
                );

                link.remove();

            },

            1000

        );

    }

    catch (error) {

        console.error(
            "PNG export error:",
            error
        );


        alert(
            "PNG export failed:\n\n" +
            error.message
        );

    }

}

/* =========================================================
   LS-DYNA NUMBER PARSER
   ========================================================= */

function dynaNumber(
    input
) {

    if (
        input === undefined ||
        input === null
    ) {

        return NaN;

    }


    let value =

        String(input)
            .trim()
            .replace(
                /D/gi,
                "E"
            );


    if (
        !value
    ) {

        return NaN;

    }


    /*
    Also supports compressed exponent style:
    1.234-5 -> 1.234E-5
    */

    if (
        !/[eE]/.test(value)
    ) {

        const match =

            value.match(

                /^([+-]?(?:\d+(?:\.\d*)?|\.\d+))([+-]\d+)$/

            );


        if (
            match
        ) {

            value =

                match[1] +

                "E" +

                match[2];

        }

    }


    return Number(
        value
    );

}


/* =========================================================
   FIXED-WIDTH CARD READER

   Standard LS-DYNA cards use 10-character fields.
   This is necessary for lines such as:

   2017.85000E-6 210.0 ...

   where whitespace splitting is not sufficient.
   ========================================================= */

function cardFields(
    rawLine
) {

    const line =

        rawLine
            .split("$")[0]
            .replace(/\r/g, "");


    if (
        !line.trim()
    ) {

        return [];

    }


    const fields =
        [];


    for (
        let i = 0;
        i < line.length;
        i += 10
    ) {

        fields.push(

            line
                .slice(
                    i,
                    i + 10
                )
                .trim()

        );

    }


    /*
    Fallback for free-format keyword cards.
    */

    const nonEmpty =

        fields
            .filter(Boolean);


    if (
        nonEmpty.length <= 1 &&
        line.trim().includes(" ")
    ) {

        return line
            .trim()
            .split(/[\s,]+/)
            .filter(Boolean);

    }


    return fields;

}


/* =========================================================
   KEYWORD BLOCK PARSER
   ========================================================= */

function parseKeywordFileText(
    text
) {

    const lines =
        text.split(
            /\r?\n/
        );


    const materials =
        [];


    for (
        let i = 0;
        i < lines.length;
        i++
    ) {

        const keyword =

            lines[i]
                .trim()
                .toUpperCase();


        const modified =

            keyword.startsWith(
                "*MAT_MODIFIED_JOHNSON_COOK"
            );


        const simplified =

            keyword.startsWith(
                "*MAT_SIMPLIFIED_JOHNSON_COOK"
            );


        if (
            !modified &&
            !simplified
        ) {

            continue;

        }


        const hasTitle =

            keyword.includes(
                "_TITLE"
            );


        let j =
            i + 1;


        while (
            j < lines.length &&
            (
                !lines[j].trim() ||
                lines[j]
                    .trim()
                    .startsWith("$")
            )
        ) {

            j++;

        }


        let title =
            "";


        if (
            hasTitle &&
            j < lines.length &&
            !lines[j]
                .trim()
                .startsWith("*")
        ) {

            title =
                lines[j]
                    .trim();

            j++;

        }


        const cards =
            [];


        while (
            j < lines.length
        ) {

            const line =

                lines[j]
                    .trim();


            if (
                line.startsWith("*")
            ) {

                break;

            }


            if (
                line &&
                !line.startsWith("$")
            ) {

                cards.push(

                    cardFields(
                        lines[j]
                    )

                );

            }


            j++;

        }


        if (
            modified
        ) {

            const mat =
                parseMAT107(
                    cards,
                    title
                );


            if (
                mat
            ) {

                materials.push(
                    mat
                );

            }

        }


        if (
            simplified
        ) {

            const mat =
                parseMAT098(
                    cards,
                    title
                );


            if (
                mat
            ) {

                materials.push(
                    mat
                );

            }

        }


        i =
            j - 1;

    }


    return materials;

}


/* =========================================================
   MAT 107 PARSER
   ========================================================= */

function parseMAT107(
    cards,
    title
) {

    if (
        cards.length < 4
    ) {

        return null;

    }


    const c1 =
        cards[0];

    const c2 =
        cards[1];

    const c3 =
        cards[2];

    const c4 =
        cards[3];

    const c5 =
        cards[4] || [];

    const c6 =
        cards[5] || [];


    const MID =
        c1[0];


    const FLAG1 =
        dynaNumber(
            c2[4]
        );


    const FLAG2 =
        dynaNumber(
            c2[5]
        );


    return {

        model:
            "modified",

        keyword:
            "MAT_107",

        title:

            title ||

            `MAT_107 MID ${MID}`,

        MID,

        E0DOT:
            dynaNumber(
                c2[0]
            ),

        Tr:
            dynaNumber(
                c2[1]
            ),

        Tm:
            dynaNumber(
                c2[2]
            ),

        T0:
            dynaNumber(
                c2[3]
            ),

        FLAG1,
        FLAG2,

        A:
            dynaNumber(
                c3[0]
            ),

        B:
            dynaNumber(
                c3[1]
            ),

        n:
            dynaNumber(
                c3[2]
            ),

        C:
            dynaNumber(
                c3[3]
            ),

        m:
            dynaNumber(
                c3[4]
            ),

        Q1:
            dynaNumber(
                c4[0]
            ) || 0,

        C1:
            dynaNumber(
                c4[1]
            ) || 0,

        Q2:
            dynaNumber(
                c4[2]
            ) || 0,

        C2:
            dynaNumber(
                c4[3]
            ) || 0,

        DC:
            dynaNumber(
                c5[0]
            ),

        WC:
            dynaNumber(
                c5[1]
            ),

        TC:
            dynaNumber(
                c6[0]
            ),

        TAUC:
            dynaNumber(
                c6[1]
            ),

        supported:

            FLAG1 === 0

    };

}


/* =========================================================
   MAT 098 PARSER
   ========================================================= */

function parseMAT098(
    cards,
    title
) {

    if (
        cards.length < 2
    ) {

        return null;

    }


    const c1 =
        cards[0];

    const c2 =
        cards[1];


    const MID =
        c1[0];


    return {

        model:
            "simplified",

        keyword:
            "MAT_098",

        title:

            title ||

            `MAT_098 MID ${MID}`,

        MID,

        VP:
            dynaNumber(
                c1[4]
            ),

        A:
            dynaNumber(
                c2[0]
            ),

        B:
            dynaNumber(
                c2[1]
            ),

        n:
            dynaNumber(
                c2[2]
            ),

        C:
            dynaNumber(
                c2[3]
            ),

        PSFAIL:
            dynaNumber(
                c2[4]
            ),

        SIGMAX:
            dynaNumber(
                c2[5]
            ),

        SIGSAT:
            dynaNumber(
                c2[6]
            ),

        EPS0:
            dynaNumber(
                c2[7]
            ),

        supported:
            true

    };

}


/* =========================================================
   UNIT CONVERSIONS
   ========================================================= */

function stressToGPa(
    value
) {

    if (
        !Number.isFinite(
            value
        )
    ) {

        return value;

    }


    switch (
        kStressUnit.value
    ) {

        case "MPa":

            return value *
                1e-3;


        case "Pa":

            return value *
                1e-9;


        default:

            return value;

    }

}


function rateToPerSecond(
    value
) {

    if (
        !Number.isFinite(
            value
        )
    ) {

        return value;

    }


    switch (
        kTimeUnit.value
    ) {

        case "ms":

            return value *
                1000;


        case "us":

            return value *
                1e6;


        default:

            return value;

    }

}


/* =========================================================
   LOAD IMPORTED MATERIAL
   ========================================================= */

function loadImportedMaterial(
    index
) {

    const mat =

        importedMaterials[
            index
        ];


    if (
        !mat
    ) {

        return;

    }


    if (
        !mat.supported
    ) {

        setStatus(

            `${mat.title}: FLAG1=${mat.FLAG1}. ` +

            "This card is not using the Modified Johnson-Cook relation.",

            "warning"

        );


        return;

    }


    preset.value =
        "custom";


    activeImportedName =
        mat.title;


    modelType.value =
        mat.model;


    setValue(
        A,
        stressToGPa(
            mat.A
        )
    );


    setValue(
        B,
        stressToGPa(
            mat.B
        )
    );


    setValue(
        n,
        mat.n
    );


    setValue(
        C,
        mat.C
    );


    if (
        mat.model ===
        "modified"
    ) {

        setValue(
            m,
            mat.m
        );


        setValue(
            Q1,
            stressToGPa(
                mat.Q1
            )
        );


        setValue(
            C1,
            mat.C1
        );


        setValue(
            Q2,
            stressToGPa(
                mat.Q2
            )
        );


        setValue(
            C2,
            mat.C2
        );


        const refRate =

            rateToPerSecond(
                mat.E0DOT
            );


        setValue(
            referenceStrainRate,
            refRate
        );


        setValue(
            strainRate,
            refRate
        );


        setValue(
            referenceTemperature,
            mat.Tr
        );


        setValue(
            meltingTemperature,
            mat.Tm
        );


        setValue(
            temperature,
            mat.Tr
        );


        setValue(
            maxPlasticStrain,
            1.5
        );

    }

    else {

        const refRate =

            rateToPerSecond(
                mat.EPS0
            );


        setValue(
            referenceStrainRate,
            refRate
        );


        setValue(
            strainRate,
            refRate
        );


        setValue(
            VP,
            mat.VP
        );


        setValue(
            PSFAIL,
            mat.PSFAIL
        );


        setValue(
            SIGMAX,
            stressToGPa(
                mat.SIGMAX
            )
        );


        setValue(
            SIGSAT,
            stressToGPa(
                mat.SIGSAT
            )
        );


        let maxPlot =
            1;


        if (
            mat.PSFAIL > 0 &&
            mat.PSFAIL < 5
        ) {

            maxPlot =

                Math.min(
                    mat.PSFAIL,
                    1.5
                );

        }


        setValue(
            maxPlasticStrain,
            maxPlot
        );

    }


    updateModelUI();

    updateCurve();


    setStatus(

        `${mat.title} loaded — ${mat.keyword}, MID=${mat.MID}`,

        "success"

    );

}


/* =========================================================
   FILE HANDLING
   ========================================================= */

async function handleFile(
    file
) {

    if (
        !file
    ) {

        return;

    }


    try {

        setStatus(
            `Reading ${file.name}...`
        );


        const text =
            await file.text();


        importedMaterials =

            parseKeywordFileText(
                text
            );


        if (
            importedMaterials.length ===
            0
        ) {

            detectedMaterials.innerHTML =

                "<option>No Johnson-Cook material found</option>";


            detectedMaterials.disabled =
                true;


            setStatus(

                "No MAT_107 or MAT_098 material card was detected.",

                "warning"

            );


            return;

        }


        detectedMaterials.innerHTML =
            "";


        importedMaterials.forEach(
            (
                material,
                index
            ) => {

                const option =

                    document.createElement(
                        "option"
                    );


                option.value =
                    index;


                option.textContent =

                    `${material.title} | ` +

                    `${material.keyword} | ` +

                    `MID=${material.MID}`;


                if (
                    !material.supported
                ) {

                    option.textContent +=

                        " | unsupported constitutive flag";

                }


                detectedMaterials
                    .appendChild(
                        option
                    );

            }
        );


        detectedMaterials.disabled =
            false;


        setStatus(

            `${importedMaterials.length} Johnson-Cook material card(s) detected in ${file.name}.`,

            "success"

        );


        loadImportedMaterial(
            0
        );

    }

    catch (error) {

        console.error(
            error
        );


        setStatus(

            "Could not parse keyword file: " +

            error.message,

            "error"

        );

    }

}


/* =========================================================
   STATUS
   ========================================================= */

function setStatus(
    message,
    type = ""
) {

    fileStatus.className =
        "status-box";


    if (
        type
    ) {

        fileStatus
            .classList
            .add(
                type
            );

    }


    fileStatus.textContent =
        message;

}


/* =========================================================
   DOWNLOAD
   ========================================================= */

function downloadText(
    content,
    mime,
    filename
) {

    const blob =

        new Blob(
            [content],
            {
                type:
                    mime
            }
        );


    const url =

        URL.createObjectURL(
            blob
        );


    const link =

        document.createElement(
            "a"
        );


    link.href =
        url;


    link.download =
        filename;


    link.click();


    setTimeout(
        () =>
            URL.revokeObjectURL(
                url
            ),
        500
    );

}


/* =========================================================
   FORMAT
   ========================================================= */

function scientific(
    value
) {

    if (
        Math.abs(value) >=
        0.01 &&
        Math.abs(value) <
        10000
    ) {

        return value.toString();

    }


    return value.toExponential(
        2
    );

}


/* =========================================================
   EVENTS
   ========================================================= */

$("updateButton")
    .addEventListener(
        "click",
        updateCurve
    );


$("addCurveButton")
    .addEventListener(
        "click",
        addComparison
    );


$("clearCurvesButton")
    .addEventListener(
        "click",
        clearComparisons
    );


$("exportCsvButton")
    .addEventListener(
        "click",
        exportCSV
    );


$("exportPngButton")
    .addEventListener(
        "click",
        exportPNG
    );


preset.addEventListener(
    "change",
    applyPreset
);


modelType.addEventListener(
    "change",
    () => {

        preset.value =
            "custom";


        activeImportedName =
            "";


        updateModelUI();

        updateCurve();

    }
);


chartBackground.addEventListener(
    "change",
    updateChartAppearance
);


appTheme.addEventListener(
    "change",
    () => {

        document.body
            .classList
            .toggle(

                "light-theme",

                appTheme.value ===
                "light"

            );


        updateChartAppearance();

    }
);


/* =========================================================
   FILE PICKER
   ========================================================= */

browseKButton.addEventListener(
    "click",
    event => {

        event.stopPropagation();

        kFileInput.click();

    }
);


dropZone.addEventListener(
    "click",
    () => {

        kFileInput.click();

    }
);


dropZone.addEventListener(
    "keydown",
    event => {

        if (
            event.key ===
            "Enter" ||
            event.key ===
            " "
        ) {

            event.preventDefault();

            kFileInput.click();

        }

    }
);


kFileInput.addEventListener(
    "change",
    () => {

        handleFile(
            kFileInput.files[0]
        );

    }
);


/* =========================================================
   DRAG DROP
   ========================================================= */

[
    "dragenter",
    "dragover"
]
.forEach(
    eventName => {

        dropZone
            .addEventListener(
                eventName,
                event => {

                    event.preventDefault();

                    dropZone
                        .classList
                        .add(
                            "drag-over"
                        );

                }
            );

    }
);


[
    "dragleave",
    "drop"
]
.forEach(
    eventName => {

        dropZone
            .addEventListener(
                eventName,
                event => {

                    event.preventDefault();

                    dropZone
                        .classList
                        .remove(
                            "drag-over"
                        );

                }
            );

    }
);


dropZone.addEventListener(
    "drop",
    event => {

        handleFile(

            event
                .dataTransfer
                .files[0]

        );

    }
);


/* =========================================================
   MATERIAL SELECT
   ========================================================= */

detectedMaterials
    .addEventListener(
        "change",
        () => {

            loadImportedMaterial(

                Number(
                    detectedMaterials.value
                )

            );

        }
    );


/* =========================================================
   UNIT CHANGE
   ========================================================= */

[
    kTimeUnit,
    kStressUnit
]
.forEach(
    selector => {

        selector
            .addEventListener(
                "change",
                () => {

                    if (
                        importedMaterials.length
                    ) {

                        loadImportedMaterial(

                            Number(
                                detectedMaterials.value
                            )

                        );

                    }

                }
            );

    }
);


/* =========================================================
   LIVE INPUT UPDATE
   ========================================================= */

const liveInputs = [

    A,
    B,
    n,
    C,

    m,

    Q1,
    C1,
    Q2,
    C2,

    VP,
    PSFAIL,
    SIGMAX,
    SIGSAT,

    referenceStrainRate,
    referenceTemperature,
    meltingTemperature,

    strainRate,
    temperature,

    maxPlasticStrain

];


liveInputs
    .filter(Boolean)
    .forEach(
        input => {

            input.addEventListener(
                "input",
                () => {

                    if (
                        input.value ===
                        ""
                    ) {

                        return;

                    }


                    preset.value =
                        "custom";


                    updateCurve();

                }
            );

        }
    );


/* =========================================================
   INITIALIZE
   ========================================================= */

updateModelUI();

preset.value =
    "weldox700";

applyPreset();

updateChartAppearance();
