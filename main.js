const prompt =require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
    constructor(field = [[]]) {
        this.field = field;
        this.column = 0;
        this.row = 0;

        //starting position
        this.field[0][0] = pathCharacter;
    }
    //method for running the game
    runGame() {
        let playing = true;

        while(playing) {
            this.print();
            this.askQuestion();

            if(!this.isInBounds()) {
                console.log('You fell off the map!');
                playing = false;
                break;
            } else if (this.isHole()) {
                console.log('Oh no! You were lost to the hole!');
                playing = false;
                break;
            } else if (this.isHat()) {
                console.log('CONGRATULATIONS! You found your hat!');
                playing = false;
                break;
            }

            //remember to update location
            this.field[this.row][this.column] = pathCharacter;
        }
    }

    askQuestion() {
        const answer = prompt('How would you like to move?      ').toUpperCase();
        switch (answer) {
            case 'U':
                this.row -= 1;
                break;
            case 'D':
                this.row += 1;
                break;
            case 'L':
                this.column -= 1;
                break;
            case 'R':
                this.column += 1;
                break;
            default:
                console.log('\n("L" or "R" for left and right)\n("U" or "D" for up and down)\n\nBEWARE OF HOLES!\n\n');
                this.askQuestion();
                break;
        }
    }

    isInBounds() {
        return (
            this.row >= 0 &&
            this.column >= 0 &&
            this.row < this.field.length &&
            this.column < this.field[0].length
        );
    }

    isHat() {
        return this.field[this.row][this.column] === hat;
    }

    isHole() {
        return this.field[this.row][this.column] === hole;
    }

    print() {
        const displayString = this.field.map(indivRow => {
            return indivRow.join('');
        }).join('\n');
        console.log(displayString);
    }

    static generateField(height, width, percentage = 0.1) {
        const field = new Array(height).fill(0).map(element => new Array(width));
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const holeProbability = Math.random();
                field[y][x] = holeProbability > percentage ? fieldCharacter : hole;
            }
        }
        //object for hat location
        const hatLocation = {
            x: Math.floor(Math.random() * width),
            y: Math.floor(Math.random() * height)
        };

        //hat cannot be at start
        while (hatLocation.x === 0 && hatLocation.y === 0) {
            hatLocation.x = Math.floor(Math.random() * width);
            hatLocation.y = Math.floor(Math.random() * height);
        }

        field[hatLocation.y][hatLocation.x] = hat;

        return field;
    }

    isValidField() {
        let testField = [...this.field];
        let traversed = [];

        for (let y = 0; y < testField.length; y++) {
            let newLine = [];
            for (let x = 0; x < testField[0].length; x++) {
                newLine.push(false);
            }
            traversed.push([...newLine]);
        }

        function findPath(row, column) {
            if (testField[row][column] === hat) {
                return true;
            }

            if (testField[row][column] === hole || traversed[row][column]) {
                return false;
            }

            traversed[row][column] = true;
            if (row != 0) {
                if (findPath(row - 1, column)) {
                    return true;
                }
            }

            if (row != testField.length - 1) {
                if (findPath(row + 1, column)) {
                    return true;
                }
            }

            if (column != 0) {
                if (findPath(row, column - 1)) {
                    return true;
                }
            }

            if (column != testField[0].length - 1) {
                if (findPath(row, column + 1)) {
                    return true;
                }
            }

            return false;
        };

        return findPath(this.row, this.column);
    }

    
   
}
//we can pass Field.generateField because its a static method that returns a field
const myField = new Field(Field.generateField(20,20,0.4));
while (!myField.isValidField()) {
    console.log('\nWhoops! That one was impossible. We had to make another.\n\n')
    myField.field = Field.generateField(20,20,0.4);
    myField.field[0][0] = pathCharacter;
};
myField.runGame();
