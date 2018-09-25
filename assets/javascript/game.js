

/**
 *  G L O B A L  V A R I B L E S
 */

 // indiacates if game is Active
var g_gameInProgress = false;

// Games Played Count
var g_totalGameSessions = 0;

// number of games won count
var g_winCount = 0;

// number of games lost count
var g_lostCount = 0;

// running count of the guess made by the user in an Active game session
var g_numOfAttempsMade = 0;

// hold the word selected by the Computer for user to guess. The word is stored in UPPER CASE
var g_chosenWord = "";

//holds the current state of the user guess during a Active game session
var g_currentGuessedWord = [];

// holds the chars which are still to be guessed by the user
var g_charsLeft2BeGuessed;

// holds the list of letters already pressed by the user
var g_LettersAlreadyPressed = [];

// flag to indicate if user guessed the word correctly
var g_user_won = false;

/**
 *  This is the word list that the program picks randomly from. Program 
 *  converts the selected word to Uppercase and the uppercase version is
 *  used. The chars entered by the user are also converted to uppercase.
 *  So, the program is working on the uppercase chars and words
 */
var g_word_list = ["soar", "sweet", "jealous", "swing", "imbibe",
    "understood", "home", "pollute", "petite", "airport",
    "sordid", "shave", "stitch", "toothpaste", "suffer",
    "giraffe", "top", "meeting", "abandon", "punish",
    "ratty", "nebulous", "drag", "banana", "suck"];



/**
 *  C O N S T A N T S
 */

 // game ends after these many unsuccessfull attempts 
const MAX_ATTEMPTS_ALLOWED = 10;

// used to display the length of the computer selected word to the user
const CHAR_DISPLAY_SYMBOL = '_';

// Strings used in the program
const GAME_IN_PROGRESS_STRING = "Game In Progress";
const GAMES_PLAYED_STRING = "Games Played ";
const GAME_NOT_IN_PROGRESS_MSG_STRING = "PRESS ANY KEY TO GET STARTED...";
const BLANK_STRING = "";
const GAME_CONTINUE_PLAYING_STRING = "PRESS ANY KEY TO CONTINUE PLAYING...";
const USER_WON_STRING = "YOU WON!"
const USER_LOST_STRING = "YOU  LOST!"

// ASCII codes for letter A and Z (uppercase)
const ALPHABET_A_CODE = 65;
const ALPHABET_Z_CODE = 90;


/**
 *   F U N C T I O N S
 */


/**
 *  This function updates the letters already pressed field
 *  on the HTML page.
 * 
 *  Array g_LettersAlreadyPressed contains the letters entered
 *  by the user, so far. 
 */
function updateLettesAlreadyPressedField() {

    var lettersAlreadyPressedId = document.getElementById('letters-already-pressed');
    var word2Display = "";

    // building a string, so as to have a space between the guessed characters
    for (var i = 0; i < g_LettersAlreadyPressed.length; i++) {
        word2Display += (g_LettersAlreadyPressed[i] + ' ');
    }

    lettersAlreadyPressedId.textContent = word2Display;
}

/**
 *  This function updates attempts made and attempts remaining fields
 *  on the HTML page.
 */
function updateCurrentGameStatsCard() {

    var numOfAttemptsMadeDiv = document.getElementById('num-of-attemps-made');
    numOfAttemptsMadeDiv.textContent = g_numOfAttempsMade;

    var numOfAttemptsRemainingDiv = document.getElementById('num-of-attemps-remaining');
    numOfAttemptsRemainingDiv.textContent = MAX_ATTEMPTS_ALLOWED - g_numOfAttempsMade;

}

/**
 *  This function clears the LetterAlreadyPressed Field and 
 *  updates the area on the HTML page
 */
function clearLettersAlreadyPressedField() {

    // First Clear the array holding the letters already pressed 
    g_LettersAlreadyPressed = [];

    // update the Card Area on the HTML page where these letters are displayed
    updateLettesAlreadyPressedField();

}

/**
 *  This function clears the game attepsts field and 
 *  updates the area on the HTML page
 */

function clearGameStatsCard() {

    // clear the number of attempts made 
    g_numOfAttempsMade = 0;

    // update the game stats (cleared)
    updateCurrentGameStatsCard();
}

/**
 *  This is the game module init function. It initializes the variables and
 *  update the HTML page with initial settings/messages before the start of 
 *  the game.
 * 
 *  This function is called after the page is loaded and evertime a new game 
 *  is started.
 */
function module_init() {


    g_currentGuessedWord = [];

    g_gameInProgress = false;
    g_user_won = false;

    /**
     * Clear the Letter Already Pressed field 
     */
    clearLettersAlreadyPressedField();


    /**
     * Update the Games Played String
     */
    var gameStatusId = document.getElementById("game-status-id");
    gameStatusId.textContent = GAMES_PLAYED_STRING;

    /**
    * Update the Game Sesssion Number
    */
    var gameSessionId = document.getElementById('game-session-id');
    gameSessionId.textContent = g_totalGameSessions;

    /**
    * Update the Game Msg String
    */
    var gameSessionMsgId = document.getElementById('game-session-msg');
    if (g_totalGameSessions === 0) {
        gameSessionMsgId.textContent = GAME_NOT_IN_PROGRESS_MSG_STRING;
    } else {
        gameSessionMsgId.textContent = GAME_CONTINUE_PLAYING_STRING;
    }

    clearGameStatsCard();

}

/**
 *  This function displays the current state of the word guessed on the Main card
 */

function updateGuessedWord() {

    var wordDisplayId = document.getElementById('current-Word-display');
    var word2display = "";

    // add a space between the word chars for better readability
    for (var i = 0; i < g_currentGuessedWord.length; i++) {
        word2display += (g_currentGuessedWord[i] + ' ');
    }

    wordDisplayId.textContent = word2display;

}




/**
 * This funtion checks if the user guessed the word. 
 * 
 * @param {string} keyPressed - alphabetic key pressed by the User (converted to Uppercase)
 *     
 */
function isWordGuessComplete(keyPressed) {

    var return_val = false;
    var newCharsLeft2BeGuessed = "";
    var myChar;


    /**
     *  If the char key pressed by user is in the g_charsLeft2BeGuessed, it 
     *  is removed. At the end of this function g_charsLeft2BeGuessed will have 
     *  only the chars which user still need to guess.
     */
    for (var i = 0; i < g_charsLeft2BeGuessed.length; i++) {
        myChar = g_charsLeft2BeGuessed.charAt(i);
        if (myChar != keyPressed) {
            newCharsLeft2BeGuessed = newCharsLeft2BeGuessed.concat(myChar);
        }
    }

    g_charsLeft2BeGuessed = newCharsLeft2BeGuessed;

    /**
     * Check if there are no more chars left to be guessed, ie user
     * has correctly guessed the word
     */
    if (g_charsLeft2BeGuessed.length == 0) {
        return_val = true;
        g_user_won = true;
    }

    return return_val;

}



/**
 * This function is called when the HTML page is loaded. This gives us the opportunity
 * to initialize the screen at set up the things, before any user interaction.
 */
window.onload = function () {

    // initialize variables and set up the page with initial default messages
    module_init();

};

/**
 * This function validates if the key pressed by the user is a valid key
 * @param {String} keyPressed  -  key pressed by the user(converted to upper case)
 */
function isAlphabet(keyPressed) {

    var code = keyPressed.charCodeAt(0);

   // upper alpha (A-Z)
    if (code >= ALPHABET_A_CODE && code <= ALPHABET_Z_CODE) {
        return true;
    } else {
        return false;
    }
}


/**
** When user presses a key we start the Word Guess Game
*/
document.onkeyup = function (event) {

    var m_game_over = false;
    

    /* 
    ** Check if game is to be re-started
    */
    if (g_gameInProgress === false) {

        g_gameInProgress = true;

        
        /**
         * Initialize new game session variables
         */
        g_numOfAttempsMade = 0;
        g_totalGameSessions++;

        /**
         *  Let Computer select the word to guess
         */
        var rand1to25         = Math.floor((Math.random() * 25) + 1);
        g_chosenWord          = g_word_list[rand1to25].toUpperCase();
        
        g_charsLeft2BeGuessed = g_chosenWord;


        /**
         * Fill the g_currentGuessWord with '_' for each letter of the chosen word.
         * 
         * So, if the chosen word is "TEST" after executing the for loop, variable
         *  g_currentGuessedWord will contain "____"
         * 
         */
        for (var i = 0; i < g_chosenWord.length; i++) {
            g_currentGuessedWord.push(CHAR_DISPLAY_SYMBOL);
        }

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
         * Clear the session message
         */
        var gameSessionMsgId = document.getElementById('game-session-msg');
        gameSessionMsgId.textContent = BLANK_STRING;





    } else {

        var key_pressed = event.key.toUpperCase();

        /**
         * Check if user press a valid key and  this is a new letter guess.
         * If so do the following:
         *   - save the letter pressed
         *   - update the attemts counter
         *   - check if the user guessed the word
         *   - update the letters pressed field on the page
         */

        if ((g_LettersAlreadyPressed.includes(key_pressed) == false) && (isAlphabet(key_pressed) == true)) {

            g_LettersAlreadyPressed.push(key_pressed);
            g_numOfAttempsMade++;
            updateCurrentGameStatsCard();


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

    /**
     * Update the results if the game is over
     */
    if (m_game_over == true) {

        var gameResultString;
    
        /**
         *  Game Over Message
         */
        if (g_user_won == true) {
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

        module_init();

    }
    else {
        /**
         * Game not over - Update the current state of the word guess
         */
        updateGuessedWord();
    }


};

