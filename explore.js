import * as THREE from "./libs/three.module.js";
import { OrbitControls } from "./libs/addons/controls/OrbitControls.js";

/* =========================================================
   COSMIC EXPLORER
   Main Solar System + Rotating Planet Hologram
   ========================================================= */

/* =========================================================
   DOM
   ========================================================= */

const canvasContainer = document.getElementById("canvas-container");
const previewContainer = document.getElementById("planet-preview-container");
const previewName = document.getElementById("previewPlanetName");

if (!canvasContainer) {
    throw new Error("Missing #canvas-container");
}

if (!previewContainer) {
    throw new Error("Missing #planet-preview-container");
}

/* =========================================================
   MAIN SCENE
   ========================================================= */

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x01040a);

const camera = new THREE.PerspectiveCamera(
    60,
    Math.max(canvasContainer.clientWidth, 1) /
        Math.max(canvasContainer.clientHeight, 1),
    0.1,
    5000
);

camera.position.set(0, 100, 300);

/* =========================================================
   MAIN RENDERER
   ========================================================= */

const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);

renderer.setSize(
    Math.max(canvasContainer.clientWidth, 1),
    Math.max(canvasContainer.clientHeight, 1)
);

if ("outputColorSpace" in renderer) {
    renderer.outputColorSpace = THREE.SRGBColorSpace;
}

canvasContainer.appendChild(
    renderer.domElement
);

/* =========================================================
   MAIN CAMERA CONTROLS
   ========================================================= */

const controls = new OrbitControls(
    camera,
    renderer.domElement
);

controls.enableDamping = true;
controls.dampingFactor = 0.05;

controls.minDistance = 20;
controls.maxDistance = 1500;

/* =========================================================
   LIGHTING
   ========================================================= */

scene.add(
    new THREE.AmbientLight(
        0xffffff,
        0.45
    )
);

const sunLight = new THREE.PointLight(
    0xffffff,
    3,
    2500
);

sunLight.position.set(
    0,
    0,
    0
);

scene.add(
    sunLight
);

/* =========================================================
   STARS
   ========================================================= */

function createStars() {

    const geometry =
        new THREE.BufferGeometry();

    const count = 5000;

    const positions =
        new Float32Array(
            count * 3
        );

    for (let i = 0; i < count; i++) {

        const i3 = i * 3;

        positions[i3] =
            (Math.random() - 0.5) *
            4000;

        positions[i3 + 1] =
            (Math.random() - 0.5) *
            4000;

        positions[i3 + 2] =
            (Math.random() - 0.5) *
            4000;
    }

    geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(
            positions,
            3
        )
    );

    const material =
        new THREE.PointsMaterial({
            color: 0x8feaff,
            size: 1.4,
            sizeAttenuation: true
        });

    const starsObject =
        new THREE.Points(
            geometry,
            material
        );

    scene.add(
        starsObject
    );

    return starsObject;
}

const stars = createStars();

/* =========================================================
   TEXTURES
   ========================================================= */

const loader =
    new THREE.TextureLoader();

const textures = {

    sun:
        loader.load(
            "./textures/sun.jfif"
        ),

    mercury:
        loader.load(
            "./textures/mercury.jfif"
        ),

    venus:
        loader.load(
            "./textures/venus.jfif"
        ),

    earth:
        loader.load(
            "./textures/earth.jpg"
        ),

    mars:
        loader.load(
            "./textures/mars.jfif"
        ),

    jupiter:
        loader.load(
            "./textures/jupiter.jfif"
        ),

    saturn:
        loader.load(
            "./textures/saturn.jfif"
        ),

    uranus:
        loader.load(
            "./textures/uranus.jfif"
        ),

    neptune:
        loader.load(
            "./textures/neptune.jfif"
        ),

    ring:
        loader.load(
            "./textures/saturn_ring.png"
        )
};

/* =========================================================
   SUN
   Sun is NOT part of the selectable PLANETS list.
   ========================================================= */

const sun =
    new THREE.Mesh(

        new THREE.SphereGeometry(
            18,
            64,
            64
        ),

        new THREE.MeshBasicMaterial({
            map: textures.sun
        })
    );

scene.add(
    sun
);

/* =========================================================
   PLANET DATA
   Sun intentionally excluded from this array.
   ========================================================= */

const PLANETS = [

    {
        name: "Mercury",

        radius: 3,

        distance: 35,

        speed: 0.04,

        texture: textures.mercury,

        description:
            "Mercury is the smallest planet and the closest planet to the Sun. It has a rocky surface and experiences very large temperature changes."
    },

    {
        name: "Venus",

        radius: 5,

        distance: 55,

        speed: 0.025,

        texture: textures.venus,

        description:
            "Venus is the second planet from the Sun. It has a thick atmosphere dominated by carbon dioxide and is the hottest planet in the Solar System."
    },

    {
        name: "Earth",

        radius: 5.5,

        distance: 75,

        speed: 0.02,

        texture: textures.earth,

        description:
            "Earth is the third planet from the Sun and the only known planet to support life. Its surface contains liquid water and a protective atmosphere."
    },

    {
        name: "Mars",

        radius: 4,

        distance: 100,

        speed: 0.016,

        texture: textures.mars,

        description:
            "Mars is the fourth planet from the Sun. It is a cold, rocky world known for its reddish appearance and evidence of ancient water activity."
    },

    {
        name: "Jupiter",

        radius: 12,

        distance: 145,

        speed: 0.009,

        texture: textures.jupiter,

        description:
            "Jupiter is the largest planet in the Solar System. It is a gas giant with powerful storms, including the famous Great Red Spot."
    },

    {
        name: "Saturn",

        radius: 10,

        distance: 195,

        speed: 0.007,

        texture: textures.saturn,

        description:
            "Saturn is the sixth planet from the Sun and is famous for its spectacular ring system. It is a gas giant composed mainly of hydrogen and helium."
    },

    {
        name: "Uranus",

        radius: 7,

        distance: 240,

        speed: 0.005,

        texture: textures.uranus,

        description:
            "Uranus is an ice giant with a blue-green appearance caused by methane in its atmosphere. Its extreme axial tilt gives it unusual seasons."
    },

    {
        name: "Neptune",

        radius: 7,

        distance: 285,

        speed: 0.004,

        texture: textures.neptune,

        description:
            "Neptune is the eighth and most distant major planet from the Sun. It is an ice giant with a deep blue atmosphere and extremely fast winds."
    }

];

/* =========================================================
   SOLAR SYSTEM
   ========================================================= */

const solar = [];

/* =========================================================
   CREATE ORBIT
   ========================================================= */

function createOrbit(radius) {

    const points = [];

    const segments = 128;

    for (
        let i = 0;
        i <= segments;
        i++
    ) {

        const angle =
            (i / segments) *
            Math.PI *
            2;

        points.push(
            new THREE.Vector3(
                Math.cos(angle) *
                    radius,

                0,

                Math.sin(angle) *
                    radius
            )
        );
    }

    const geometry =
        new THREE.BufferGeometry()
            .setFromPoints(
                points
            );

    const material =
        new THREE.LineBasicMaterial({
            color: 0x075d70,
            transparent: true,
            opacity: 0.45
        });

    const orbit =
        new THREE.Line(
            geometry,
            material
        );

    scene.add(
        orbit
    );

    return orbit;
}

/* =========================================================
   CREATE PLANET
   ========================================================= */

function createPlanet(
    planetInfo
) {

    const geometry =
        new THREE.SphereGeometry(
            planetInfo.radius,
            48,
            48
        );

    const material =
        new THREE.MeshStandardMaterial({
            map: planetInfo.texture,
            roughness: 0.8,
            metalness: 0.05
        });

    const mesh =
        new THREE.Mesh(
            geometry,
            material
        );

    mesh.position.set(
        planetInfo.distance,
        0,
        0
    );

    mesh.userData = {
        ...planetInfo
    };

    scene.add(
        mesh
    );

    createOrbit(
        planetInfo.distance
    );

    /* =====================================================
       SATURN RINGS
       ===================================================== */

    if (
        planetInfo.name ===
        "Saturn"
    ) {

        const ringGeometry =
            new THREE.RingGeometry(
                planetInfo.radius *
                    1.25,

                planetInfo.radius *
                    2,

                96
            );

        const ringMaterial =
            new THREE.MeshBasicMaterial({
                map: textures.ring,
                transparent: true,
                side: THREE.DoubleSide,
                opacity: 0.9
            });

        const ring =
            new THREE.Mesh(
                ringGeometry,
                ringMaterial
            );

        ring.rotation.x =
            Math.PI / 2.6;

        ring.userData.parentPlanet =
            mesh;

        mesh.add(
            ring
        );

        mesh.userData.ring =
            ring;
    }

    solar.push({

        mesh,

        info: planetInfo,

        angle:
            Math.random() *
            Math.PI *
            2
    });
}

/* =========================================================
   CREATE ALL PLANETS
   ========================================================= */

PLANETS.forEach(
    createPlanet
);

/* =========================================================
   PLANET HOLOGRAM PREVIEW
   ========================================================= */

const previewScene =
    new THREE.Scene();

previewScene.background =
    new THREE.Color(
        0x020914
    );

const previewWidth =
    Math.max(
        previewContainer.clientWidth,
        1
    );

const previewHeight =
    Math.max(
        previewContainer.clientHeight,
        1
    );

const previewCamera =
    new THREE.PerspectiveCamera(
        38,

        previewWidth /
            previewHeight,

        0.1,

        100
    );

previewCamera.position.set(
    0,
    0,
    5.2
);

/* =========================================================
   PREVIEW RENDERER
   ========================================================= */

const previewRenderer =
    new THREE.WebGLRenderer({

        antialias: true,

        alpha: true
    });

previewRenderer.setPixelRatio(
    Math.min(
        window.devicePixelRatio,
        2
    )
);

previewRenderer.setSize(
    previewWidth,
    previewHeight
);

if (
    "outputColorSpace" in
    previewRenderer
) {

    previewRenderer.outputColorSpace =
        THREE.SRGBColorSpace;
}

previewContainer.appendChild(
    previewRenderer.domElement
);

/* =========================================================
   PREVIEW LIGHTING
   ========================================================= */

previewScene.add(
    new THREE.AmbientLight(
        0xb8eaff,
        1.25
    )
);

const previewKeyLight =
    new THREE.DirectionalLight(
        0xffffff,
        2.2
    );

previewKeyLight.position.set(
    -3,
    2,
    4
);

previewScene.add(
    previewKeyLight
);

const previewRimLight =
    new THREE.PointLight(
        0x00cfff,
        8,
        20
    );

previewRimLight.position.set(
    3,
    -1,
    2
);

previewScene.add(
    previewRimLight
);

/* =========================================================
   PREVIEW PLANET
   ========================================================= */

const previewPlanetMaterial =
    new THREE.MeshStandardMaterial({

        map: textures.sun,

        roughness: 0.8,

        metalness: 0.02
    });

const previewPlanet =
    new THREE.Mesh(

        new THREE.SphereGeometry(
            1.45,
            64,
            64
        ),

        previewPlanetMaterial
    );

previewScene.add(
    previewPlanet
);

/* =========================================================
   PREVIEW SATURN RING
   ========================================================= */

const previewSaturnRing =
    new THREE.Mesh(

        new THREE.RingGeometry(
            1.75,
            2.35,
            96
        ),

        new THREE.MeshBasicMaterial({

            map: textures.ring,

            transparent: true,

            side: THREE.DoubleSide,

            opacity: 0.9
        })
    );

previewSaturnRing.rotation.x =
    Math.PI / 2.6;

previewSaturnRing.visible =
    false;

previewPlanet.add(
    previewSaturnRing
);

/* =========================================================
   HOLOGRAM ZOOM
   ========================================================= */

let previewZoom = 5.2;

const PREVIEW_MIN_ZOOM =
    2.8;

const PREVIEW_MAX_ZOOM =
    8.5;

function updatePreviewZoom() {

    previewCamera.position.z =
        previewZoom;
}

const zoomInButton =
    document.getElementById(
        "previewZoomIn"
    );

const zoomOutButton =
    document.getElementById(
        "previewZoomOut"
    );

if (zoomInButton) {

    zoomInButton.addEventListener(
        "click",
        () => {

            previewZoom =
                Math.max(
                    PREVIEW_MIN_ZOOM,
                    previewZoom -
                        0.45
                );

            updatePreviewZoom();
        }
    );
}

if (zoomOutButton) {

    zoomOutButton.addEventListener(
        "click",
        () => {

            previewZoom =
                Math.min(
                    PREVIEW_MAX_ZOOM,
                    previewZoom +
                        0.45
                );

            updatePreviewZoom();
        }
    );
}

/* =========================================================
   MOUSE WHEEL ZOOM
   ========================================================= */

previewContainer.addEventListener(
    "wheel",
    event => {

        event.preventDefault();

        previewZoom +=
            event.deltaY > 0
                ? 0.35
                : -0.35;

        previewZoom =
            Math.max(
                PREVIEW_MIN_ZOOM,

                Math.min(
                    PREVIEW_MAX_ZOOM,
                    previewZoom
                )
            );

        updatePreviewZoom();
    },

    {
        passive: false
    }
);

/* =========================================================
   UPDATE HOLOGRAM
   ========================================================= */

function updatePlanetPreview(
    planet
) {

    if (!planet) {
        return;
    }

    if (planet.texture) {

        previewPlanetMaterial.map =
            planet.texture;

        previewPlanetMaterial.needsUpdate =
            true;
    }

    previewSaturnRing.visible =
        planet.name === "Saturn";

    if (previewName) {

        previewName.textContent =
            planet.name.toUpperCase();
    }
}

/* =========================================================
   START HOLOGRAM WITH SUN
   ========================================================= */

updatePlanetPreview({

    name: "Sun",

    texture: textures.sun
});

/* =========================================================
   PLANET SELECTION
   ========================================================= */

let selectedPlanet = null;

let glowTimeout = null;

function findPlanetFromObject(
    object
) {

    if (!object) {
        return null;
    }

    if (
        object.userData &&
        object.userData.name
    ) {

        return object;
    }

    if (
        object.userData &&
        object.userData.parentPlanet
    ) {

        return object.userData.parentPlanet;
    }

    if (
        object.parent &&
        object.parent.userData &&
        object.parent.userData.name
    ) {

        return object.parent;
    }

    return null;
}

/* =========================================================
   SELECT PLANET
   ========================================================= */

function selectPlanet(
    mesh
) {

    const planetMesh =
        findPlanetFromObject(
            mesh
        );

    if (!planetMesh) {
        return;
    }

    if (glowTimeout) {

        clearTimeout(
            glowTimeout
        );

        glowTimeout = null;
    }

    /* Remove old glow */

    if (
        selectedPlanet &&
        selectedPlanet.material
    ) {

        if (
            selectedPlanet.material
                .emissive
        ) {

            selectedPlanet.material.emissive.setHex(
                0x000000
            );
        }

        selectedPlanet.material.emissiveIntensity =
            0;
    }

    selectedPlanet =
        planetMesh;

    /* New glow */

    if (
        selectedPlanet.material &&
        selectedPlanet.material.emissive
    ) {

        selectedPlanet.material.emissive.setHex(
            0x00d9ff
        );

        selectedPlanet.material.emissiveIntensity =
            0.8;
    }

    updateDatabase(
        selectedPlanet.userData
    );

    updatePlanetPreview(
        selectedPlanet.userData
    );

    controls.target.copy(
        selectedPlanet.position
    );

    glowTimeout =
        setTimeout(
            () => {

                if (
                    selectedPlanet ===
                    planetMesh
                ) {

                    if (
                        planetMesh.material &&
                        planetMesh.material
                            .emissive
                    ) {

                        planetMesh.material
                            .emissive
                            .setHex(
                                0x000000
                            );

                        planetMesh.material
                            .emissiveIntensity =
                            0;
                    }
                }

            },

            3000
        );
}

/* =========================================================
   DATABASE
   ========================================================= */

function updateDatabase(
    planet
) {

    const planetInfo =
        document.getElementById(
            "planetInfo"
        );

    if (
        !planetInfo ||
        !planet
    ) {

        return;
    }

    const description =
        planet.description ||
        "No database description available.";

    planetInfo.innerHTML = `

        <div class="databasePlanetHeader">

            <span
                class="databaseStatusDot">
            </span>

            <h2>
                ${planet.name.toUpperCase()}
            </h2>

        </div>

        <div class="databaseDescription">

            <span class="databaseLabel">
                DESCRIPTION
            </span>

            <p>
                ${description}
            </p>

        </div>

        <div class="databaseStats">

            <div class="databaseStat">

                <span>
                    DISTANCE
                </span>

                <strong>
                    ${planet.distance}
                </strong>

            </div>

            <div class="databaseStat">

                <span>
                    ORBITAL SPEED
                </span>

                <strong>
                    ${planet.speed}
                </strong>

            </div>

            <div class="databaseStat">

                <span>
                    STATUS
                </span>

                <strong>
                    ONLINE
                </strong>

            </div>

            <div class="databaseStat">

                <span>
                    TARGET
                </span>

                <strong>
                    LOCKED
                </strong>

            </div>

        </div>

    `;
}

/* =========================================================
   MAIN PLANET CLICK DETECTION
   ========================================================= */

const raycaster =
    new THREE.Raycaster();

const mouse =
    new THREE.Vector2();

renderer.domElement.addEventListener(
    "click",
    event => {

        const rect =
            renderer.domElement
                .getBoundingClientRect();

        mouse.x =
            (
                (event.clientX -
                    rect.left) /
                rect.width
            ) *
            2 -
            1;

        mouse.y =
            -(
                (
                    event.clientY -
                    rect.top
                ) /
                rect.height
            ) *
            2 +
            1;

        raycaster.setFromCamera(
            mouse,
            camera
        );

        const meshes =
            solar.map(
                planet =>
                    planet.mesh
            );

        const intersections =
            raycaster.intersectObjects(
                meshes,
                true
            );

        if (
            intersections.length >
            0
        ) {

            selectPlanet(
                intersections[0]
                    .object
            );
        }
    }
);

/* =========================================================
   PLANET SELECTOR
   ========================================================= */

const planetsBtn =
    document.getElementById(
        "planetsBtn"
    );

const planetSelector =
    document.getElementById(
        "planetSelector"
    );

const closePlanetSelector =
    document.getElementById(
        "closePlanetSelector"
    );

/* =========================================================
   OPEN SELECTOR
   ========================================================= */

if (
    planetsBtn &&
    planetSelector
) {

    planetsBtn.addEventListener(
        "click",
        () => {

            const isOpen =
                planetSelector.style.display ===
                "block";

            planetSelector.style.display =
                isOpen
                    ? "none"
                    : "block";

            planetsBtn.setAttribute(
                "aria-expanded",
                String(!isOpen)
            );
        }
    );
}

/* =========================================================
   CLOSE SELECTOR
   ========================================================= */

if (
    closePlanetSelector &&
    planetSelector
) {

    closePlanetSelector.addEventListener(
        "click",
        () => {

            planetSelector.style.display =
                "none";

            if (planetsBtn) {

                planetsBtn.setAttribute(
                    "aria-expanded",
                    "false"
                );
            }
        }
    );
}

/* =========================================================
   PLANET BUTTONS
   ========================================================= */

document
    .querySelectorAll(
        "#planetList button"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const planetName =
                        button.dataset
                            .planet;

                    const planet =
                        solar.find(
                            item =>
                                item.info
                                    .name ===
                                planetName
                        );

                    if (!planet) {
                        return;
                    }

                    selectPlanet(
                        planet.mesh
                    );

                    if (
                        planetSelector
                    ) {

                        planetSelector
                            .style
                            .display =
                            "none";
                    }

                    if (
                        planetsBtn
                    ) {

                        planetsBtn
                            .setAttribute(
                                "aria-expanded",
                                "false"
                            );
                    }
                }
            );
        }
    );

/* =========================================================
   SIMULATION CONTROLS
   ========================================================= */

let isPaused =
    false;

let simulationSpeed =
    1;

const speedSlider =
    document.getElementById(
        "speedSlider"
    );

const speedDisplay =
    document.getElementById(
        "speedDisplay"
    );

if (speedSlider) {

    speedSlider.addEventListener(
        "input",
        () => {

            simulationSpeed =
                Number(
                    speedSlider.value
                );

            if (
                speedDisplay
            ) {

                speedDisplay
                    .textContent =
                    simulationSpeed
                        .toFixed(1) +
                    "×";
            }
        }
    );
}

/* =========================================================
   PLAY
   ========================================================= */

const playButton =
    document.getElementById(
        "playBtn"
    );

if (playButton) {

    playButton.addEventListener(
        "click",
        () => {

            isPaused =
                false;
        }
    );
}

/* =========================================================
   PAUSE
   ========================================================= */

const pauseButton =
    document.getElementById(
        "pauseBtn"
    );

if (pauseButton) {

    pauseButton.addEventListener(
        "click",
        () => {

            isPaused =
                true;
        }
    );
}

/* =========================================================
   CLOCK
   ========================================================= */

const clockElement =
    document.getElementById(
        "clock"
    );

function updateClock() {

    if (!clockElement) {
        return;
    }

    const now =
        new Date();

    const hours =
        String(
            now.getHours()
        ).padStart(
            2,
            "0"
        );

    const minutes =
        String(
            now.getMinutes()
        ).padStart(
            2,
            "0"
        );

    const seconds =
        String(
            now.getSeconds()
        ).padStart(
            2,
            "0"
        );

    clockElement.textContent =
        `${hours}:${minutes}:${seconds}`;
}

updateClock();

setInterval(
    updateClock,
    1000
);

/* =========================================================
   FPS
   ========================================================= */

const fpsLabel =
    document.getElementById(
        "fpsLabel"
    );

let lastFPSUpdate =
    performance.now();

let frameCounter =
    0;

/* =========================================================
   SIMULATION TIME
   ========================================================= */

let simulationTime =
    0;

/* =========================================================
   PREVIEW RESIZE
   ========================================================= */

function resizePlanetPreview() {

    const width =
        previewContainer
            .clientWidth;

    const height =
        previewContainer
            .clientHeight;

    if (
        !width ||
        !height
    ) {

        return;
    }

    previewCamera.aspect =
        width /
        height;

    previewCamera
        .updateProjectionMatrix();

    previewRenderer.setSize(
        width,
        height
    );
}

/* =========================================================
   MAIN RESIZE
   ========================================================= */

function resizeMainRenderer() {

    const width =
        canvasContainer
            .clientWidth;

    const height =
        canvasContainer
            .clientHeight;

    if (
        !width ||
        !height
    ) {

        return;
    }

    camera.aspect =
        width /
        height;

    camera.updateProjectionMatrix();

    renderer.setSize(
        width,
        height
    );

    resizePlanetPreview();
}

window.addEventListener(
    "resize",
    resizeMainRenderer
);

/* =========================================================
   ANIMATION
   ========================================================= */

const animationClock =
    new THREE.Clock();

function animate() {

    requestAnimationFrame(
        animate
    );

    const delta =
        animationClock
            .getDelta();

    if (!isPaused) {

        simulationTime +=
            delta *
            simulationSpeed;

        solar.forEach(
            planet => {

                planet.angle +=
                    planet.info.speed *
                    simulationSpeed *
                    delta *
                    8;

                planet.mesh.position.x =
                    Math.cos(
                        planet.angle
                    ) *
                    planet.info.distance;

                planet.mesh.position.z =
                    Math.sin(
                        planet.angle
                    ) *
                    planet.info.distance;

                planet.mesh.rotation.y +=
                    0.01 *
                    simulationSpeed;
            }
        );

        sun.rotation.y +=
            0.002 *
            simulationSpeed;

        stars.rotation.y +=
            0.00005 *
            simulationSpeed;

        previewPlanet.rotation.y +=
            0.006 *
            Math.max(
                0.35,
                Math.min(
                    simulationSpeed,
                    3
                )
            );
    }

    /* =====================================================
       RENDER
       ===================================================== */

    controls.update();

    renderer.render(
        scene,
        camera
    );

    previewRenderer.render(
        previewScene,
        previewCamera
    );

    /* =====================================================
       SIMULATION TIME DISPLAY
       ===================================================== */

    const totalSeconds =
        Math.floor(
            simulationTime
        );

    const hours =
        Math.floor(
            totalSeconds /
            3600
        );

    const minutes =
        Math.floor(
            (
                totalSeconds %
                3600
            ) /
            60
        );

    const seconds =
        totalSeconds %
        60;

    const simTimeElement =
        document.getElementById(
            "simTime"
        );

    if (
        simTimeElement
    ) {

        simTimeElement.textContent =
            `${String(hours).padStart(2, "0")}:` +
            `${String(minutes).padStart(2, "0")}:` +
            `${String(seconds).padStart(2, "0")}`;
    }

    /* =====================================================
       FPS
       ===================================================== */

    frameCounter++;

    const now =
        performance.now();

    if (
        now -
        lastFPSUpdate >=
        1000
    ) {

        if (fpsLabel) {

            fpsLabel.textContent =
                `FPS ${frameCounter}`;
        }

        frameCounter =
            0;

        lastFPSUpdate =
            now;
    }
}

/* =========================================================
   START
   ========================================================= */

resizeMainRenderer();

updatePreviewZoom();

animate();
