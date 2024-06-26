class Fire {
	constructor() {
		this.canvas = document.getElementById("fire");
		this.ctx = this.canvas.getContext("2d");
		this.canvas.height = window.innerHeight;
		this.canvas.width = window.innerWidth;
		this.aFires = [];
		this.aSpark = [];
		this.aSpark2 = [];

		this.mouse = {
			x: this.canvas.width * 0.5,
			y: this.canvas.height * 0.75,
		};

		this.init();
	}
	init() {
		this.canvas.addEventListener("mousemove", this.updateMouse.bind(this), false);
		this.imageObj = new Image();
		this.imageObj.src = document.getElementById("bg").getAttribute("src");
		this.pattern = this.ctx.createPattern(this.imageObj, "repeat");
	}
	run() {
		this.update();
		this.draw();
		if (this.bRuning) requestAnimationFrame(this.run.bind(this));
	}
	start() {
		this.bRuning = true;
		this.run();
	}
	stop() {
		this.bRuning = false;
	}
	update() {
		this.aFires.push(new Flame(this.mouse));
		this.aSpark.push(new Spark(this.mouse));
		this.aSpark2.push(new Spark(this.mouse));

		for (let i = this.aFires.length - 1; i >= 0; i--) {
			if (this.aFires[i].alive) this.aFires[i].update();
			else this.aFires.splice(i, 1);
		}
		for (let i = this.aSpark.length - 1; i >= 0; i--) {
			if (this.aSpark[i].alive) this.aSpark[i].update();
			else this.aSpark.splice(i, 1);
		}

		for (let i = this.aSpark2.length - 1; i >= 0; i--) {
			if (this.aSpark2[i].alive) this.aSpark2[i].update();
			else this.aSpark2.splice(i, 1);
		}
	}
	draw() {
		this.clearCanvas();
		this.drawHalo();
		this.drawTxt();
		this.ctx.globalCompositeOperation = "overlay"; //or lighter or soft-light
		for (let i = this.aFires.length - 1; i >= 0; i--) {
			this.aFires[i].draw(this.ctx);
		}
		this.ctx.globalCompositeOperation = "soft-light"; //"soft-light";//"color-dodge";
		for (let i = this.aSpark.length - 1; i >= 0; i--) {
			if (i % 2 === 0) this.aSpark[i].draw(this.ctx);
		}
		this.ctx.globalCompositeOperation = "color-dodge"; //"soft-light";//"color-dodge";
		for (let i = this.aSpark2.length - 1; i >= 0; i--) {
			this.aSpark2[i].draw(this.ctx);
		}
	}
	updateMouse(e) {
		this.mouse.x = e.clientX;
		this.mouse.y = e.clientY;
	}
	clearCanvas() {
		this.ctx.globalCompositeOperation = "source-over";
		this.ctx.fillStyle = "rgba( 15, 5, 2, 1 )";
		this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

		this.ctx.globalCompositeOperation = "lighter";
		this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.fillStyle = this.pattern;
		this.ctx.fill(); /**/
	}
	drawHalo() {
		const r = rand(300, 350);
		this.ctx.globalCompositeOperation = "lighter";
		this.grd = this.ctx.createRadialGradient(
			this.mouse.x,
			this.mouse.y,
			r,
			this.mouse.x,
			this.mouse.y,
			0
		);
		this.grd.addColorStop(0, "transparent");
		this.grd.addColorStop(1, "rgb( 50, 2, 0 )");
		this.ctx.beginPath();
		this.ctx.arc(this.mouse.x, this.mouse.y - 100, r, 0, 2 * Math.PI);
		this.ctx.fillStyle = this.grd;
		this.ctx.fill();
	}
	drawTxt() {
		const mousePCx = (this.canvas.width / 2 - this.mouse.x) / 20;
		const mousePCy = (this.canvas.height / 2 - this.mouse.y) / 20;
		this.ctx.globalCompositeOperation = "source-over";
		this.ctx.save();
		this.ctx.font = "8em Amatic SC";
		this.ctx.textAlign = "center";
		this.ctx.strokeStyle = "rgb(50, 50, 0)";
		this.ctx.fillStyle = "rgb(100, 10, 0)";
		this.ctx.lineWidth = 2;
		this.ctx.shadowColor = "rgba( 10, 0, 0, 0.5 )";
		this.ctx.shadowOffsetX = rand(mousePCx - 2, mousePCx + 2);
		this.ctx.shadowOffsetY = rand(mousePCy - 2, mousePCy + 2);
		this.ctx.shadowBlur = rand(7, 10);
		this.ctx.strokeText(
			"Heartflame Software",
			this.canvas.width / 2,
			this.canvas.height * 0.6
		);
		this.ctx.fillText(
			"Heartflame Software",
			this.canvas.width / 2,
			this.canvas.height * 0.6
		);
		this.ctx.restore();
	}
}

class Flame {
	constructor(mouse) {
		this.cx = mouse.x;
		this.cy = mouse.y;
		this.x = rand(this.cx - 25, this.cx + 25);
		this.y = rand(this.cy - 5, this.cy + 5);
		this.lx = this.x;
		this.ly = this.y;
		this.vy = rand(1, 3);
		this.vx = rand(-1, 1);
		this.r = rand(30, 40);
		this.life = rand(2, 7);
		this.alive = true;
		this.c = {
			h: Math.floor(rand(2, 40)),
			s: 100,
			l: rand(80, 100),
			a: 0,
			ta: rand(0.8, 0.9),
		};
	}
	update() {
		this.lx = this.x;
		this.ly = this.y;
		this.y -= this.vy;
		this.vy += 0.08;

		this.x += this.vx;
		if (this.x < this.cx) this.vx += 0.2;
		else this.vx -= 0.2;

		if (this.r > 0) this.r -= 0.3;
		if (this.r <= 0) this.r = 0;

		this.life -= 0.12;
		if (this.life <= 0) {
			this.c.a -= 0.05;
			if (this.c.a <= 0) this.alive = false;
		} else if (this.life > 0 && this.c.a < this.c.ta) {
			this.c.a += 0.08;
		}
	}
	draw(ctx) {
		this.grd1 = ctx.createRadialGradient(
			this.x,
			this.y,
			this.r * 3,
			this.x,
			this.y,
			0
		);
		this.grd1.addColorStop(
			0.5,
			`hsla( ${this.c.h}, ${this.c.s}%, ${this.c.l}%, ${this.c.a / 20})`
		);
		this.grd1.addColorStop(0, "transparent");
		this.grd2 = ctx.createRadialGradient(
			this.x,
			this.y,
			this.r,
			this.x,
			this.y,
			0
		);
		this.grd2.addColorStop(
			0.5,
			`hsla( ${this.c.h}, ${this.c.s}%, ${this.c.l}%, ${this.c.a})`
		);
		this.grd2.addColorStop(0, "transparent");

		ctx.beginPath();
		ctx.arc(this.x, this.y, this.r * 3, 0, 2 * Math.PI);
		ctx.fillStyle = this.grd1;
		//ctx.fillStyle = "hsla( " + this.c.h + ", " + this.c.s + "%, " + this.c.l + "%, " + (this.c.a/20) + ")";
		ctx.fill();

		ctx.globalCompositeOperation = "overlay";
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
		ctx.fillStyle = this.grd2;
		ctx.fill();

		ctx.beginPath();
		ctx.moveTo(this.lx, this.ly);
		ctx.lineTo(this.x, this.y);
		ctx.strokeStyle = `hsla( ${this.c.h}, ${this.c.s}%, ${this.c.l}%, 1)`;
		ctx.lineWidth = rand(1, 2);
		ctx.stroke();
		ctx.closePath();
	}
}

class Spark {
	constructor(mouse) {
		this.cx = mouse.x;
		this.cy = mouse.y;
		this.x = rand(this.cx - 40, this.cx + 40);
		this.y = rand(this.cy, this.cy + 5);
		this.lx = this.x;
		this.ly = this.y;
		this.vy = rand(1, 3);
		this.vx = rand(-4, 4);
		this.r = rand(0, 1);
		this.life = rand(4, 8);
		this.alive = true;
		this.c = {
			h: Math.floor(rand(2, 40)),
			s: 100,
			l: rand(40, 100),
			a: rand(0.8, 0.9),
		};
	}
	update() {
		this.lx = this.x;
		this.ly = this.y;
		this.y -= this.vy;
		this.x += this.vx;
		if (this.x < this.cx) this.vx += 0.2;
		else this.vx -= 0.2;
		this.vy += 0.08;
		this.life -= 0.1;
		if (this.life <= 0) {
			this.c.a -= 0.05;
			if (this.c.a <= 0) this.alive = false;
		}
	}
	draw(ctx) {
		ctx.beginPath();
		ctx.moveTo(this.lx, this.ly);
		ctx.lineTo(this.x, this.y);
		ctx.strokeStyle = `hsla( ${this.c.h}, ${this.c.s}%, ${this.c.l}%, ${this.c.a / 2})`;
		ctx.lineWidth = this.r * 2;
		ctx.lineCap = "round";
		ctx.stroke();
		ctx.closePath();
		ctx.beginPath();
		ctx.moveTo(this.lx, this.ly);
		ctx.lineTo(this.x, this.y);
		ctx.strokeStyle = `hsla( ${this.c.h}, ${this.c.s}%, ${this.c.l}%, ${this.c.a})`;
		ctx.lineWidth = this.r;
		ctx.stroke();
		ctx.closePath();
	}
}
rand = (min, max) => Math.random() * (max - min) + min;
// biome-ignore lint/suspicious/noGlobalAssign: <explanation>
onresize = () => {
	oCanvas.canvas.width = window.innerWidth;
	oCanvas.canvas.height = window.innerHeight;
};

let oCanvas;
init = () => {
	oCanvas = new Fire();
	oCanvas.start();
};

window.onload = init;
