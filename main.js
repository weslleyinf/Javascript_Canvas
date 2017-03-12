class Vector{
	constructor(x=0, y=0){
		this.x = x;
		this.y = y;
	}
}

class Rectangle{
	get right(){ return this.position.x + this.size.x /2; }
	get left(){ return this.position.x - this.size.x /2; }
	get bottom(){ return this.position.y + this.size.y /2; }
	get top(){ return this.position.y - this.size.y /2; }
	constructor(w, h){
		this.position = new Vector;
		this.size = new Vector(w, h);
	}
}

class Ball extends Rectangle{
	constructor(){
		super(10, 10);
		this.velocity = new Vector;
	}
}

class Player extends Rectangle{
	constructor(){
		super(10,100);
		this.score = 0;
		this.velocity = new Vector;
	}
	collision(ball, canvas){
		if(this.top < ball.bottom &&
			this.bottom > ball.top &&
			this.left < ball.right && 
			this.right > ball.left){
			ball.velocity.x = this.velocity.x == 0?
				-(ball.velocity.x*1.1): this.velocity.x;
		}
		if(this.bottom > canvas.height){
			this.position.y = canvas.height -(this.size.y/2);
		}
		if(this.top < 0){
			this.position.y = this.size.y/2;
		}
	}
}

class Pong{
	constructor(canvas){
		this._canvas = canvas;
		this._context = canvas.getContext('2d');	
		this.ball= new Ball;
		this.players = [
			new Player,
			new Player,
		];
		console.log(this.players);
		let lastTime;
		const callback = (millis) => {
			if(lastTime){
				this.update((millis - lastTime)/ 1000);
			}
			else this.initializeGame();
			lastTime = millis;
			requestAnimationFrame(callback);
		};
		callback();
		
		this.CharsPixel = 5;
		this.Chars=[
			'111101101101111',
			'010010010010010',
			'111001111100111',
			'111001111001111',
			'101101111001001',
			'111100111001111',
			'001001111101111',
			'111001001001001',
			'111101111101111',
			'111101111001001',
		].map(str => {
			const canvas = document.createElement('canvas');
			canvas.height = this.CharsPixel * 10;
			canvas.width = this.CharsPixel *3;
			const context = canvas.getContext('2d');	
			context.fillStyle = "#fff";
			str.split('').forEach((fill, i) => {
				if(fill === '1'){
					context.fillRect(
						(i % 3) * this.CharsPixel,
						(i / 3|0) * this.CharsPixel,
						this.CharsPixel,
						this.CharsPixel);
				}
			});
			return canvas;
		})
	}
	drawRect(rect){
		this._context.fillStyle = '#ffffff';
		this._context.fillRect(
			rect.left,
			rect.top, 
			rect.size.x, 
			rect.size.y
		);
	}
	draw(){
		this._context.fillStyle = '#000000';
		this._context.fillRect(0,0, this._canvas.width, this._canvas.height);
		this.drawRect(this.ball);
		this.players.forEach( player => this.drawRect(player));
		this.drawScore();
	}
	drawScore(){
		const align = this._canvas.width / 3;
		const charsWidth = this.CharsPixel * 3;
		this.players.forEach((player, index) => {
			const chars = player.score.toString().split('');
			const offset = align * (index +1) - (charsWidth * chars.length /2) * this.CharsPixel /2;
			chars.forEach((char, poss) => {
				this._context.drawImage(
					this.Chars[char], 
					offset + poss * charsWidth,
					20);
			});
		});
	}
	initializeGame(){
		this.ball.position.x = (this._canvas.width - this.ball.size.x)/2;
		this.ball.position.y = (this._canvas.height - this.ball.size.y)/2;
		this.ball.velocity.x = 0;
		this.ball.velocity.y = 0;
		this.players[0].position.x = 20;
		this.players[1].position.x = this._canvas.width - 20;
		this.players.forEach( player => 
				player.position.y = this._canvas.height/2);
	}
	start(){
		if(this.ball.velocity.x == 0){
			this.ball.velocity.x = Math.random() < 0.5?
				Math.random()*250: -Math.random()*250;
			this.ball.velocity.y = Math.random() < 0.5? 
				Math.random()*200: -Math.random()*200;
		}
	}
	collision(ball){
		if(ball.bottom > this._canvas.height || ball.top < 0 ){
			ball.velocity.y = -ball.velocity.y;
		}
		if(ball.position.x > this._canvas.width || ball.position.x < 0 ){
			this.players[ball.velocity.x > 0? 0: 1].score++;
			this.initializeGame();
		}
	}
	update(dt){
		this.ball.position.x += this.ball.velocity.x * dt;
		this.ball.position.y += this.ball.velocity.y * dt;
		
		this.players[1].position.y = this.ball.position.y;
		
		this.collision(this.ball);
		this.players.forEach(player => {player.collision(this.ball, this._canvas)});
		
		this.draw();

	}
}

const canvas = document.getElementById('pong');
const pong = new Pong(canvas);

canvas.addEventListener('mousemove', event =>{
	const scale = canvas.height * (event.offsetY / event.target.getBoundingClientRect().height);
	pong.players[0].velocity.y = (scale - pong.players[0].position.y)*100;
	pong.players[0].position.y = scale;
});

canvas.addEventListener('click', event =>{
	pong.start();
});
