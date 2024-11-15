/**
 * Clase Nodo para representar los nodos del árbol de respuestas.
 */
export class Nodo {
    /**
     * Constructor de la clase Nodo.
     * parametro {string} menu - El nombre del menú al que pertenece el nodo.
     * parametro {string} respuesta - La respuesta asociada al nodo.
     * parametro {string} numero - El número o palabra identificador del nodo (opción para que el cliente invoque el nodo).
     * parametro {boolean} derivaConsulta - Indica si el nodo deriva a una consulta.
     * parametro {string} derivaNombreArea - Si derivaConsulta es TRUE. Indica el nombre del área a la que se deriva la consulta.
     * parametro {boolean} esHoja - Indica si el nodo es una hoja en el árbol.
     * parametro {boolean} pideDatos - Indica si el nodo solicita datos adicionales al cliente (por lo general una respuesta escrita manualmente por el cliente).
     * parametro {boolean} pideOpcion - Indica si el nodo solicita una opción al cliente. Puede funcionar como una encuesta.
     * parametro {string} imagen - El nombre de la imagen asociada al nodo (si aplica).
     */
    constructor(menu, respuesta, numero, derivaConsulta, derivaNombreArea, esHoja, pideDatos, pideOpcion, imagen) {
        this.menu = menu;
        this.respuesta = respuesta;
        this.numero = Array.isArray(numero) ? numero : [numero];
        this.derivaConsulta = derivaConsulta;
        this.derivaNombreArea = derivaNombreArea;
        this.opciones = [];
        this.esHoja = esHoja;
        this.pideDatos = pideDatos;
        this.pideOpcion = pideOpcion;
        this.imagen = imagen;
    }
  
    /**
     * Agrega una opción al nodo.
     * @param {Nodo} nodo - El nodo que se agregará como opción.
     */
    addOpcion(nodo) {
        this.opciones.push(nodo);
    }
  
    /**
     * Obtiene el número identificador del nodo.
     * @returns {string} El número o palabra identificador del nodo.
     */
    getNumero() {
        return this.numero;
    }
  
    /**
     * Obtiene el nombre del menú al que pertenece el nodo.
     * @returns {string} El nombre del menú.
     */
    getMenu() {
        return this.menu;
    }
  
    /**
     * Obtiene la respuesta asociada al nodo.
     * @returns {string} La respuesta del nodo.
     */
    getRespuesta() {
        return this.respuesta;
    }
  
    /**
     * Obtiene el valor que indica si el nodo deriva a una consulta.
     * @returns {boolean} `true` si el nodo deriva a una consulta, de lo contrario, `false`.
     */
    getDerivaConsulta() {
        return this.derivaConsulta;
    }
  
    /**
     * Obtiene el valor que indica si el nodo deriva a un nombre de área.
     * @returns {string} El nombre del area a derivar
     */
    getDerivaNombreArea() {
        return this.derivaNombreArea;
    }
  
    /**
     * Obtiene las opciones disponibles en el nodo.
     * @returns {Nodo[]} Un arreglo de nodos que representan las opciones disponibles.
     */
    getOpciones() {
        return this.opciones;
    }
  
    /**
     * Obtiene el valor que indica si el nodo es una hoja en el árbol.
     * @returns {boolean} `true` si el nodo es una hoja, de lo contrario, `false`.
     */
    getEsHoja() {
        return this.esHoja;
    }
  
    /**
     * Obtiene el valor que indica si el nodo solicita datos adicionales.
     * @returns {boolean} `true` si el nodo solicita datos adicionales, de lo contrario, `false`.
     */
    getPideDatos() {
        return this.pideDatos;
    }
  
    /**
     * Obtiene el nombre de la imagen asociada al nodo.
     * @returns {string} El nombre de la imagen (o cadena vacía si no hay imagen).
     */
    getImagen() {
        return this.imagen;
    }
  
    /**
     * Busca una opción específica dentro del nodo y sus opciones recursivamente.
     * @param {string} menuActual - El nombre del menú actual.
     * @param {string} numeroActual - El número o palabra identificador actual.
     * @param {string} numero - El número o palabra identificador de la opción que se busca.
     * @returns {Nodo|null} El nodo encontrado o `null` si no se encuentra.
     */
    buscarOpcion(menuActual, numeroActual, numero) {
      // Separar los posibles identificadores concatenados
      const numerosActuales = numeroActual.split(',');
    
      if (menuActual === 'raiz' && numero === 'hola') {
        return this;
      } else if (this.menu === menuActual && numerosActuales.some(num => this.numero.includes(num))) {
        // Si encontramos el nodo que coincide con los parámetros
        // devolvemos la opción con el número que estamos buscando
        return this.opciones.find(opcion => opcion.numero.includes(numero)) || null;
      } else if (!this.esHoja) {
        // Si no encontramos la opción en el nodo actual, buscamos en los hijos
        for (const opcion of this.opciones) {
          const opcionEncontrada = opcion.buscarOpcion(menuActual, numeroActual, numero);
          if (opcionEncontrada) {
            return opcionEncontrada;
          }
        }
      }
      return null; // Si no se encontró la opción, devolvemos null
    }
  }
  