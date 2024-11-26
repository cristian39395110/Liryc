import { guardarNodoActual } from "./guardarNodoActual.mjs";
import obtenerClienteDeWhatsapp from '../../conexionWhatsapp/conexionW.js'
import colors from 'colors/safe.js'
import con from "../../database/conexion.mjs";
import axios from 'axios'
const client = obtenerClienteDeWhatsapp(colors, false)

  

import {menuVolver,principalMenuAsistenteVirtual,muestraFactura,errorNoEncuentraFactura, principalMenu} from "../arbolCliente/respuestasLiryc.mjs"

export const buscarUltimaFacturaIspCube = (telefono, mensaje, opcion, menuFinal, otros, datos,menu) => {
  
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
    guardarNodoActual(telefono,"segundaAdministracion" , mensaje, datos, opcion, "", menuFinal, otros);
    client.sendMessage(telefono,muestraFactura(response.data));
  }
  if(otros === 'asistenteVirtual'){
    setTimeout(() => {
      client.sendMessage(telefono,principalMenuAsistenteVirtual);
  },8000)
  // console.log('Respuesta de la API:', response.data);
}else{
 setTimeout(() => {
      client.sendMessage(telefono,principalMenu);
  },8000)

}
  })
  .catch(error => {
      return console.error('Error al hacer la petición:', error);
  });


    }, 1000);

};
