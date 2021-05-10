import * as lodash from 'lodash';

/**
 * En esta clase se implementa el algoritmo de backtracking 
 */
export class Backtracking {
  private matrix: number[][];
  private iterations: number = 0;

  // Clonamos el sudoku que llega como parametro al constructor para evitar que se anule 
  constructor(matrix: number[][]) {
    this.matrix = lodash.cloneDeep(matrix);
  }

  get sudoku() {
    return this.matrix;
  }

  get numberIterations() {
    return this.iterations;
  }

  /**
 * Este es el metodo principal donde se utiliza la recursividad retorna falso si no se pudo resolver el sudoku
 *  y true mas una lista si la solucion se pudo hacer satisfactoriamente
 */
  solve(): boolean | number[][] {
    this.iterations++;

    // 1. Encontrar la primera casilla vacia
    let [row, column] = this.findEmptyCell();
    // Si el metodo no encuentra ninguna celda vacia el sudoku fue desarrollado
    if (row === -1 && column === -1) {
      return true;
    }
    // Probamos en cada celda los numeros 1 a 9
    for (let number = 1; number <= 9; number++) {
      // Comprobamos que el numero se puede colocar en esa celda mediante la comprobacion en fila y columna y en matriz 3x3
      if (this.isCellSafe(row, column, number)) {
        // Si retorna true la asignamos a esa fila y columna
        this.matrix[row][column] = number;

        // Lo siguiente es volver a usar este metodo, recursivamente hasta que retorne true cuando ya no haya ninguna celda
        // vacia, lo que significaria que el sudoku fue resuelto
        if (this.solve()) {
          return this.matrix;
        }

        // Si retorna falso volvemos a poner la celda en cero y probamos con el siguiente numero del for
        this.matrix[row][column] = 0;
      }
    }
    //Finalmente Si termina el for de probar cada numero en cada celda y ninguno funciona, significaria que esta solucion no sirve
    // y retorna falso
    return false;
  }

  /**
   * Buscamos una celda vacia y retornamos sus donde X representa las filas y Y  las columnas
   */
  findEmptyCell(): [number, number] {
    let coords: [number, number] = [-1, -1];
    for (let x = 0; x < 9; x++) {
      for (let y = 0; y < 9; y++) {
        //igualamos cada celda a cero si retorna true retornamos las cordenadas de la celda
        if (this.matrix[x][y] === 0) {
          coords[0] = x;
          coords[1] = y;
          return coords;
        }
      }
    }
    // Si no encuentra ninguna celda vacia retornamos -1, -1 que significa que ya ha sido resuelto todo el sudoku
    return coords;
  }

  /**
 * Checks if a given number can be placed in a row/column.
 */
  isCellSafe(row, column, number): boolean {
    return !this.usedInColumn(column, number)
      && !this.usedInRow(row, number)
      && !this.usedInMatrix(row, column, number);
  }

  /**
   * Verifica si el numero se puede usar en la fila dada 
   */
  usedInRow(row, number): boolean {
    for (let x = 0; x < 9; x++) {
      if (this.matrix[row][x] === number) {
        return true;
      }
    }
    return false;
  }

  /**
   * Verifica si el numero se puede usar en la fila dada 
   */
  usedInColumn(column, number): boolean {
    for (let y = 0; y < 9; y++) {
      if (this.matrix[y][column] === number) {
        return true;
      }
    }
    return false;
  }

  /**
   * Verifica si el numero se puede usar en la matriz 3x3 
   */
  usedInMatrix(row, column, number): boolean {
    row -= row % 3;
    column -= column % 3;
    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        if (this.matrix[x + row][y + column] === number) {
          return true;
        }
      }
    }
    return false;
  }
}