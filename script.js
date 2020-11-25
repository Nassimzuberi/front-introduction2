


// Créer une div
function createDiv (classN,container = null) {
    var maDiv = document.createElement("div");
    maDiv.classList.add(classN);
    container && container.appendChild(maDiv)
    return maDiv
}
//SHOW / Hide
function show (card,child = false) {
    if(child) {
        card.classList.add("rotate")
        card.children[1].hidden = false;
        card.children[0].hidden = true;
    } else {
        card.style.display = "block"
    }
}

function hide (card,child = false) {
    if(child) {
        card.classList.remove('rotate')
        card.children[0].hidden = false;
        card.children[1].hidden = true;
    } else {
        card.style.display = "none"
    }
}

// Mélange le tableau
function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}



// INITIALISATION
var menu = document.getElementsByClassName("menu")[0]
var cartes = document.getElementsByClassName("game")[0]
var winpanel = document.getElementsByClassName("winpanel")[0]
var array = []
var game = [];
var progressbar
var pairFound = 0;
var time = 90000;
var level = 1

// AU CLIQUE DU BOUTON LA PARTIE COMMENCE
document.getElementById("btn-play").onclick = () => {
    show(cartes);
    hide(menu);
    //La partie commence
    initialisation()
}

const btnHard = document.getElementById("btn-hard")
const btnEasy = document.getElementById("btn-easy")

// Pour choisir la difficulté hard
btnHard.onclick = () => {
    btnHard.classList.add("hard-active");
    btnEasy.classList.remove("easy-active");
    level = 2;
    time = 120000;
}
// Pour choisir la difficulté easy

btnEasy.onclick = () => {
    btnEasy.classList.add("easy-active");
    btnHard.classList.remove("hard-active");
    level = 1;
    time = 90000;
}
// Au clique de la carte, elle s'affiche
function initialisation () {
    // Initialisation du tableau
    var max = 0
    level == 1 ?  max = 28 : max = 34;
    for (i = 0; i < max; i++) {
        const maDiv = createDiv("carte")
        createDiv("cache",maDiv)
        const image = createDiv("image",maDiv)
        image.hidden = true
        image.style.background = "url('images/cards.png')"
        image.style.backgroundPosition = "0 -" + Math.floor(i/2)*100 + "px"
        array.push(maDiv);
    }

    //Mélange le tabeau
    shuffle(array)

    // AFFICHE LE TABLEAU
    array.map( t => document.getElementsByClassName("cartes")[0].appendChild(t))

    //Initialise les clicks
    clickEnabled()

    // Initialise la progress bar
    progress(time)
    function clickEnabled () {
        Array.from(document.getElementsByClassName('carte')).map( t =>{
            t.onclick = () => {
                if(t.children[1].hidden == true){
                    show(t,true)
                    game.push(t)
                    //SI deux cliques
                    if(game.length == 2) {
                        // Si ce n'est pas les bonnes paires
                        if (game[0].children[1].style.backgroundPosition != game[1].children[1].style.backgroundPosition){
                            //Désactive le clique
                            clickDisabled()
                            //Cache les cartes au bout d'une seconde
                            setTimeout(() => {
                                hide(game[0],true);
                                hide(game[1],true);
                                clickEnabled();
                            },1000)
                        } else {
                            pairFound += 1 ;
                            console.log(pairFound)
                            max = level == 1 ? 28 : 34
                            pairFound == max ? win() : false ;
                        }

                        // Vide le tableau
                        setTimeout(() => {
                            game.splice(0,2);
                        },1000)
                    }
                }
            }
        } )


        function clickDisabled () {
            Array.from(document.getElementsByClassName('carte')).map( t =>{
                t.onclick = false
            })
        }
    }
    function progress(time) {
        var timer = document.getElementsByClassName("progress-bar")[0].children[0]
        var width = 0
        progressbar = setInterval(() => {
            width += 100/(time/100) ;
            timer.style.width = width + "%";
            width > 50 ? timer.style.background = "orange" : "";
            width > 75 ? timer.style.background = "red" : "";
            if( width > 100) {
                clearInterval(progressbar);
                lose();
            }},100)

    }
}
function lose () {
    winpanel.innerHTML = "Vous avez perdu"
    show(winpanel)
    setTimeout(() => {
        hide(winpanel)
        show(menu)
        hide(cartes)
        reset()
    },2000)
}

function win() {
    clearTimeout(progressbar)
    winpanel.innerHTML = "Bravo tu as gagné"
        show(winpanel)
    setTimeout(() => {
        hide(winpanel)
        show(menu)
        hide(cartes)
        reset()
    },2000)

}

function reset () {
    Array.from(document.getElementsByClassName("carte")).map( t => {
        hide(t,true);
    })
    pairFound = 0;
    winpanel.innerHTML = "";
    var timer = document.getElementsByClassName("progress-bar")[0].children[0];
    timer.style.width = 0;
    cartes.children[0].innerHTML = "";
    array = [];
    timer.style.background = "green";

}




