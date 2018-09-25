

/* Declare and Initialze Global Variable */

var g_gameStarted = false;
var g_totalGameSessions = 0;
var g_winCount = 0;
var g_lostCount = 0;
var g_numOfAttempsMade = 0;
var g_chosenWord = "";
var g_currentGuessedWord = [];
var g_charsLeft2BeGuessed;
var g_LettersAlreadyPressed = [];
var g_user_won = false;

const MAX_ATTEMPTS_ALLOWED = 10;
const CHAR_DISPLAY_SYMBOL = '_';
const GAME_IN_PROGRESS_STRING = "Game In Progress";
const GAMES_PLAYED_STRING = "Games Played ";
const GAME_NOT_IN_PROGRESS_MSG_STRING = "PRESS ANY KEY TO GET STARTED...";
const GAME_IN_PROGRESS_MSG_STRING = "";
const ALPHABET_A_CODE = 65;
const ALPHABET_Z_CODE = 90;
const ALPHABET_a_CODE = 97;
const ALPHABET_z_CODE = 122;
const USER_WON_STRING = "YOU WON!"
const USER_LOST_STRING = "YOU  LOST!"



function module_init() {
    g_numOfAttempsMade = 0;
    g_currentGuessedWord = [];
    g_LettersAlreadyPressed = [];
    g_gameStarted = false;
    g_user_won = false;

    updateLettesAlreadyPressedField();

    /**
     * Update the Game In Progress Message
     */
    var gameStatusId = document.getElementById("game-status-id");
    gameStatusId.textContent = GAMES_PLAYED_STRING;

    /**
    * Update the Game Sesssion Number
    */
    var gameSessionId = document.getElementById('game-session-id');
    gameSessionId.textContent = g_totalGameSessions;

    /**
    * Update the Game Started Msg String
    */
    var gameSessionMsgId = document.getElementById('game-session-msg');
    gameSessionMsgId.textContent = GAME_NOT_IN_PROGRESS_MSG_STRING;


    updateCurrentGameStatsCard();

}


function updateGameSessionCard() {

    /**
     * Update the Game In Progress Message
     */
    var gameStatusId = document.getElementById("game-status-id");
    gameStatusId.textContent = GAME_IN_PROGRESS_STRING;

    /**
     * Update the Game Sesssion Number
     */
    var gameSessionId = document.getElementById('game-session-id');
    gameSessionId.textContent = g_totalGameSessions;

    /**
     *  Update the Chosen word field
     */
    var wordDisplayId = document.getElementById('current-Word-display');
    var word2display = "";

    for (var i = 0; i < g_currentGuessedWord.length; i++) {
        word2display += (g_currentGuessedWord[i] + ' ');
    }

    wordDisplayId.textContent = word2display;

}

function updateCurrentGameStatsCard() {

    /**
     *  Update attempts made and attemps remaining fields
     */
    var numOfAttemptsMadeDiv = document.getElementById('num-of-attemps-made');
    numOfAttemptsMadeDiv.textContent = g_numOfAttempsMade;

    var numOfAttemptsRemainingDiv = document.getElementById('num-of-attemps-remaining');
    numOfAttemptsRemainingDiv.textContent = MAX_ATTEMPTS_ALLOWED - g_numOfAttempsMade;

}

function updateLettesAlreadyPressedField() {


    /**
     *  Update attempts made and attemps remaining fields
     */
    var lettersAlreadyPressedId = document.getElementById('letters-already-pressed');
    var word2Display = "";

    for (var i = 0; i < g_LettersAlreadyPressed.length; i++) {
        word2Display += (g_LettersAlreadyPressed[i] + ' ');
    }

    lettersAlreadyPressedId.textContent = word2Display;


}

function isWordGuessComplete(keyPressed) {
    var return_val = false;
    var newCharsLeft2BeGuessed="";
    var myChar;
    

    keyPressed = keyPressed.toUpperCase();

    for (var i=0; i<g_charsLeft2BeGuessed.length; i++) {
        myChar = g_charsLeft2BeGuessed.charAt(i);
        if( myChar != keyPressed) {
            newCharsLeft2BeGuessed= newCharsLeft2BeGuessed.concat(myChar);
            
        }
    }
    g_charsLeft2BeGuessed = newCharsLeft2BeGuessed;

    if (g_charsLeft2BeGuessed.length == 0) {
        return_val = true;
        g_user_won = true;
    }

    return return_val;

}


window.onload = function () {

    module_init();

};


function isAlphabet(keyPressed) {

    var code = keyPressed.charCodeAt(0);
    if ((code >= ALPHABET_A_CODE && code <= ALPHABET_Z_CODE) || // upper alpha (A-Z)
        (code >= ALPHABET_a_CODE && code <= ALPHABET_z_CODE)) { // lower alpha (a-z)
        return true;
    } else {
        return false;
    }
}


/**
** When  user presses a key we start the Word Guess Game
*/
document.onkeyup = function (event) {

    var m_game_over = false;
    var key_pressed = event.key.toUpperCase();

    /* 
    ** Check if game is to be re-started
    */
    if (g_gameStarted === false) {

        g_gameStarted = true;

          // module_init();

        /**
         * Initialize new game session variables
         */
        g_numOfAttempsMade = 0;
        g_totalGameSessions++;

        /**
         *  Let Computer select the word to guess
         */
        g_chosenWord = "TEST";
        g_charsLeft2BeGuessed = g_chosenWord;


        /**
         * Fill the g_currentGuessWord with '_' for each letter of the chosen word.
         * 
         * So, if the chosen word is "TEST" after executing the for, variable
         *  g_currentGuessedWord will contain "____"
         * 
         */
        for (var i = 0; i < g_chosenWord.length; i++) {
            g_currentGuessedWord.push(CHAR_DISPLAY_SYMBOL);
        }

        /**
         * Update the Game Started Msg String
         */
        var gameSessionMsgId = document.getElementById('game-session-msg');
        gameSessionMsgId.textContent = GAME_IN_PROGRESS_MSG_STRING;



    } else {

        g_numOfAttempsMade++;
        updateCurrentGameStatsCard();

        /**
         * Check if this is a new letter guess; if so do the following:
         *   - save the letter pressed
         *   - check if the user guessed the word
         *   - update the letters pressed field on the page
         *   
         */


        if ((g_LettersAlreadyPressed.includes(key_pressed) == false) && (isAlphabet(key_pressed) == true)) {

            g_LettersAlreadyPressed.push(key_pressed);

            /**
             * Update the Letters Already Pressed Field (HTML)
             */
            updateLettesAlreadyPressedField();

            /**
             * Check if the char entered is in the Chosen Word and update the 
             * guessed word so far
             */
            for (var i = 0; i < g_chosenWord.length; i++) {
                if (g_chosenWord[i] == key_pressed) {
                    g_currentGuessedWord[i] = key_pressed;
                }
            }

            /**
             *  Is the Game Over?
             */
            if (isWordGuessComplete(key_pressed) == true) {

                m_game_over = true;
                g_winCount++;

            } else if (g_numOfAttempsMade >= MAX_ATTEMPTS_ALLOWED) {

                m_game_over = true;
                g_lostCount++;

            }



        }


    }


    if (m_game_over == true) {
        var gameResultString;
        g_gameStarted = false;


        /**
         *  Game Over Message
         */
        if(g_user_won == true) {
            gameResultString = USER_WON_STRING;
            var gameResultsID = document.getElementById('overall-wins-count');
            gameResultsID.textContent = g_winCount;

        } else {
            gameResultString = USER_LOST_STRING;
            var gameResultsID = document.getElementById('overall-loses-count');
            gameResultsID.textContent = g_lostCount;
        }

        var wordDisplayId = document.getElementById('current-Word-display');
        wordDisplayId.textContent = gameResultString;

        var gameStatusId = document.getElementById("game-status-id");
        gameStatusId.textContent = GAMES_PLAYED_STRING;

        var gameSessionMsgId = document.getElementById('game-session-msg');
        gameSessionMsgId.textContent = GAME_NOT_IN_PROGRESS_MSG_STRING;

     
    
        module_init();


    }
    else {
        /**
         * Update the Number of Attemps made and Attempts remaining
         */

        updateGameSessionCard();

        

    }



    /**
     * HTML UPDATES
     */






};

