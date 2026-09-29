import * as THREE from "./libs/three.module.js";
import { OrbitControls } from "./libs/addons/controls/OrbitControls.js";
const response = await fetch("./data/planets.json");
const PLANET_DATABASE = await response.json();
let simulationSeconds = 0;
/* =====================================================
   CANVAS
===================================================== */

const container = document.getElementById("canvas-container");

/* =====================================================
   SCENE
===================================================== */

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x020611);

/* =====================================================
   RAYCASTER
===================================================== */

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

let selectedPlanet = null;

/* =====================================================
   SIMULATION
===================================================== */

let simulationSpeed = 1;

let isPaused = false;

/* =====================================================
   CAMERA
===================================================== */

const camera = new THREE.PerspectiveCamera(
45,
container.clientWidth/container.clientHeight,
0.1,
6000
);

camera.position.set(0,180,520);

/* =====================================================
   RENDERER
===================================================== */

const renderer = new THREE.WebGLRenderer({
antialias:true
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(container.clientWidth,container.clientHeight);

container.appendChild(renderer.domElement);

/* =====================================================
   CONTROLS
===================================================== */

const controls = new OrbitControls(camera,renderer.domElement);

controls.enableDamping=true;
controls.dampingFactor=.05;

controls.maxDistance=3000;
controls.minDistance=20;

/* =====================================================
   LIGHTING
===================================================== */

scene.add(
new THREE.AmbientLight(0xffffff,.25)
);

const sunLight=new THREE.PointLight(
0xffdd99,
10,
0
);

scene.add(sunLight);

/* =====================================================
   TEXTURES
===================================================== */

const loader=new THREE.TextureLoader();

const textures={

sun:loader.load("./textures/sun.jfif"),

mercury:loader.load("./textures/mercury.jfif"),

venus:loader.load("./textures/venus.jfif"),

earth:loader.load("./textures/earth.jpg"),

mars:loader.load("./textures/mars.jfif"),

jupiter:loader.load("./textures/jupiter.jfif"),

saturn:loader.load("./textures/saturn.jfif"),

uranus:loader.load("./textures/uranus.jfif"),

neptune:loader.load("./textures/neptune.jfif"),

ring:loader.load("./textures/saturn_ring.png")

};

/* =====================================================
   SOLAR SYSTEM DATA
===================================================== */

const PLANETS=[

{
name:"Mercury",
radius:2,
distance:.11,
speed:.020,
texture:textures.mercury
},

{
name:"Venus",
radius:3.2,
distance:.17,
speed:.015,
texture:textures.venus
},

{
name:"Earth",
radius:3.4,
distance:.24,
speed:.012,
texture:textures.earth
},

{
name:"Mars",
radius:2.6,
distance:.33,
speed:.009,
texture:textures.mars
},

{
name:"Jupiter",
radius:8,
distance:.47,
speed:.004,
texture:textures.jupiter
},

{
name:"Saturn",
radius:7,
distance:.62,
speed:.003,
texture:textures.saturn
},

{
name:"Uranus",
radius:5,
distance:.78,
speed:.002,
texture:textures.uranus
},

{
name:"Neptune",
radius:5,
distance:.94,
speed:.0015,
texture:textures.neptune
}

];

/* =====================================================
   RESPONSIVE SCALE
===================================================== */

let MAX_RADIUS;

function computeRadius(){

MAX_RADIUS=Math.min(
container.clientWidth,
container.clientHeight
)*0.9;

}

computeRadius();

/* =====================================================
   SUN
===================================================== */

const sun=new THREE.Mesh(

new THREE.SphereGeometry(16,64,64),

new THREE.MeshBasicMaterial({

map:textures.sun

})

);

scene.add(sun);

const glow=new THREE.Mesh(

new THREE.SphereGeometry(19,64,64),

new THREE.MeshBasicMaterial({

color:0xffaa33,

transparent:true,

opacity:.35,

side:THREE.BackSide,

blending:THREE.AdditiveBlending

})

);

scene.add(glow);

/* =====================================================
   STARS
===================================================== */

const starGeo=new THREE.BufferGeometry();

const verts=[];

for(let i=0;i<6000;i++){

verts.push(

THREE.MathUtils.randFloatSpread(5000),

THREE.MathUtils.randFloatSpread(5000),

THREE.MathUtils.randFloatSpread(5000)

);

}

starGeo.setAttribute(

"position",

new THREE.Float32BufferAttribute(verts,3)

);

const stars=new THREE.Points(

starGeo,

new THREE.PointsMaterial({

color:0xffffff,

size:1.3

})

);

scene.add(stars);

/* =====================================================
   PLANETS
===================================================== */

const solar=[];

function createOrbit(radius){

const curve=new THREE.EllipseCurve(
0,
0,
radius,
radius
);

const pts=curve.getPoints(250);

const geo=new THREE.BufferGeometry().setFromPoints(

pts.map(p=>new THREE.Vector3(p.x,0,p.y))

);

const orbit=new THREE.LineLoop(

geo,

new THREE.LineBasicMaterial({

color:0x3daeff,

transparent:true,

opacity:.35

})

);

scene.add(orbit);

}

PLANETS.forEach(p=>{

const orbitRadius=MAX_RADIUS*p.distance;

createOrbit(orbitRadius);

const pivot=new THREE.Group();

scene.add(pivot);

const material = new THREE.MeshStandardMaterial({

    map: p.texture,

    emissive: 0x000000,
    emissiveIntensity: 0

});

const mesh = new THREE.Mesh(

    new THREE.SphereGeometry(p.radius,40,40),

    material

);

mesh.userData = p;

mesh.position.x=orbitRadius;

pivot.add(mesh);

if(p.name==="Saturn"){

const ring=new THREE.Mesh(

new THREE.RingGeometry(

p.radius*1.5,

p.radius*2.5,

128

),

new THREE.MeshBasicMaterial({

map:textures.ring,

transparent:true,

side:THREE.DoubleSide

})

);

ring.rotation.x=Math.PI/2;

mesh.add(ring);

}

solar.push({

mesh,

pivot,

speed:p.speed,

info:p

});

});



/* =====================================================
   RESPONSIVE
===================================================== */

function rebuild(){

scene.children
.filter(x=>x.type==="LineLoop")
.forEach(x=>scene.remove(x));

solar.forEach((planet,i)=>{

const r=MAX_RADIUS*PLANETS[i].distance;

planet.mesh.position.x=r;

createOrbit(r);

});

}

window.addEventListener("resize",()=>{

renderer.setSize(
container.clientWidth,
container.clientHeight
);

camera.aspect=
container.clientWidth/
container.clientHeight;

camera.updateProjectionMatrix();

computeRadius();

rebuild();

});

renderer.domElement.addEventListener("click", onPlanetClick);

function onPlanetClick(event){

    const rect = renderer.domElement.getBoundingClientRect();

    mouse.x =
        ((event.clientX - rect.left) / rect.width) * 2 - 1;

    mouse.y =
        -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse,camera);

    const objects = solar.map(p=>p.mesh);

    const hit = raycaster.intersectObjects(objects);

    console.log(hit);

if(hit.length>0){

    console.log("Planet clicked:", hit[0].object.userData.name);

    selectPlanet(hit[0].object);

}
}
let glowTimeout = null;

function selectPlanet(mesh){

    // Cancel previous timer
    if(glowTimeout){

        clearTimeout(glowTimeout);

    }

    // Remove previous glow
    if(selectedPlanet){

        selectedPlanet.material.emissive.set(0x000000);
        selectedPlanet.material.emissiveIntensity = 0;

    }

    selectedPlanet = mesh;

    mesh.material.emissive.set(0x00ffff);
    mesh.material.emissiveIntensity = 2;

    updateDatabase(mesh.userData);

    glowTimeout = setTimeout(()=>{

        if(selectedPlanet===mesh){

            mesh.material.emissive.set(0x000000);
            mesh.material.emissiveIntensity=0;

            selectedPlanet=null;

        }

    },3000);

}

/* =====================================================
   ANIMATION
===================================================== */

function animate(){

requestAnimationFrame(animate);

controls.update();

sun.rotation.y+=.000;

glow.position.copy(sun.position);

glow.rotation.y+=.000;

stars.rotation.y+=.00000;

if(!isPaused){

    solar.forEach(p=>{

        p.pivot.rotation.y +=
            p.speed * simulationSpeed;

        p.mesh.rotation.y +=
            0.01 * simulationSpeed;

    });

}
if(!isPaused){

    simulationSeconds += simulationSpeed / 60;

}

const hrs =
Math.floor(simulationSeconds / 3600);

const mins =
Math.floor(simulationSeconds % 3600 / 60);

const secs =
Math.floor(simulationSeconds % 60);

document.getElementById("simTime").textContent =
`${String(hrs).padStart(2,"0")}:${String(mins).padStart(2,"0")}:${String(secs).padStart(2,"0")}`;
renderer.render(scene,camera);

}

animate();

/* =====================================================
   SIMULATION CONTROLS
===================================================== */

document.getElementById("pauseBtn").onclick = () => {

    isPaused = true;

    document.getElementById("simStatus").textContent =
        "⏸ PAUSED";

};

document.getElementById("playBtn").onclick = () => {

    isPaused = false;

    document.getElementById("simStatus").textContent =
        "▶ RUNNING";

};

const slider =
document.getElementById("speedSlider");

const speedText =
document.getElementById("speedDisplay");

slider.addEventListener("input",()=>{

    simulationSpeed =
        Number(slider.value);

    speedText.textContent =
simulationSpeed.toFixed(1)+"×";

});

let currentPlanet = null;

function updateDatabase(planet){

    // Your JSON is an OBJECT, not an array
    const data = PLANET_DATABASE[
        planet.name.toLowerCase()
    ];

    const info = document.getElementById("planetInfo");

    if(!data){

        info.innerHTML = `
            <h2>${planet.name}</h2>
            <p>No database found.</p>
        `;

        return;
    }

    currentPlanet = data;

    info.innerHTML = `

        <h2>${data.name}</h2>

        <p><b>Type</b></p>
        <p>${data.type}</p>

        <p><b>Radius</b></p>
        <p>${data.radius}</p>

        <p><b>Mass</b></p>
        <p>${data.mass}</p>

        <p><b>Gravity</b></p>
        <p>${data.gravity}</p>

        <p><b>Rotation</b></p>
        <p>${data.rotation}</p>

        <p><b>Revolution</b></p>
        <p>${data.revolution}</p>

        <button id="openDatabaseBtn">
            OPEN DATABASE
        </button>

    `;

    document
        .getElementById("openDatabaseBtn")
        .onclick = openPlanetDatabase;

}
function openPlanetDatabase(){

alert(

"IRON MAN DATABASE\n\n"+

currentPlanet.name+

"\n\nComing in next step."

);

}

/* =====================================================
   PLANET NAVIGATION
===================================================== */

const planetsBtn =
    document.getElementById("planetsBtn");

const planetSelector =
    document.getElementById("planetSelector");

const closePlanetSelector =
    document.getElementById("closePlanetSelector");


/* OPEN PLANET LIST */

planetsBtn.addEventListener("click", () => {

    planetSelector.style.display = "block";

});


/* CLOSE PLANET LIST */

closePlanetSelector.addEventListener("click", () => {

    planetSelector.style.display = "none";

});
/* =====================================================
   PLANET LIST SELECTION
===================================================== */

document
    .querySelectorAll("#planetList button")
    .forEach(button => {

        button.addEventListener("click", () => {

            const planetName =
                button.dataset.planet;

            const planet =
                solar.find(
                    p => p.info.name === planetName
                );

            if(!planet){

                console.warn(
                    "Planet not found:",
                    planetName
                );

                return;

            }

            selectPlanet(planet.mesh);

            planetSelector.style.display = "none";

        });

    });
    
;
