var CODE_TOUCHE_GAUCHE = 37;
var CODE_TOUCHE_DROITE = 39;
var CODE_TOUCHE_HAUT = 38;
var CODE_TOUCHE_BAS = 40;
var ALLER_GAUCHE = false;
var ALLER_DROITE = false;
var ALLER_HAUT = false;
var ALLER_BAS = false;
var timer;
var joueur;
var window;
var compte;
var document;
var num_question;
var requestAnimId;
var reponses = new Array();
var questions = new Array();

var fond_jeu = new Image();
fond_jeu.src = 'img/fond.svg';
var fond_score = new Image();
fond_score.src = 'img/fondscore.svg';

var canvasFondContext;
var canvasPersoContext;
var canvasQuestionContext;
var Fondlargeur = 1024;
var Fondhauteur = 768;
var couleurFond = "#000000";

var perso = function (Fondlargeur) {
    "use strict";
    this.hauteur = 100;
    this.largeur = 100;
    this.positionX = Fondlargeur/2 - this.hauteur/2;
    this.positionY = Fondhauteur/2;
    this.positionFinal = 0;
    this.image = new Image();
    this.image.src = 'img/abeille.svg';

    this.dessiner = function () {
        canvasFondContext.drawImage(this.image, this.positionX, this.positionY, this.largeur, this.hauteur);
    };

    this.animer = function () {
            if (ALLER_HAUT){
                    this.positionX = 500;
                    this.positionY = 300;
                    this.positionFinal = 1; //haut
            }
            else if (ALLER_DROITE){
                    this.positionX = 750;
                    this.positionY = 450;
                    this.positionFinal = 2; //droite
            }
            else if (ALLER_BAS){
                    this.positionX = 500;
                    this.positionY = 600;
                    this.positionFinal = 3; //bas
            }
            else if (ALLER_GAUCHE){
                    this.positionX = 250;
                    this.positionY = 450;
                    this.positionFinal = 4; //gauche
            }
    };
};

var Question = function (question, bonne_reponse, reponses_possible) {
    "use strict";
    var i;
    var len;
    this.question = question;
    this.posXQuestion = 300;
    this.posYQuestion = 50;
    this.couleurQuestion = '#000033';
    this.bonne_reponse = bonne_reponse;
    this.reponses_possible = reponses_possible;

    this.dessiner = function () {
        "use strict";
        canvasFondContext.font = '25pt serif';
        canvasFondContext.fillStyle = this.couleurQuestion;
        var lenQ = this.question.length
        canvasFondContext.fillText (this.question, this.posXQuestion - lenQ - 100, this.posYQuestion + 120);
        for(i = 1 ; i < 5 ; i++) {
            len = this.reponses_possible.get(i)[0].length
            canvasFondContext.fillText (this.reponses_possible.get(i)[0], this.reponses_possible.get(i)[1][0], this.reponses_possible.get(i)[1][1]);
        }
    }
};

var creerCanvasContext = function (name, width, height, zindex, color) {
        "use strict";
        var canvas = window.document.createElement("canvas");
        canvas.id = name;
        canvas.style.position = "absolute";
        canvas.style.left = "18%";
        canvas.style.border = "solid";
        if ( color !== undefined ){
                canvas.style.background = color;
        }
        canvas.style.zIndex = zindex;
        canvas.width = width;
        canvas.height = height;
        document.body.appendChild(canvas);
        return canvas.getContext('2d');
};

var effacer_canvas = function () {
        "use strict";
        canvasQuestionContext.clearRect( 0, 0 , Fondlargeur , Fondhauteur );
        canvasPersoContext.clearRect( 0, 0 , Fondlargeur , Fondhauteur );
        canvasFondContext.clearRect( 0, 0 , Fondlargeur , Fondhauteur );
};

var HashTable = function (obj) {
    this.length = 0;
    this.items = {};
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            this.items[p] = obj[p];
            this.length++;
        }
    }
}

var affichageScore = function () {
    effacer_canvas();
    canvasFondContext.drawImage(fond_score, 0, 0, 1024, 768);
    reponses = new Map(reponses)
    canvasFondContext.fillText ("Vos réponses", 120, 100);
    canvasFondContext.fillText ("Bonne réponses", 440, 100);
    canvasFondContext.fillStyle
    for(i = 0 ; i < 5 ; i++) {
        canvasFondContext.fillStyle = "#EEEEEE"; // blanc
        canvasFondContext.fillText (questions[i].question, 150, 150 + i * 80);

        if (this.reponses.get(i) == 0){
            canvasFondContext.fillStyle = "#E62E00"; // rouge
            canvasFondContext.fillText ("Aucune réponse", 150, 150 + i * 80 + 40);
        } else {

            if (questions[i].reponses_possible.get(this.reponses.get(i))[0] == questions[i].reponses_possible.get(questions[i].bonne_reponse)[0]) {
                canvasFondContext.fillStyle = '#00E600'; // vert
            } else {
                canvasFondContext.fillStyle = "#E62E00"; // rouge
            }
            canvasFondContext.fillText (questions[i].reponses_possible.get(this.reponses.get(i))[0], 150, 150 + i * 80 + 40);
        }
        canvasFondContext.fillStyle = '#000033'; // noir
        canvasFondContext.fillText (questions[i].reponses_possible.get(questions[i].bonne_reponse)[0], 500, 150 + i * 80 + 40);
    }
    canvasPerso.addEventListener('click', onClick(), false);
    canvasPersoContext.font = '25pt serif';
    canvasPersoContext.fillStyle = '#FFFFFF';
    canvasPersoContext.fillText ('Rejouer ?', 450, 580);
}

var onClick = function () {
        "use strict";
        var elem = document.getElementById('canvasPerso'), elemLeft = elem.offsetLeft, elemTop = elem.offsetTop, context = elem.getContext('2d'), elements = [];

        // Add event listener for `click` events.
        elem.addEventListener('click', function (event) {
                var x = event.pageX - elemLeft, y = event.pageY - elemTop;

                // Collision detection between clicked offset and element.
                elements.forEach(function (element) {
                        if (y > element.top && y < element.top + element.height && x > element.left && x < element.left + element.width) {
                                window.location.replace("index.html");
                        }
                });
        }, false);

        // Add element.
        elements.push({ colour: '#000000', width: 180, height: 50, top: 545, left: 440 });

        // Render elements.
        elements.forEach(function (element) {
        context.fillStyle = element.colour;
        context.fillRect(element.left, element.top, element.width, element.height);
        });
};

var initialisation = function () {
        "use strict";
        num_question = 0;
        compte = 0;
        timer = 10;
        joueur = new perso(Fondlargeur);
        var questionUn = new Map([[1, ["2", [500, 300]]], [2, ["4", [750, 450]]], [3, ["6", [500, 600]]], [4, ["8", [250, 450]]]]);
        var questionDeux = new Map([[1, ["25", [500, 300]]], [2, ["30", [750, 450]]], [3, ["35", [500, 600]]], [4, ["40", [250, 450]]]]);
        var questionTrois = new Map([[1, ["500", [500, 300]]], [2, ["1000", [750, 450]]], [3, ["1500", [500, 600]]], [4, ["2000", [250, 450]]]]);
        var questionQuatre = new Map([[1, ["Accouveur", [500, 300]]], [2, ["Aquaculteur", [750, 450]]], [3, ["Conchyliculteur", [500, 600]]], [4, ["Apiculteur", [250, 450]]]]);
        var questionCinq = new Map([[1, ["Apodiea", [500, 300]]], [2, ["Hétéroptères", [750, 450]]], [3, ["Homoptères", [500, 600]]], [4, ["Orthoptères", [250, 450]]]]);

        questions.push(new Question("Combien d'ailes possède une abeille ?", 2, questionUn));
        questions.push(new Question("Quel est la température requise dans la rûche ?", 3, questionDeux));
        questions.push(new Question("Combien une reine pond d'oeufs par jour ?", 3, questionTrois));
        questions.push(new Question("Quel est le metier d'un éleveur d'abeille ?", 4, questionQuatre));
        questions.push(new Question("De quel grande famille font partie les abeilles ?", 1, questionCinq));

        canvasQuestionContext = creerCanvasContext("canvasCode", Fondlargeur, Fondhauteur, 1);
        canvasFondContext = creerCanvasContext("canvasFond", Fondlargeur, Fondhauteur, 3);
        canvasFondContext.drawImage(fond_jeu, 0, 0);
        canvasPersoContext = creerCanvasContext("canvasPerso", Fondlargeur, Fondhauteur, 4);
        requestAnimId = window.requestAnimationFrame(principale);
};

var principale = function () {
    "use strict";
    effacer_canvas();
    canvasFondContext.drawImage(fond_jeu, 0, 0, 1024, 768);
    joueur.dessiner()
    joueur.animer()
    if (compte == 60){
        compte = 0;
        timer --;
    }
    else if (timer <= 0){
        timer = 10;
        reponses.push([num_question, joueur.positionFinal]);
        joueur.positionFinal = 0;
        num_question ++;
        if (num_question == 5){
            requestAnimId = window.requestAnimationFrame(affichageScore);
        }
        joueur.positionX = Fondlargeur/2 - joueur.hauteur/2;
        joueur.positionY = Fondhauteur/2;
    }
    canvasFondContext.fillText(timer, 100, 100);
    questions[num_question].dessiner();
    compte ++;
    requestAnimId = window.requestAnimationFrame(principale);
};

var onKeyDown = function (event) {
    "use strict";
    if (event.keyCode == CODE_TOUCHE_GAUCHE) {
        ALLER_GAUCHE = true;
    } else if (event.keyCode == CODE_TOUCHE_DROITE) {
        ALLER_DROITE = true;
    } else if (event.keyCode == CODE_TOUCHE_HAUT) {
        ALLER_HAUT = true;
    } else if (event.keyCode == CODE_TOUCHE_BAS) {
        ALLER_BAS = true;
    }
};

var onKeyUp = function (event) {
    "use strict";
    if (event.keyCode == CODE_TOUCHE_GAUCHE) {
        ALLER_GAUCHE = false;
    } else if (event.keyCode == CODE_TOUCHE_DROITE) {
        ALLER_DROITE = false;
    } else if (event.keyCode == CODE_TOUCHE_HAUT) {
        ALLER_HAUT = false;
    } else if (event.keyCode == CODE_TOUCHE_BAS) {
        ALLER_BAS = false;
    }
};

window.onkeydown = onKeyDown;
window.onkeyup = onKeyUp;
window.onload = initialisation;
