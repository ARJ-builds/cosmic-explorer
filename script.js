// Cosmic Explorer starts here.
const starsContainer = document.querySelector(".stars");

for (let i = 0; i < 250; i++) {

    const star = document.createElement("span");

    const size = Math.random() * 3 + 1;

    star.style.width = size + "px";
    star.style.height = size + "px";

    star.style.left = Math.random() * 100 + "%";
    star.style.top = Math.random() * 100 + "%";

    star.style.animationDelay = Math.random() * 5 + "s";
    star.style.animationDuration = (2 + Math.random() * 4) + "s";

    starsContainer.appendChild(star);

}
const shootingContainer = document.querySelector(".shooting-stars");

function createMeteor(){

    const meteor = document.createElement("div");

    meteor.classList.add("shooting-star");

    meteor.style.left = Math.random()*80 + "%";

    meteor.style.top = Math.random()*30 + "%";

    meteor.style.animation = "shoot 1.5s linear forwards";

    shootingContainer.appendChild(meteor);

    setTimeout(()=>{
        meteor.remove();

    },1500);

}

setInterval(createMeteor,10000);

// ===============================
// Start Mission Button
// ===============================

// ===============================
// Start Mission Buttons
// ===============================

const startButton = document.getElementById("startMission");
const launchButton = document.getElementById("launchMission");

function launchMission() {
    document.body.classList.add("launch");

    setTimeout(() => {
        window.location.href = "explore.html";
    }, 1200);
}

startButton?.addEventListener("click", launchMission);
launchButton?.addEventListener("click", launchMission);

