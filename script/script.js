
// var element = document.getElementById('element');

// function ran(num) {
//     return Math.floor(Math.random() * num);
// }

// setInterval(function () {
//     element.innerText = ran(5);
// }, 800);
(function () {


    //variables
    let scorE = 0;
    let score = 0;
    let level = 1;

    let y = document.getElementById("win");
    let x = document.getElementById("pac-man");

    let player = {
        x: 50,
        y: 50,
        pacSpecies: 320,
        pacDir: 0,
        pacSize: 32,
        speed: 8,
    };

    let powerDot = {
        timer: 0,
        ex: false,
        x: undefined,
        y: undefined
    };

    //enemy generating function

    function Ghast(x = ran(500) + 50, y = ran(500) + 50, species = ran(5) * 64, Dir = 0, speed = 10, blink = ran(15) + 5) {
        this.x = x;
        this.y = y;
        this.species = species;
        this.species2 = species;
        this.Dir = 0;

        //important methods ;)
        setInterval(function () {
            this.locX = ran(5);
        }.bind(this), 800);

        setInterval(function () {
            this.locY = ran(5);
        }.bind(this), 800);

        this.speed = speed;

        this.blink = blink;
        this.weak = false;
    }
    let enemies = {
        phantom1: new Ghast(),
        phantom2: new Ghast(),
        phantom3: new Ghast(),
        phantom4: new Ghast(),
        phantom5: new Ghast(),
    }
    //old version of ghosts
    const enemy = [
        enemy1 = {
            x: 150,
            y: 150,
            species: 0,
            Dir: 0,
            speed: 10,
            dirx: 0,
            diry: 0
        },
        enemy2 = {
            x: 250,
            y: 200,
            species: 64,
            Dir: 0,
            speed: 10,
            dirx: 0,
            diry: 0
        },
        enemy3 =
        {
            x: 100,
            y: 150,
            species: 128,
            Dir: 0,
            speed: 10,
            dirx: 0,
            diry: 0
        },
        enemy4 =
        {
            x: 250,
            y: 100,
            species: 192,
            Dir: 0,
            speed: 10,
            dirx: 0,
            diry: 0
        },
        enemy5 =
        {
            x: 350,
            y: 50,
            species: 254,
            Dir: 0,
            speed: 10,
            dirx: 0,
            diry: 0
        },
        enemy6 =
        {
            species: 384
        }
    ];

    let ghostNr = ran(5);

    //define phantom
    let phantom = enemy[ghostNr];
    phantom.weak = false;
    phantom.blink = 15;

    let canvas = document.createElement("canvas");
    let context = canvas.getContext("2d");
    document.body.appendChild(canvas);
    canvas.height = 600;
    canvas.width = 600;

    let imageObj = new Image();
    imageObj.src = "./pac.png";

    let keyclick = {};

    function overlap(targ) {
        if (targ.x >= canvas.width) { targ.x = 0 }
        if (targ.y >= canvas.height) { targ.y = 0 }
        if (targ.x < 0) { targ.x = canvas.width }
        if (targ.y < 0) { targ.y = canvas.height }
    }

    //usable functions
    function move(keyclick) {
        if (37 in keyclick) { player.x -= player.speed; player.pacDir = 64; }
        if (38 in keyclick) { player.y -= player.speed; player.pacDir = 96; }
        if (39 in keyclick) { player.x += player.speed; player.pacDir = 0; }
        if (40 in keyclick) { player.y += player.speed; player.pacDir = 32; }

        overlap(player);

        //player mouth movement
        // if (player.pacSpecies == 320) { player.pacSpecies = 352; } else { player.pacSpecies = 320; }
        (player.pacSpecies == 320) ? player.pacSpecies = 352 : player.pacSpecies = 320;
    }

    //generates ranodom number
    function ran(num) {
        return Math.floor(Math.random() * num);
    }

    //blinking eyes

    function blinking() { if (phantom.weak == false) { setTimeout(() => { return phantom.Dir = 32 * ran(4); }, 400); } }

    //event listeners

    document.addEventListener("keydown", function (e) {
        keyclick[e.keyCode] = true;
        move(keyclick);
        // console.log(keyclick);
    }, false);

    document.addEventListener("keyup", function (e) {
        delete keyclick[e.keyCode];
    }, false);


    if (!powerDot.ex) {
        powerDot.x = ran(560) + 25;
        powerDot.y = ran(560) + 25;
        powerDot.ex = true;
    }

    let dirHV = ran(7);
    let dirEW = ran(5);

    setInterval(() => {
        dirHV = ran(7);
        dirEW = ran(5);
    }, 900);

    //creating canvas enviroment

    let play = function () {
        //winning screen
        if (score >= 3) {
            canvas.style.display = "none";
            return y.style.display = "block";
        }

        context.fillStyle = "gray";
        context.fillRect(0, 0, canvas.width, canvas.height);

        //pac-man
        context.drawImage(imageObj, player.pacSpecies, player.pacDir, 32, 32, player.x, player.y, player.pacSize, player.pacSize);
        //first ghost
        context.drawImage(imageObj, phantom.species, phantom.Dir, 32, 32, phantom.x, phantom.y, 32, 32);

        eyeM(phantom);

        blinkG(phantom, 32 * ghostNr);

        colis(phantom);

        overlap(phantom);

        moveD(dirHV, dirEW, phantom);
        //experimental ghost
        for (let i = 1; i <= level; i++) {

            context.drawImage(imageObj, enemies[`phantom${i}`].species, enemies[`phantom${i}`].Dir, 32, 32, enemies[`phantom${i}`].x, enemies[`phantom${i}`].y, 32, 32);

            eyeM(enemies[`phantom${i}`]);

            colis(enemies[`phantom${i}`]);

            moveD(enemies[`phantom${i}`].locX, enemies[`phantom${i}`].locY, enemies[`phantom${i}`]);

            overlap(enemies[`phantom${i}`]);

            blinkG(enemies[`phantom${i}`], 32 * i);

        };

        function eyeM(enem) {
            if (enem.blink > 0) {
                enem.blink--
            }
            if (enem.blink == 0 && enem.weak == false) {
                enem.Dir = 32 * ran(4);
                enem.blink = 5 + ran(10);
            }
        }

        //changes enemy movement direction
        function moveD(dirx, diry, enem) {
            if (dirx % 2) {
                if (diry % 2) {
                    enem.x += enem.speed;
                } else { enem.x -= enem.speed; }
            } else {
                if (diry % 2) {
                    enem.y += enem.speed;
                } else { enem.y -= enem.speed; }
            }
        }

        //creates powerDot
        if (powerDot.ex) {
            context.fillStyle = "#fff";
            context.beginPath();
            context.arc(powerDot.x, powerDot.y, 10, 0, 2 * Math.PI);
            context.closePath();
            context.fill();
        }

        //powerup colision detection v2.0

        // true shit
        if (player.x <= powerDot.x && player.x >= powerDot.x - 35 &&
            (player.y <= powerDot.y && player.y >= powerDot.y - 35) && powerDot.ex) {
            powerDot.ex = false;
            phantom.weak = true;

            //work in progress
            for (let i = 1; i <= level; i++) {
                console.log(enemies[`phantom${i}`].weak);
                enemies[`phantom${i}`].weak = true;
                console.log(enemies[`phantom${i}`].weak);
            }

            if (!powerDot.ex) {
                for (let i = 1; i <= level; i++) {
                    enemies[`phantom${i}`].species = enemy6.species;
                    enemies[`phantom${i}`].Dir = 32;
                }
                phantom.species = enemy6.species;
                phantom.Dir = 32;
            }
            setTimeout(() => {
                powerDot.ex = true;
                phantom.weak = false;
                for (let i = 1; i <= level; i++) {
                    enemies[`phantom${i}`].weak = false;
                }
            }, 6500);

            console.log("good job !!");
        }

        //ghost is scared ;)
        function blinkG(ghos, spec) {
            if (ghos.species == 384 && ghos.Dir == 32 && !powerDot.ex && ghos.weak) {
                ghos.Dir = 0;
            } else if (ghos.species == 384 && ghos.Dir == 0 && !powerDot.ex) {
                // setTimeout(() => {
                ghos.Dir = 32;
                // }, 100);
            } else {
                ghos.weak = false;
                ghos.species = spec;
            }
        }


        function colis(enem) {
            if (player.x <= (enem.x + 26) && enem.x <= (player.x + 26) && player.y <= (enem.y + 26) && enem.y <= (player.y + 26)) {
                console.log('ghost');
                if (!powerDot.ex) {
                    score++;
                    level++
                    console.log(level);
                } else {
                    scorE++;
                    if (level > 0) {
                        level--;
                    }
                }
                player.x = 50;
                player.y = 100;
                enem.x = ran(5) * 120;
                enem.y = ran(5) * 120;
                enem.weak = false;
            }
        }

        context.font = "20px Verdana";
        context.fillStyle = "black";

        context.fillText(`Pacman: ${score} vs Ghosts: ${scorE} LEVEL: ${level}`, 20, 25);

        setTimeout(() => {
            requestAnimationFrame(play);
        }, 60);

    }

    //this is how you can start the game
    let mial = document.querySelector('button');
    mial.addEventListener('click', play, false);
    mial.addEventListener('click', function () {
        mial.style.display = "none";
    });

})();

// document.addEventListener('keydown',function(e){
//     console.log(e);
// });
// document.addEventListener('keypress',function(e){
//     console.log(e);
// });

//redefine powerUp colision logic!

//add movement

//refine movement in the game
//add aditonal ghost state
//style the site
// refine photoshop skills to edit graphics --

//Git
//node.js <- WEBPACK! <- babel <- ES6 <- modules ~ ewentualnie rozpisz ładnie ;P

//callback ~ promise usage

//Javascript -> ES6 -> Angular

//HTML/CSS <- flex <- build your portfolio site
