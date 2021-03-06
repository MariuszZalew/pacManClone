// var element = document.getElementById('element');

// function ran(num) {
//     return Math.floor(Math.random() * num);
// }

// setInterval(function () {
//     element.innerText = ran(5);
// }, 800);

'use strict';
(function () {
    //variables
    let scorE = 0,
        score = 0,
        level = 1;

    let grau = document.querySelector('.kut'),
        x = document.getElementById("pac-man");

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

    function Ghast(x = ran(400) + 150, y = ran(400) + 150, species = ran(5) * 64, Dir = 0, speed = 10, blink = ran(15) + 5) {
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

    // let maxLev = prompt("ile chcesz zagrać leveli? ^^");
    // for(let i = 0 ; i <= maxLev ;i++ ) {
    //     function () {
    //     }
    // }
    
    // let enemies = {
    //     phantom1: new Ghast(),
    //     phantom2: new Ghast(),
    //     phantom3: new Ghast(),
    //     phantom4: new Ghast(),
    //     phantom5: new Ghast(),
    // }
    let enemies = [];
    for ( let i = 0, maxLev = 7; i <= maxLev; i++ ) {
        enemies.push(new Ghast());
    };
        
    //old version of ghosts
    let enemy1 = {}, 
        enemy2 = {}, 
        enemy3 = {}, 
        enemy4 = {}, 
        enemy5 = {}, 
        enemy6 = {};

    let enemy = [  enemy1 = {
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
            x: 300,
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
            y: 180,
            species: 192,
            Dir: 0,
            speed: 10,
            dirx: 0,
            diry: 0
        },
        enemy5 =
        {
            x: 350,
            y: 400,
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
    imageObj.src = "./image/pac.png";

    let keyclick = {};

    function overlap(targ) {

        if (targ.x >= canvas.width) { targ.x = 0 }
        if (targ.y >= canvas.height) { targ.y = 0 }
        if (targ.x < 0) { targ.x = canvas.width }
        if (targ.y < 0) { targ.y = canvas.height }
    }

    //usable functions
    function move() {
        if ( keyclick["37"] == true) { player.x -= player.speed; player.pacDir = 64;}
        else if  (keyclick["38"] == true) { player.y -= player.speed; player.pacDir = 96;}
        else if ( keyclick["39"] == true) { player.x += player.speed; player.pacDir = 0;}
        else if ( keyclick["40"] == true) { player.y += player.speed; player.pacDir = 32;}

        overlap(player);

        //player mouth movement
        (player.pacSpecies == 320) ? setTimeout( () => {player.pacSpecies = 352;} ,350) : player.pacSpecies = 320;
    }

    //generates ranodom number
    function ran(num) {
        return Math.floor(Math.random() * num);
    }

    //event listeners

    document.addEventListener("keydown", function (e) {
        for (let key in keyclick) {
                delete keyclick[key];
        }
        keyclick[e.keyCode] = true;

        console.log(keyclick);
    }, false);

    // document.addEventListener("keyup", function (e) {
    //     keyclick[e.keyCode] = false;
    // }, false);

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

    //creating canvas enviroment !important
    let lastLev = 6;
    let play = function () {

        //winning screen!

        if (level >= lastLev) {
            canvas.style.display = "none";
            
            grau.style.display = "flex";
        }

        context.fillStyle = "gray";
        context.fillRect(0, 0, canvas.width, canvas.height);

        //pac-man
        context.drawImage(imageObj, player.pacSpecies, player.pacDir, 32, 32, player.x, player.y, player.pacSize, player.pacSize);

        move();
        //first ghost
        context.drawImage(imageObj, phantom.species, phantom.Dir, 32, 32, phantom.x, phantom.y, 32, 32);

        eyeM(phantom);

        blinkG(phantom, 32 * ghostNr);

        colis(phantom);

        overlap(phantom);

        moveD(dirHV, dirEW, phantom);
        //experimental ghost
        for (let i = 1; i <= level; i++) {

            // context.drawImage(imageObj, enemies[`phantom${i}`].species, enemies[`phantom${i}`].Dir, 32, 32, enemies[`phantom${i}`].x, enemies[`phantom${i}`].y, 32, 32);
            context.drawImage(imageObj, enemies[i-1].species, enemies[i-1].Dir, 32, 32, enemies[i-1].x, enemies[i-1].y, 32, 32);
            // eyeM(enemies[`phantom${i}`]);
            eyeM(enemies[i-1]);
            // colis(enemies[`phantom${i}`]);
            colis(enemies[i-1]);
            // moveD(enemies[`phantom${i}`].locX, enemies[`phantom${i}`].locY, enemies[`phantom${i}`]);
            moveD(enemies[i-1].locX, enemies[i-1].locY, enemies[i-1]);
            // overlap(enemies[`phantom${i}`]);
            overlap(enemies[i-1]);
            // blinkG(enemies[`phantom${i}`], 32 * i);
            blinkG(enemies[i-1], 32 * i);
        };
        //eyes movement on enemy
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
                diry % 2 ? enem.x += enem.speed : enem.x -= enem.speed;
            } else {
                diry % 2 ? enem.y += enem.speed : enem.y -= enem.speed;
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

        if (player.x <= powerDot.x && player.x >= powerDot.x - 35 &&
            (player.y <= powerDot.y && player.y >= powerDot.y - 35) && powerDot.ex) {
            powerDot.ex = false;
            phantom.weak = true;
            player.speed += 4;
            //work in progress
            for (let i = 1; i <= level; i++) {
                // enemies[`phantom${i}`].weak = true;
                enemies[i-1].weak = true;
            }

            if (!powerDot.ex) {
                for (let i = 1; i <= level; i++) {
                    enemies[i-1].species = enemy6.species;
                    enemies[i-1].Dir = 32;
                }
                phantom.species = enemy6.species;
                phantom.Dir = 32;
            }
            setTimeout(() => {
                powerDot.ex = true;
                phantom.weak = false;
                player.speed = 8;
                for (let i = 1; i <= level; i++) {
                    enemies[i-1].weak = false;
                }
            }, 6500);
        }

        //enemy colision detection

        function colis(enem) {
            if (player.x <= (enem.x + 26) && enem.x <= (player.x + 26) && player.y <= (enem.y + 26) && enem.y <= (player.y + 26)) {
                console.log('ghost');
                if (!powerDot.ex && phantom.weak == true) {
                    score++;
                    level++
                    player.speed = 8;
                    //experimental bug fix
                    phantom.weak = false;
                    for (let i = 1; i <= level; i++) {
                        enemies[i-1].weak = false;
                    }

                    console.log(level);
                } else {
                    scorE++;
                    player.speed = 8;
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

        //ghost is scared and blinks
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

        context.font = "20px Verdana";
        context.fillStyle = "black";

        context.fillText(`Pacman: ${score} vs Ghosts: ${scorE} LEVEL: ${level}`, 20, 25);

        setTimeout(() => {
            requestAnimationFrame(play);
        }, 60);

    }

    //this is how you can start the game

    let buttons = document.querySelectorAll('.button1'),
        allButton = document.querySelector('.buttons');
    //dificulity buttons
    buttons[0].addEventListener('click',function(){
        lastLev = 2;
        play();
        allButton.style.display = "none";
    });

    buttons[1].addEventListener('click',function(){
        lastLev = 4;
        play();
        allButton.style.display = "none";
    });

    buttons[2].addEventListener('click',function(){
        lastLev = 6;
        play();
        allButton.style.display = "none";
    });

    let mial = document.querySelector('.but > button');

    mial.addEventListener('click', play, false);
    mial.addEventListener('click', function () {
        mial.style.display = "none";
    });
    //first button not displayed
    mial.style.display = "none";
})();

// elem == #win 
//experimental code

// document.addEventListener('keydown',function(e){
//     console.log(e);
// });


