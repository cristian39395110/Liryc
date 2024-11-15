export const devolverOpcionSeleccionada = (opcion, nombreMenu) => {
    if(opcion === '1' && nombreMenu === 'noTengoInternet' ){return 'Consulta tecnica'}
    if(opcion === '2' && nombreMenu === 'noTengoInternet'){return 'Inconvenientes con el servicio'}
    if(opcion === '3' && nombreMenu === 'noTengoInternet'){return 'Sin Servicio'}
    if(opcion === '4' && nombreMenu === 'noTengoInternet'){return 'Intalar TV Digital Sensa'}


    if(opcion === '1' && nombreMenu === 'opcionEsCliente'){return 'Datos Cliente'}
    if(opcion === '0' ){return 'Volver atras'}
  }