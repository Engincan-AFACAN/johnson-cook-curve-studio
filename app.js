/* =========================================================
   JOHNSON-COOK CURVE STUDIO
   ========================================================= */

"use strict";


/* =========================================================
   MATERIAL PRESETS
   Units used in the application:
   Stress       -> GPa
   Strain rate  -> s^-1
   Temperature  -> K
   ========================================================= */

const materialPresets = {

    weldox700: {
        name: "Weldox 700E",
        model: "modified",

        A: 0.819,
        B: 0.308,
        n: 0.64,
        C: 0.0098,
        m: 1.0,

        referenceStrainRate: 5.0e-4,

        referenceTemperature: 293.0,
        meltingTemperature: 1800.0,

        strainRate: 5.0e-4,
        temperature: 293.0,

        maxPlasticStrain: 1.5
    },

    hardox400: {
        name: "Hardox 400",
        model: "modified",

        A: 1.350,
        B: 0.362,
        n: 1.0,
        C: 0.0108,
        m: 1.0,

        referenceStrainRate: 5.0e-4,

        referenceTemperature: 293.0,
        meltingTemperature: 1800.0,

        strainRate: 5.0e-4,
        temperature: 293.0,

        maxPlasticStrain: 1.5
    },

    apm2: {
        name: "APM2 Hardened Steel Core",
        model: "simplified",

        A: 1.20,
        B: 50.0,
        n: 1.0,
        C: 0.0,

        /*
        EPS0 = 1.0 / ms in the LS-DYNA material card.

        1 / ms = 1000 / s
        */

        referenceStrainRate: 1000.0,

        strainRate: 1000.0,

        maxPlasticStrain: 0.15
    }

};


/* =========================================================
   DOM ELEMENTS
   ========================================================= */

const modelType =
    document.getElementById("modelType");

const preset =
    document.getElementById("preset");


const inputA =
    document.getElementById("A");

const inputB =
    document.getElementById("B");

const inputN =
    document.getElementById("n");

const inputC =
    document.getElementById("C");

const inputM =
    document.getElementById("m");


const referenceStrainRate =
    document.getElementById("referenceStrainRate");

const referenceTemperature =
    document.getElementById("referenceTemperature");

const meltingTemperature =
    document.getElementById("meltingTemperature");


const strainRate =
    document.getElementById("strainRate");

const temperature =
    document.getElementById("temperature");

const maxPlasticStrain =
    document.getElementById("maxPlasticStrain");


const updateButton =
    document.getElementById("updateButton");

const addCurveButton =
    document.getElementById("addCurveButton");

const clearCurvesButton =
    document.getElementById("clearCurvesButton");

const exportCsvButton =
    document.getElementById("exportCsvButton");


const equationBox =
    document.getElementById("equationBox");


const stressAtZero =
    document.getElementById("stressAtZero");

const stressAt01 =
    document.getElementById("stressAt01");

const strainRateMultiplierDisplay =
    document.getElementById("strainRateMultiplier");

const thermalMultiplierDisplay =
    document.getElementById("thermalMultiplier");


/* =========================================================
   CHART COLORS
   ========================================================= */

const curveColors = [

    "#4aa3ff",
    "#ff785a",
    "#65d38e",
    "#d695ff",
    "#f4c95d",
    "#58d3d8",
    "#ff70ad"

];

let colorIndex = 1;


/* =========================================================
   CHART INITIALIZATION
   ========================================================= */

const chartContext =
    document
        .getElementById("jcChart")
        .getContext("2d");


const jcChart =
    new Chart(
        chartContext,
        {

            type: "line",

            data: {

                datasets: []

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                animation: false,

                interaction: {

                    mode: "nearest",

                    intersect: false

                },

                parsing: false,

                normalized: true,

                plugins: {

                    legend: {

                        display: true,

                        labels: {

                            color: "#d7e3ef",

                            usePointStyle: true,

                            boxWidth: 10

                        }

                    },

                    tooltip: {

                        callbacks: {

                            title: function (items) {

                                if (!items.length) {
                                    return "";
                                }

                                return (
                                    "Equivalent Plastic Strain: " +
                                    items[0].parsed.x.toFixed(5)
                                );

                            },

                            label: function (context) {

                                return (
                                    context.dataset.label +
                                    ": " +
                                    context.parsed.y.toFixed(5) +
                                    " GPa"
                                );

                            }

                        }

                    }

                },

                scales: {

                    x: {

                        type: "linear",

                        title: {

                            display: true,

                            text:
                                "Equivalent Plastic Strain, εp",

                            color:
                                "#d7e3ef"

                        },

                        ticks: {

                            color:
                                "#9aa8b7"

                        },

                        grid: {

                            color:
                                "rgba(154,168,183,0.12)"

                        }

                    },

                    y: {

                        beginAtZero: true,

                        title: {

                            display: true,

                            text:
                                "Flow Stress, σy [GPa]",

                            color:
                                "#d7e3ef"

                        },

                        ticks: {

                            color:
                                "#9aa8b7"

                        },

                        grid: {

                            color:
                                "rgba(154,168,183,0.12)"

                        }

                    }

                }

            }

        }

    );


/* =========================================================
   INPUT READER
   ========================================================= */

function readNumber(element, name) {

    const value =
        Number(element.value);

    if (!Number.isFinite(value)) {

        throw new Error(
            `${name} must be a valid number.`
        );

    }

    return value;

}


function getCurrentParameters() {

    const parameters = {

        model:
            modelType.value,

        A:
            readNumber(inputA, "A"),

        B:
            readNumber(inputB, "B"),

        n:
            readNumber(inputN, "n"),

        C:
            readNumber(inputC, "C"),

        referenceStrainRate:
            readNumber(
                referenceStrainRate,
                "Reference strain rate"
            ),

        strainRate:
            readNumber(
                strainRate,
                "Strain rate"
            ),

        maxPlasticStrain:
            readNumber(
                maxPlasticStrain,
                "Maximum plastic strain"
            )

    };


    if (
        parameters.referenceStrainRate <= 0
    ) {

        throw new Error(
            "Reference strain rate must be greater than zero."
        );

    }


    if (
        parameters.strainRate <= 0
    ) {

        throw new Error(
            "Strain rate must be greater than zero."
        );

    }


    if (
        parameters.maxPlasticStrain <= 0
    ) {

        throw new Error(
            "Maximum plastic strain must be greater than zero."
        );

    }


    if (parameters.n < 0) {

        throw new Error(
            "Strain hardening exponent n cannot be negative."
        );

    }


    if (
        parameters.model === "modified"
    ) {

        parameters.m =
            readNumber(
                inputM,
                "m"
            );

        parameters.referenceTemperature =
            readNumber(
                referenceTemperature,
                "Reference temperature"
            );

        parameters.meltingTemperature =
            readNumber(
                meltingTemperature,
                "Melting temperature"
            );

        parameters.temperature =
            readNumber(
                temperature,
                "Temperature"
            );


        if (
            parameters.meltingTemperature <=
            parameters.referenceTemperature
        ) {

            throw new Error(
                "Melting temperature must be greater than reference temperature."
            );

        }


        if (parameters.m < 0) {

            throw new Error(
                "Thermal softening exponent m cannot be negative."
            );

        }

    }


    return parameters;

}


/* =========================================================
   JOHNSON-COOK MODEL COMPONENTS
   ========================================================= */


/*
Strain hardening:

A + B * eps_p^n
*/

function calculateHardening(
    plasticStrain,
    parameters
) {

    return (

        parameters.A +

        parameters.B *

        Math.pow(
            plasticStrain,
            parameters.n
        )

    );

}


/*
Strain-rate multiplier:

1 + C ln(epsDot / epsDot0)
*/

function calculateStrainRateMultiplier(
    parameters
) {

    const ratio =

        parameters.strainRate /

        parameters.referenceStrainRate;


    return (

        1 +

        parameters.C *

        Math.log(ratio)

    );

}


/*
Normalized homologous temperature:

T* = (T - Tr) / (Tm - Tr)

T* is limited to the interval [0, 1].
*/

function calculateNormalizedTemperature(
    parameters
) {

    let normalizedTemperature =

        (
            parameters.temperature -

            parameters.referenceTemperature
        )

        /

        (
            parameters.meltingTemperature -

            parameters.referenceTemperature
        );


    normalizedTemperature =

        Math.max(
            0,
            Math.min(
                1,
                normalizedTemperature
            )
        );


    return normalizedTemperature;

}


/*
Thermal softening multiplier:

1 - (T*)^m
*/

function calculateThermalMultiplier(
    parameters
) {

    if (
        parameters.model ===
        "simplified"
    ) {

        return 1.0;

    }


    const normalizedTemperature =

        calculateNormalizedTemperature(
            parameters
        );


    return (

        1 -

        Math.pow(
            normalizedTemperature,
            parameters.m
        )

    );

}


/* =========================================================
   FLOW STRESS
   ========================================================= */

function calculateFlowStress(
    plasticStrain,
    parameters
) {

    const hardening =
        calculateHardening(
            plasticStrain,
            parameters
        );


    const strainRateMultiplier =
        calculateStrainRateMultiplier(
            parameters
        );


    const thermalMultiplier =
        calculateThermalMultiplier(
            parameters
        );


    let flowStress =

        hardening *

        strainRateMultiplier *

        thermalMultiplier;


    /*
    Negative flow stress is not physically meaningful
    in the present visualization.
    */

    flowStress =
        Math.max(
            0,
            flowStress
        );


    return flowStress;

}


/* =========================================================
   GENERATE CURVE
   ========================================================= */

function generateCurve(
    parameters
) {

    const numberOfPoints =
        400;


    const curve = [];


    for (
        let i = 0;
        i <= numberOfPoints;
        i++
    ) {

        const plasticStrain =

            (
                parameters.maxPlasticStrain *

                i

            )

            /

            numberOfPoints;


        const flowStress =

            calculateFlowStress(
                plasticStrain,
                parameters
            );


        curve.push({

            x:
                plasticStrain,

            y:
                flowStress

        });

    }


    return curve;

}


/* =========================================================
   CURVE LABEL
   ========================================================= */

function getCurveName(
    parameters
) {

    let materialName =
        "Custom Material";


    if (
        preset.value !== "custom" &&
        materialPresets[preset.value]
    ) {

        materialName =
            materialPresets[preset.value].name;

    }


    let label =

        `${materialName} | ` +

        `ε̇ = ` +

        `${formatScientific(parameters.strainRate)} s⁻¹`;


    if (
        parameters.model === "modified"
    ) {

        label +=

            ` | T = ${parameters.temperature} K`;

    }


    return label;

}


/* =========================================================
   CURRENT CURVE
   ========================================================= */

function updateCurrentCurve() {

    try {

        const parameters =
            getCurrentParameters();


        const curve =
            generateCurve(parameters);


        const dataset = {

            label:
                getCurveName(parameters),

            data:
                curve,

            borderColor:
                curveColors[0],

            backgroundColor:
                curveColors[0],

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
            jcChart.data.datasets.length === 0
        ) {

            jcChart.data.datasets.push(
                dataset
            );

        } else {

            jcChart.data.datasets[0] =
                dataset;

        }


        jcChart.update();


        updateResultCards(
            parameters
        );


        updateEquationDisplay(
            parameters.model
        );

    }

    catch (error) {

        alert(error.message);

    }

}


/* =========================================================
   ADD COMPARISON CURVE
   ========================================================= */

function addCurve() {

    try {

        const parameters =
            getCurrentParameters();


        const curve =
            generateCurve(parameters);


        const selectedColor =

            curveColors[
                colorIndex %
                curveColors.length
            ];


        colorIndex++;


        jcChart.data.datasets.push({

            label:
                getCurveName(parameters),

            data:
                curve,

            borderColor:
                selectedColor,

            backgroundColor:
                selectedColor,

            borderWidth:
                2.5,

            pointRadius:
                0,

            pointHoverRadius:
                4,

            tension:
                0

        });


        jcChart.update();

    }

    catch (error) {

        alert(error.message);

    }

}


/* =========================================================
   CLEAR COMPARISON CURVES
   ========================================================= */

function clearCurves() {

    if (
        jcChart.data.datasets.length > 0
    ) {

        jcChart.data.datasets = [

            jcChart.data.datasets[0]

        ];

    }


    colorIndex = 1;


    jcChart.update();

}


/* =========================================================
   RESULT CARDS
   ========================================================= */

function updateResultCards(
    parameters
) {

    const stressZero =

        calculateFlowStress(
            0,
            parameters
        );


    const stress01 =

        calculateFlowStress(
            0.10,
            parameters
        );


    const rateMultiplier =

        calculateStrainRateMultiplier(
            parameters
        );


    const thermalMultiplier =

        calculateThermalMultiplier(
            parameters
        );


    stressAtZero.textContent =

        stressZero.toFixed(4) +
        " GPa";


    stressAt01.textContent =

        stress01.toFixed(4) +
        " GPa";


    strainRateMultiplierDisplay.textContent =

        rateMultiplier.toFixed(5);


    thermalMultiplierDisplay.textContent =

        thermalMultiplier.toFixed(5);

}


/* =========================================================
   EQUATION DISPLAY
   ========================================================= */

function updateEquationDisplay(
    model
) {

    if (
        model === "modified"
    ) {

        equationBox.innerHTML =

            "σ<sub>y</sub> = " +

            "[A + B(ε<sub>p</sub>)<sup>n</sup>] " +

            "[1 + C ln(ε̇ / ε̇<sub>0</sub>)] " +

            "[1 − (T*)<sup>m</sup>]";


    } else {

        equationBox.innerHTML =

            "σ<sub>y</sub> = " +

            "[A + B(ε<sub>p</sub>)<sup>n</sup>] " +

            "[1 + C ln(ε̇ / ε̇<sub>0</sub>)]";

    }

}


/* =========================================================
   MODEL INTERFACE
   ========================================================= */

function updateModelInterface() {

    const modifiedElements =

        document.querySelectorAll(
            ".modified-only"
        );


    modifiedElements.forEach(
        element => {

            if (
                modelType.value ===
                "modified"
            ) {

                element.classList.remove(
                    "hidden"
                );

            } else {

                element.classList.add(
                    "hidden"
                );

            }

        }
    );


    updateEquationDisplay(
        modelType.value
    );

}


/* =========================================================
   APPLY MATERIAL PRESET
   ========================================================= */

function applyPreset() {

    const selectedPreset =
        preset.value;


    if (
        selectedPreset ===
        "custom"
    ) {

        return;

    }


    const material =
        materialPresets[
            selectedPreset
        ];


    modelType.value =
        material.model;


    inputA.value =
        material.A;

    inputB.value =
        material.B;

    inputN.value =
        material.n;

    inputC.value =
        material.C;


    referenceStrainRate.value =
        material.referenceStrainRate;


    strainRate.value =
        material.strainRate;


    maxPlasticStrain.value =
        material.maxPlasticStrain;


    if (
        material.model ===
        "modified"
    ) {

        inputM.value =
            material.m;

        referenceTemperature.value =
            material.referenceTemperature;

        meltingTemperature.value =
            material.meltingTemperature;

        temperature.value =
            material.temperature;

    }


    updateModelInterface();


    updateCurrentCurve();

}


/* =========================================================
   CSV EXPORT
   ========================================================= */

function exportCsv() {

    try {

        const parameters =
            getCurrentParameters();


        const curve =
            generateCurve(
                parameters
            );


        let csv =

            "Equivalent_Plastic_Strain," +

            "Flow_Stress_GPa\n";


        curve.forEach(
            point => {

                csv +=

                    `${point.x.toFixed(8)},` +

                    `${point.y.toFixed(8)}\n`;

            }
        );


        const blob =

            new Blob(

                [csv],

                {
                    type:
                        "text/csv;charset=utf-8;"
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

            "johnson_cook_curve.csv";


        document.body.appendChild(
            link
        );


        link.click();


        document.body.removeChild(
            link
        );


        URL.revokeObjectURL(
            url
        );

    }

    catch (error) {

        alert(error.message);

    }

}


/* =========================================================
   SCIENTIFIC NUMBER FORMAT
   ========================================================= */

function formatScientific(
    value
) {

    if (
        Math.abs(value) >= 0.01 &&
        Math.abs(value) < 10000
    ) {

        return value.toString();

    }


    return value.toExponential(2);

}


/* =========================================================
   EVENT LISTENERS
   ========================================================= */

modelType.addEventListener(
    "change",
    () => {

        preset.value =
            "custom";

        updateModelInterface();

        updateCurrentCurve();

    }
);


preset.addEventListener(
    "change",
    applyPreset
);


updateButton.addEventListener(
    "click",
    updateCurrentCurve
);


addCurveButton.addEventListener(
    "click",
    addCurve
);


clearCurvesButton.addEventListener(
    "click",
    clearCurves
);


exportCsvButton.addEventListener(
    "click",
    exportCsv
);


/*
Live updates when a numerical parameter changes.
*/

const numericalInputs = [

    inputA,
    inputB,
    inputN,
    inputC,
    inputM,

    referenceStrainRate,
    referenceTemperature,
    meltingTemperature,

    strainRate,
    temperature,

    maxPlasticStrain

];


numericalInputs.forEach(
    input => {

        input.addEventListener(
            "input",
            () => {

                preset.value =
                    "custom";


                /*
                Avoid alerting while the user
                temporarily clears an input.
                */

                if (
                    input.value.trim() === ""
                ) {

                    return;

                }


                try {

                    updateCurrentCurve();

                }

                catch (_) {

                    /*
                    Input validation will be
                    shown when Update Curve is
                    explicitly pressed.
                    */

                }

            }
        );

    }
);


/* =========================================================
   INITIAL STATE
   ========================================================= */

updateModelInterface();

applyPreset();
