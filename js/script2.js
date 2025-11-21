let canvas = document.createElement("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let ctx = canvas.getContext("2d");
document.body.appendChild(canvas);

let particles = [];
let pcount = 300;
let actions = ["right", "up", "left", "down", "around"];
let action = 0;

document.body.addEventListener("click", function() {
    action++;
    action = action % actions.length;
});

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = Math.random();
    }

    update() {
        switch (actions[action]) {
            case "right":
                this.x += this.vx * 1; // 速度因子从 3 改为 1
                if (this.x > canvas.width) {
                    this.x = 0;
                }
                break;
            case "left":
                this.x -= this.vx * 1; // 速度因子从 3 改为 1
                if (this.x < 0) {
                    this.x = canvas.width;
                }
                break;
            case "up":
                this.y -= this.vx * 1; // 速度因子从 3 改为 1
                if (this.y < 0) {
                    this.y = canvas.height;
                }
                break;
            case "down":
                this.y += this.vx * 1; // 速度因子从 3 改为 1
                if (this.y > canvas.height) {
                    this.y = 0;
                }
                break;
            case "around":
                let deg = Math.atan2((this.y - canvas.height / 2), (this.x - canvas.width / 2));
                let r = Math.sqrt(Math.pow(this.x - canvas.width / 2, 2) + Math.pow(this.y - canvas.height / 2, 2));
                this.x = r * Math.cos(deg + this.vx / 200) + canvas.width / 2;
                this.y = r * Math.sin(deg + this.vx / 200) + canvas.height / 2;
                break;
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 1 + this.vx, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255," + this.vx + ")";
        ctx.fill();
    }
}

window.onresize = function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
};

function ani() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (particles.length < pcount) {
        particles.push(new Particle());
    }
    for (let i in particles) {
        let p = particles[i];
        p.update();
        p.draw();
    }
}

setInterval(ani, 100 / 6);