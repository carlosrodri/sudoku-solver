import { Solver } from './solver';
import { Component } from '@angular/core';
import { timer } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'sudoku';
  grid: number[][];
  isFilledGrid: boolean = false;
  sudokuIsSolved: boolean = false;
  iterations: number;
  time: string;


  constructor() {
    this.isFilledGrid = false;
    this.sudokuIsSolved = false;
    this.grid = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]



  }

  ngOnInit() {
    document.getElementById('buttonProgress').style.display = 'none';
    document.getElementById('icon-check').style.display = 'none';
    document.getElementById('icon-error').style.display = 'none';
  }

  resetUI() {
    document.getElementById('buttonProgress').style.display = 'none';
    document.getElementById('icon-check').style.display = 'none';
    document.getElementById('icon-error').style.display = 'none';
  }

  /**
 * Prints a sudoku grid to stdout, not needed for the actual algorithm.
 */
  printSudoku = (grid: number[][]) => {
    const getChar = (char) => {
      return char > 0 ? char.toString() : ' ';
    };
    const separatorLine = '+-------+-------+-------+';

    for (let x = 0; x < 9; x++) {
      if (x === 0) console.log(separatorLine);

      let out = '';
      for (let y = 0; y < 9; y++) {
        if (y === 0) out += '| ';
        if ((y + 1) % 3 === 0) {
          out += getChar(grid[x][y]) + ' | ';
        } else {
          out += getChar(grid[x][y]) + ' ';
        }
      }
      console.log(out);

      if ((x + 1) % 3 === 0) {
        console.log(separatorLine);
      }
    }
  }

  selectFile(event) {
    let currentGrid = [];
    let fileReader = new FileReader();
    fileReader.readAsText(event.target.files[0]);
    fileReader.onload = function () {
      let rows: String[] = fileReader.result.toString().trim().split('\n');
      rows.forEach(row => {
        let stringVector = row.toString().trim().split(' ')
        currentGrid.push(stringVector.map(Number));
      })
    };
    document.getElementById('buttonProgress').style.display = 'block';
    this.grid = currentGrid;
    setTimeout(() => {
      this.runSudoku();
    }, 1000);
    fileReader.onerror = function () {
      alert(fileReader.error);
    };
  }

  private runSudoku() {
    let timeStart = new Date().getTime();
    // Load the unsolved sudoku into the backtracker
    console.log(this.grid);
    this.isFilledGrid = true;
    this.printSudoku(this.grid);
    let backtracker = new Solver(this.grid);

    // Solve the sudoku and measure how long it took
    console.time('Solve Duration');
    let solvedSudoku = backtracker.solve();
    this.grid = <number[][]>solvedSudoku
    this.sudokuIsSolved = true;

    console.timeEnd('Solve Duration');
    console.log('Iterations:', backtracker.neededIterations);

    this.iterations = backtracker.neededIterations;
    this.time = (new Date().getTime() - timeStart) + 'ms';
    // Print the solved sudoku if possible
    // If solvedSudoku is false then the sudoku was not impossible to solve.
    if (solvedSudoku) {
      this.printSudoku(<number[][]>solvedSudoku);
      document.getElementById('buttonProgress').style.display = 'none';
      document.getElementById('icon-check').style.display = 'block';
    } else {
      console.log('No solution found');
      document.getElementById('buttonProgress').style.display = 'none';
      document.getElementById('icon-error').style.display = 'block';
    }
  }

  //Print sudoku


}
