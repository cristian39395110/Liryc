import { guardarNodoActual } from "./guardarNodoActual.mjs";
import obtenerClienteDeWhatsapp from '../../conexionWhatsapp/conexionW.js'
import colors from 'colors/safe.js'
import con from "../../database/conexion.mjs";
import axios from 'axios'
const client = obtenerClienteDeWhatsapp(colors, false)

  

import {menuVolver,muestraFactura,errorNoEncuentraFactura} from "../arbolCliente/respuestasLiryc.mjs"

export const buscarUltimaFacturaIspCube = (telefono, mensaje, opcion, menuFinal, otros, datos,siguiente) => {
  
  setTimeout(() => {
    const url = 'http://localhost:5001/getFactura';
    
    const data = {
        documento: Number(datos),
    };
    axios.post(url, data)
    .then(response => {
  if (response.data.message === 'Factura no encontrada') {
    guardarNodoActual(telefono, "facturaConfirmaIsError", "", datos, opcion, "", menuFinal, otros);
    client.sendMessage(telefono,errorNoEncuentraFactura);
  }else{
    guardarNodoActual(telefono, siguiente, mensaje, datos, opcion, "", menuFinal, otros);
    client.sendMessage(telefono,muestraFactura(response.data));
  }
  setTimeout(() => {
      client.sendMessage(telefono,menuVolver);
  },8000)
  // console.log('Respuesta de la API:', response.data);

  })
  .catch(error => {
      return console.error('Error al hacer la petición:', error);
  });


    }, 1000);

};
