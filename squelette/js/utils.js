export { create2DArray };

/** En JavaScript on ne peut pas déclarer directement de tableau à n dimensions
   en précisant toutes les dimensions. tab [4][4] n'est pas possible par exemple.
   On déclare en général un tableau à une dimension de taille varialbe (ci-dessous 
   let arr = []) puis ensuite pour chacune des lignes du tableau, on lui affecte un autre
   tableau (arr[i] = [] ci-dessous) */

function create2DArray(rows) {
  let arr = [];

  for (let i = 0; i < rows; i++) {
    arr[i] = [];
  }

  return arr;
}

