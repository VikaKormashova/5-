let flying_nlo = {
    x: 600,
    y: 400,
    width: 250,
    height: 100,
    color_1: '#AFF0F0',
    color_2: '#969696',

    draw_signal: function() {
        fill(255);
        for (let i = 0; i < 10; i++)
            circle(this.x - this.width / 2 + i * 27, this.y, 10);
    },

    change_pos: function(direction) {
        this.x += direction;
    },

    draw_fly: function() {
        fill(this.color_1);
        arc(this.x, this.y - this.height / 2, this.width / 2, this.height, PI, TWO_PI);
        fill(this.color_2);
        arc(this.x, this.y, this.width, this.height + 10, PI, TWO_PI);
        fill(50);
        arc(this.x, this.y, this.width, this.height / 2, 0, PI);
        this.draw_signal();
    },

    beam: function() {
        fill(255, 255, 100, 150);
        beginShape();
        vertex(this.x - this.width / 8, this.y + 10);
        vertex(this.x + this.width / 8, this.y + 10);
        vertex(this.x + this.width / 4, height - 100);
        vertex(this.x - this.width / 4, height - 100);
        endShape(CLOSE); // Закрываем форму, чтобы создать луч
    }
};

let cows = [];
let cowManager;
let caughtCowsCount = 0; // Счетчик пойманных коров

function Cow(x, y, direction) {
    this.x = x;
    this.y = y;
    this.direction = direction;

    this.walk = function() {
        this.x += this.direction;
    }

    this.draw = function() {
        push();
        translate(this.x, this.y);
        if (this.direction > 0) {
            scale(-1, 1);
        }

        fill(255, 250, 250);
        rect(0, -10, 10, 5);
        rect(0, -5, 2, 5);
        rect(8, -5, 2, 5);
        rect(-4, -12, 4, 4);

        fill(0);
        rect(4, -9, 3, 3);
        rect(6, -10, 2, 2);

        pop();
    }

    this.isCaught = function() {
        // Проверка на пересечение коровы и луча
        let beamBottom = height - 100;
        let beamTop = this.y; // верхняя граница коровы
        let beamLeft = flying_nlo.x - flying_nlo.width / 4; // левая граница луча
        let beamRight = flying_nlo.x + flying_nlo.width / 4; // правая граница луча

        return beamBottom >= beamTop && beamBottom <= beamTop + 10 && 
               this.x >= beamLeft && this.x <= beamRight;
    }
}

function CowManager() {
    this.countCows = 10;

    this.update = function() {
        // Удаляем пойманные коровы
        cows = cows.filter(cow => !cow.isCaught());

        // Если больше коров, чем задано, удаляем лишние
        // Не нужно, так как мы динамически управляем количеством коров ниже.
        while (cows.length < this.countCows) {
            cows.push(new Cow(random(0, width), height - 110, random(-1, 1)));
        }

        for (let i = 0; i < cows.length; i++) {
            cows[i].walk();

            // Возвращаем корову на другой край экрана если она вышла за границы
            if (cows[i].x > width + 100) {
                cows[i].x = 0;
            } else if (cows[i].x < -100) {
                cows[i].x = width;
            }
        }
    }

    this.draw = function() {
        for (let i = 0; i < cows.length; i++) {
            cows[i].draw();
        }
    }

    this.getCowCount = function() {
        return cows.length;
    }

    this.setCowCount = function(count) {
        this.countCows = count;
    }

    return this;
}

function setup() {
    createCanvas(1000, 1000);
    frameRate(20);
    noStroke();
    cowManager = new CowManager();
}

function draw() {
    background(50, 100, 80);

    cowManager.update();
    cowManager.draw();

    fill(0, 50, 0);
    rect(0, height - 100, width, 100);

    flying_nlo.draw_fly();
    flying_nlo.beam();

    // Движение НЛО
    if (keyIsDown(LEFT_ARROW)) {
        flying_nlo.change_pos(-4);
    }
    if (keyIsDown(RIGHT_ARROW)) {
        flying_nlo.change_pos(4);
    }

    // Проверка ловли коров с помощью пробела
    if (keyIsDown(32)) { // Код клавиши пробел - 32
        for (let i = cows.length - 1; i >= 0; i--) {
            if (cows[i].isCaught()) {
                cows.splice(i, 1); // Удаляем пойманную корову
                caughtCowsCount++; // Увеличиваем счетчик пойманных коров
            }
        }
    }

    // Отображение счетчиков
    fill(255);
    textSize(24);
    textAlign(LEFT, TOP);
    text("Количество коров: " + cowManager.getCowCount(), 10, 10);
    text("Пойманные коровы: " + caughtCowsCount, 10, 40);
}
