import * as THREE from "three";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js";

/* =========================================================
   COSMIC EXPLORER
   Main Solar System + Rotating Planet Hologram
   ========================================================= */


/* =========================================================
   BASIC SETUP
   ========================================================= */

const canvasContainer = document.getElementById("canvas-container");

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x01040a);

const camera = new THREE.PerspectiveCamera(
    60,
    canvasContainer.clientWidth / canvasContainer.clientHeight,
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
    canvasContainer.clientWidth,
    canvasContainer.clientHeight
);

renderer.outputColorSpace = THREE.SRGBColorSpace;

canvasContainer.appendChild(renderer.domElement);


/* =========================================================
   ORBIT CONTROLS
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

const ambientLight = new THREE.AmbientLight(
    0xffffff,
    0.45
);

scene.add(ambientLight);


const sunLight = new THREE.PointLight(
    0xffffff,
    3,
    2500
);

sunLight.position.set(0, 0, 0);

scene.add(sunLight);


/* =========================================================
   STARS
   ========================================================= */

function createStars() {

    const starGeometry =
        new THREE.BufferGeometry();

    const starCount = 5000;

    const positions =
        new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {

        const i3 = i * 3;

        positions[i3] =
            (Math.random() - 0.5) * 4000;

        positions[i3 + 1] =
            (Math.random() - 0.5) * 4000;

        positions[i3 + 2] =
            (Math.random() - 0.5) * 4000;
    }

    starGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(
            positions,
            3
        )
    );

    const starMaterial =
        new THREE.PointsMaterial({
            color: 0x8feaff,
            size: 1.4,
            sizeAttenuation: true
        });

    const stars =
        new THREE.Points(
            starGeometry,
            starMaterial
        );

    scene.add(stars);

    return stars;
}

const stars = createStars();


/* =========================================================
   TEXTURES
   ========================================================= */

const loader =
    new THREE.TextureLoader();

const textures = {

    sun: loader.load("./textures/sun.jfif"),

    mercury:
        loader.load("./textures/mercury.jfif"),

    venus:
        loader.load("./textures/venus.jfif"),

    earth:
        loader.load("./textures/earth.jpg"),

    mars:
        loader.load("./textures/mars.jfif"),

    jupiter:
        loader.load("./textures/jupiter.jfif"),

    saturn:
        loader.load("./textures/saturn.jfif"),

    uranus:
        loader.load("./textures/uranus.jfif"),

    neptune:
        loader.load("./textures/neptune.jfif"),

    ring:
        loader.load("./textures/saturn_ring.png")
};


/* =========================================================
   PLANET DATA
   ========================================================= */

const PLANETS = [

    {
        name: "Sun",
        radius: 18,
        distance: 0,
        speed: 0,
        texture: textures.sun,

        description:
            "The Sun is the star at the center of our Solar System. It provides the light and heat that make life on Earth possible."
    },

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
   SUN
   ========================================================= */

const sunGeometry =
    new THREE.SphereGeometry(
        18,
        64,
        64
    );

const sunMaterial =
    new THREE.MeshBasicMaterial({
        map: textures.sun
    });

const sun =
    new THREE.Mesh(
        sunGeometry,
        sunMaterial
    );

scene.add(sun);


/* =========================================================
   SOLAR SYSTEM
   ========================================================= */

const solar = [];


const PLANETS = [

    {
        name: "Sun",
        radius: 18,
        distance: 0,
        speed: 0,
        texture: textures.sun,

        description:
            "The Sun is the star at the center of our Solar System. It provides the light and heat that make life on Earth possible."
    },

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

    mesh.position.x =
        planetInfo.distance;

    mesh.userData = {
        ...planetInfo
    };

    scene.add(mesh);


    /* ==============================================
       ORBIT LINE
       ============================================== */

    const orbitPoints = [];

    const segments = 128;

    for (let i = 0; i <= segments; i++) {

        const angle =
            (i / segments) *
            Math.PI *
            2;

        orbitPoints.push(
            new THREE.Vector3(
                Math.cos(angle) *
                    planetInfo.distance,

                0,

                Math.sin(angle) *
                    planetInfo.distance
            )
        );
    }

    const orbitGeometry =
        new THREE.BufferGeometry()
            .setFromPoints(
                orbitPoints
            );

    const orbitMaterial =
        new THREE.LineBasicMaterial({
            color: 0x075d70,
            transparent: true,
            opacity: 0.45
        });

    const orbit =
        new THREE.Line(
            orbitGeometry,
            orbitMaterial
        );

    scene.add(orbit);


    /* ==============================================
       SATURN RINGS
       ============================================== */

    if (planetInfo.name === "Saturn") {

        const ringGeometry =
            new THREE.RingGeometry(
                planetInfo.radius * 1.25,
                planetInfo.radius * 2,
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

        mesh.add(ring);

        mesh.userData.ring = ring;
    }


    solar.push({
        mesh,
        info: planetInfo,
        angle: Math.random() * Math.PI * 2
    });

});


/* =========================================================
   PLANET HOLOGRAM PREVIEW
   ========================================================= */

const previewContainer =
    document.getElementById(
        "planet-preview-container"
    );

const previewName =
    document.getElementById(
        "previewPlanetName"
    );


const previewScene =
    new THREE.Scene();

previewScene.background =
    new THREE.Color(0x020914);


const previewCamera =
    new THREE.PerspectiveCamera(
        38,
        previewContainer.clientWidth /
            previewContainer.clientHeight,
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
    Math.min(window.devicePixelRatio, 2)
);

previewRenderer.setSize(
    previewContainer.clientWidth,
    previewContainer.clientHeight
);

previewRenderer.outputColorSpace =
    THREE.SRGBColorSpace;

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
        map: textures.earth,
        roughness: 0.88,
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
   HOLOGRAM ZOOM
   ========================================================= */

let previewZoom = 5.2;

const PREVIEW_MIN_ZOOM = 2.8;
const PREVIEW_MAX_ZOOM = 8.5;


function updatePreviewZoom() {

    previewCamera.position.z =
        previewZoom;
}


/* Zoom in */

document.getElementById(
    "previewZoomIn"
).addEventListener(
    "click",
    () => {

        previewZoom -= 0.45;

        previewZoom =
            Math.max(
                PREVIEW_MIN_ZOOM,
                previewZoom
            );

        updatePreviewZoom();
    }
);


/* Zoom out */

document.getElementById(
    "previewZoomOut"
).addEventListener(
    "click",
    () => {

        previewZoom += 0.45;

        previewZoom =
            Math.min(
                PREVIEW_MAX_ZOOM,
                previewZoom
            );

        updatePreviewZoom();
    }
);


/* Mouse wheel zoom */

previewContainer.addEventListener(
    "wheel",
    (event) => {

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
    { passive: false }
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

previewSaturnRing.visible = false;

previewPlanet.add(
    previewSaturnRing
);


/* =========================================================
   UPDATE PLANET PREVIEW
   ========================================================= */

function updatePlanetPreview(planet) {

    if (!planet) return;

    if (planet.texture) {

        previewPlanetMaterial.map =
            planet.texture;

        previewPlanetMaterial.needsUpdate =
            true;
    }

    previewSaturnRing.visible =
        planet.name === "Saturn";

    previewName.textContent =
        planet.name.toUpperCase();
}


/* Start with Earth */

updatePlanetPreview(
    PLANETS.find(
        planet =>
            planet.name === "Earth"
    )
);


/* =========================================================
   RESIZE PLANET PREVIEW
   ========================================================= */

function resizePlanetPreview() {

    const width =
        previewContainer.clientWidth;

    const height =
        previewContainer.clientHeight;

    if (!width || !height) return;

    previewCamera.aspect =
        width / height;

    previewCamera.updateProjectionMatrix();

    previewRenderer.setSize(
        width,
        height
    );
}


/* =========================================================
   PLANET SELECTION
   ========================================================= */

let selectedPlanet = null;


function selectPlanet(mesh) {

    if (!mesh) return;


    /* Remove previous glow */

    if (selectedPlanet) {

        selectedPlanet.material.emissive
            ?.setHex(0x000000);

        selectedPlanet.material.emissiveIntensity = 0;
    }


    selectedPlanet = mesh;


    /* Glow */

    if (mesh.material) {

        if (
            "emissive" in
            mesh.material
        ) {

            mesh.material.emissive =
                new THREE.Color(
                    0x00d9ff
                );

            mesh.material.emissiveIntensity =
                0.8;
        }
    }


    updateDatabase(
        mesh.userData
    );


    updatePlanetPreview(
        mesh.userData
    );


    /* Camera target */

    controls.target.copy(
        mesh.position
    );


    setTimeout(() => {

        if (
            selectedPlanet === mesh &&
            mesh.material &&
            "emissiveIntensity" in
            mesh.material
        ) {

            mesh.material.emissiveIntensity =
                0;
        }

    }, 3000);
}


/* =========================================================
   DATABASE
   ========================================================= */

function updateDatabase(planet) {

    const planetInfo =
        document.getElementById(
            "planetInfo"
        );

    if (!planetInfo || !planet) return;


    const description =
        planet.description ||
        "No database description available.";


    planetInfo.innerHTML = `

        <div class="databasePlanetHeader">

            <span class="databaseStatusDot"></span>

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
                    ${
                        planet.name === "Sun"
                            ? "CENTER"
                            : planet.distance
                    }
                </strong>

            </div>


            <div class="databaseStat">

                <span>
                    ORBITAL SPEED
                </span>

                <strong>
                    ${
                        planet.name === "Sun"
                            ? "—"
                            : planet.speed
                    }
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
   MOUSE CLICK PLANET DETECTION
   ========================================================= */

const raycaster =
    new THREE.Raycaster();

const mouse =
    new THREE.Vector2();


renderer.domElement.addEventListener(
    "click",
    (event) => {

        const rect =
            renderer.domElement.getBoundingClientRect();

        mouse.x =
            ((event.clientX - rect.left) /
                rect.width) *
                2 -
            1;

        mouse.y =
            -(
                (event.clientY - rect.top) /
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
                meshes
            );


        if (
            intersections.length > 0
        ) {

            selectPlanet(
                intersections[0].object
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


/* Open selector */

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


/* Close selector */

closePlanetSelector.addEventListener(
    "click",
    () => {

        planetSelector.style.display =
            "none";

        planetsBtn.setAttribute(
            "aria-expanded",
            "false"
        );
    }
);


/* Planet buttons */

document
    .querySelectorAll(
        "#planetList button"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const planetName =
                    button.dataset.planet;

                const planet =
                    solar.find(
                        p =>
                            p.info.name ===
                            planetName
                    );


                if (!planet) return;


                selectPlanet(
                    planet.mesh
                );


                planetSelector.style.display =
                    "none";

                planetsBtn.setAttribute(
                    "aria-expanded",
                    "false"
                );
            }
        );

    });


/* =========================================================
   SIMULATION CONTROLS
   ========================================================= */

let isPaused = false;

let simulationSpeed = 1;


const speedSlider =
    document.getElementById(
        "speedSlider"
    );

const speedDisplay =
    document.getElementById(
        "speedDisplay"
    );


speedSlider.addEventListener(
    "input",
    () => {

        simulationSpeed =
            Number(
                speedSlider.value
            );

        speedDisplay.textContent =
            simulationSpeed.toFixed(1) +
            "×";
    }
);


/* PLAY */

document.getElementById(
    "playBtn"
).addEventListener(
    "click",
    () => {

        isPaused = false;
    }
);


/* PAUSE */

document.getElementById(
    "pauseBtn"
).addEventListener(
    "click",
    () => {

        isPaused = true;
    }
);


/* =========================================================
   SIMULATION TIME
   ========================================================= */

let simulationTime = 0;


/* =========================================================
   CLOCK
   ========================================================= */

const clockElement =
    document.getElementById(
        "clock"
    );


function updateClock() {

    const now =
        new Date();

    const hours =
        String(
            now.getHours()
        ).padStart(2, "0");

    const minutes =
        String(
            now.getMinutes()
        ).padStart(2, "0");

    const seconds =
        String(
            now.getSeconds()
        ).padStart(2, "0");

    clockElement.textContent =
        `${hours}:${minutes}:${seconds}`;
}


/* =========================================================
   FPS
   ========================================================= */

const fpsLabel =
    document.getElementById(
        "fpsLabel"
    );

let lastFPSUpdate = performance.now();

let frameCounter = 0;


/* =========================================================
   RESIZE
   ========================================================= */

window.addEventListener(
    "resize",
    () => {

        /* Main */

        const width =
            canvasContainer.clientWidth;

        const height =
            canvasContainer.clientHeight;

        camera.aspect =
            width / height;

        camera.updateProjectionMatrix();

        renderer.setSize(
            width,
            height
        );


        /* Preview */

        resizePlanetPreview();
    }
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
        animationClock.getDelta();


    /* ==============================================
       SOLAR SYSTEM
       ============================================== */

    if (!isPaused) {

        simulationTime +=
            delta *
            simulationSpeed;


        solar.forEach(
            planet => {

                planet.angle +=
                    planet.info.speed *
                    simulationSpeed;


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
    }


    /* ==============================================
       PLANET HOLOGRAM ROTATION
       ============================================== */

    if (!isPaused) {

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


    /* ==============================================
       RENDER
       ============================================== */

    controls.update();

    renderer.render(
        scene,
        camera
    );

    previewRenderer.render(
        previewScene,
        previewCamera
    );


    /* ==============================================
       SIMULATION TIME DISPLAY
       ============================================== */

    const totalSeconds =
        Math.floor(
            simulationTime
        );

    const hours =
        Math.floor(
            totalSeconds / 3600
        );

    const minutes =
        Math.floor(
            (totalSeconds % 3600) /
            60
        );

    const seconds =
        totalSeconds % 60;


    document.getElementById(
        "simTime"
    ).textContent =
        `${String(hours).padStart(2, "0")}:` +
        `${String(minutes).padStart(2, "0")}:` +
        `${String(seconds).padStart(2, "0")}`;


    /* ==============================================
       FPS
       ============================================== */

    frameCounter++;

    const now =
        performance.now();

    if (
        now - lastFPSUpdate >=
        1000
    ) {

        fpsLabel.textContent =
            `FPS ${frameCounter}`;

        frameCounter = 0;

        lastFPSUpdate = now;
    }

}


/* =========================================================
   START
   ========================================================= */

resizePlanetPreview();

updateClock();

setInterval(
    updateClock,
    1000
);

animate();
