const readline = require('readline-sync');
const crypto = require('crypto');
const asciTable = require('ascii-table');
class KeyGen {
    generateKey() {
        return crypto.randomBytes(32).toString('hex');
    }
    generateHmac(key, move) {
        return crypto.createHmac('sha3-256', key).update(move).digest('hex');
    }
}
class Table {
    constructor(args) {
        this.args = args;
        this.argLength = args.length;
    }
    generateTable = () => {
        const table = new asciTable();
        table.setHeading('v PC/ User >', ...this.args);
        for (let i = 0; i < this.argLength; i++) {
            const row = [this.args[i]];
            for (let j = 0; j < this.argLength; j++) {
                if (i === j) {
                    row.push('Draw')
                } else {
                    const half = Math.floor(this.argLength / 2);
                    if ((j > i && j <= i + half) || (j < i && j + this.argLength <= i + half)) {
                        row.push('Win');
                    } else {
                        row.push('Lose');
                    }
                }
            }
            table.addRow(...row);
        }
        console.log(table.toString());
    }
}
class Rules {
    constructor(args) {
        this.args = args;
        this.argLength = args.length;
    }
    winner(playerMove, computerMove) {
        const playerChoice = this.args.indexOf(playerMove);
        const computerChoise = this.args.indexOf(computerMove);
        const halfIndex = Math.floor(this.argLength / 2);
        if (playerChoice === computerChoise) {
            return 'Draw';
        } else if (
            (computerChoise > playerChoice && computerChoise <= playerChoice + halfIndex) ||
            (computerChoise < playerChoice && playerChoice + halfIndex >= this.args)
        ) {
            return 'Win';
        } else {
            return 'Lose';
        }
    }
}
class Game {
    constructor(args) {
        this.args = args;
        this.table = new Table(args);
        this.rules = new Rules(args);
        this.keyGenerete = new KeyGen()
    }
    play() {
        const computerMove = args[Math.floor(Math.random() * args.length)];
        const key = this.keyGenerete.generateKey();
        const hmac = this.keyGenerete.generateHmac(key, computerMove);
        console.log(`HMAC: ${hmac}`);

        while (true) {
            console.log('Available moves: ');
            this.args.forEach((element, index) => {
                console.log(`${index + 1} - ${element}`);
            });
            console.log(`0 - Exit\n? - Help`);
            const choise = readline.question('Enter your move: ');

            if (choise == 0) {
                console.log('Exit game');
                break;
            }

            if (choise === '?') {
                this.table.generateTable();
                continue;
            }

            const playerIndex = parseInt(choise) - 1;
            if (isNaN(playerIndex) || playerIndex < 0 || playerIndex >= this.args.length) {
                console.log('Invalid choise, try again');
                continue;
            }

            const playerMove = this.args[playerIndex];
            const result = this.rules.winner(playerMove, computerMove);
            console.log(`Your move: ${playerMove}`);
            console.log(`Computer move: ${computerMove}`);
            console.log(`Result: ${result}`);
            console.log(`Key: ${key}`);
            break;
        }
    }
}

const args = process.argv.slice(2);
if (!args || args.length < 3 || args.length % 2 === 0 || new Set(args).size !== args.length) {
    console.log('Error: You must provide an odd number of unique moves (at least 3). Example: node game.js Rock Paper Scissors');
    process.exit(1);
}
const game = new Game(args);
game.play();










