import { Backtracking } from './backtracking';
import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'sudoku';
  //Grilla o matriz que contiene el sudoku
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
      this.solveSudoku();
    }, 1000);
    fileReader.onerror = function () {
      alert(fileReader.error);
    };
  }

  private solveSudoku() {
    // Mediante esta variable calculamos el tiempo que le toma al algoritmo encontrar la solucion al sudoku
    let timeStart = new Date().getTime();
    // Enviamos el sudoku sin resolver a la clase de baktraking
    this.isFilledGrid = true;
    let backtracker = new Backtracking(this.grid);

    // Ejecutamos el metodo resolver y le asignamos la solucion a la matriz grid
    let solvedSudoku = backtracker.solve();
    this.grid = <number[][]>solvedSudoku
    this.sudokuIsSolved = true;

    // Obtenemos el numero de iteraciones usadas
    this.iterations = backtracker.numberIterations;
    this.time = (new Date().getTime() - timeStart) + 'ms';
    // Mostramos en la interfaz que el sudoku ha sido solucionado si no no lo motramos 
    if (solvedSudoku) {
      document.getElementById('buttonProgress').style.display = 'none';
      document.getElementById('icon-check').style.display = 'block';
    } else {
      document.getElementById('buttonProgress').style.display = 'none';
      document.getElementById('icon-error').style.display = 'block';
    }
  }
}
