export const devolverOpcionSeleccionada = (opcion, nombreMenu) => {
    // console.log(opcion, nombreMenu);
    if(nombreMenu === "guardia"){return 'urgencia medica'}
    if(opcion === '2' && nombreMenu === "turnos"){return 'cancelar turno'}
    if(opcion === '3' && nombreMenu === "turnos"){return 'reprogramar turno'}
    if(nombreMenu === "opcionEstudio"){return 'SOLICITAR RESULTADO DE ESTUDIO'}
   
    if (opcion === '1' && nombreMenu === 'turnosSolicitar') {return 'PAMI';}
    if (opcion === '2' && nombreMenu === 'turnosSolicitar') {return 'PARTICULAR';} 
    if (opcion === '3' && nombreMenu === 'turnosSolicitar') {return 'CONEXIÓN SALUD';}
    if (opcion === '4' && nombreMenu === 'turnosSolicitar') {return 'IOSFA';}
    if (opcion === '5' && nombreMenu === 'turnosSolicitar') {return 'DOSEP';}
    if (opcion === '6' && nombreMenu === 'turnosSolicitar') {return 'ISPICA';}
    if (opcion === '7' && nombreMenu === 'turnosSolicitar') {return 'OSDE';}
    if (opcion === '8' && nombreMenu === 'turnosSolicitar') {return 'OSIAD';}
    if (opcion === '9' && nombreMenu === 'turnosSolicitar') {return 'OSMATA';}
    if (opcion === '10' && nombreMenu === 'turnosSolicitar') {return 'OSFATUN';}
    if (opcion === '11' && nombreMenu === 'turnosSolicitar') {return 'MEDIFE';}
    if (opcion === '12' && nombreMenu === 'turnosSolicitar') {return 'OSALARA';}
    if (opcion === '13' && nombreMenu === 'turnosSolicitar') {return 'SANCOR';}
    if (opcion === '14' && nombreMenu === 'turnosSolicitar') {return 'ACA (AVALIAN)';}
    if (opcion === '15' && nombreMenu === 'turnosSolicitar') {return 'BOREAL';}
    if (opcion === '16' && nombreMenu === 'turnosSolicitar') {return 'JERARUICOS SALUD';}
    if (opcion === '17' && nombreMenu === 'turnosSolicitar') {return 'LUZ Y FUERZA';}
    if (opcion === '18' && nombreMenu === 'turnosSolicitar') {return 'MOTOCICLISTAS';}
    if (opcion === '19' && nombreMenu === 'turnosSolicitar') {return 'OMINT';}
    if (opcion === '20' && nombreMenu === 'turnosSolicitar') {return 'OSETYA';}
    if (opcion === '21' && nombreMenu === 'turnosSolicitar') {return 'OSPAP';}
    if (opcion === '22' && nombreMenu === 'turnosSolicitar') {return 'PERFUMISTAS';}
    if (opcion === '23' && nombreMenu === 'turnosSolicitar') {return 'OSPATCA';}
    if (opcion === '24' && nombreMenu === 'turnosSolicitar') {return 'ROISA (PANADEROS)';}
    if (opcion === '25' && nombreMenu === 'turnosSolicitar') {return 'OSSEG';}
    if (opcion === '26' && nombreMenu === 'turnosSolicitar') {return 'PREVENCION SALUD';}
    if (opcion === '27' && nombreMenu === 'turnosSolicitar') {return 'TV SALUD';}
    if (opcion === '28' && nombreMenu === 'turnosSolicitar') {return 'SCIS';}
    if (opcion === '29' && nombreMenu === 'turnosSolicitar') {return 'UNIMED';}
    if (opcion === '30' && nombreMenu === 'turnosSolicitar') {return 'UTA';}
    if (opcion === '31' && nombreMenu === 'turnosSolicitar') {return 'OSAM (MINEROS)';}
    if (opcion === '32' && nombreMenu === 'turnosSolicitar') {return 'OSF(PMO)';}
    if (opcion === '33' && nombreMenu === 'turnosSolicitar') {return 'NOBIS';}

    

    if(opcion === '1' && (nombreMenu === 'particular' || nombreMenu === 'conexionSalud' || nombreMenu === 'obraSocial') ){return 'CARDIOLOGIA'}
    if(opcion === '2' && (nombreMenu === 'particular' || nombreMenu === 'conexionSalud' || nombreMenu === 'obraSocial') ){return 'CARDIOLOGIA PEDIÁTRICA'}
    if(opcion === '3' && (nombreMenu === 'particular' || nombreMenu === 'conexionSalud' || nombreMenu === 'obraSocial') ){return 'CLÍNICA MÉDICA'}
    if(opcion === '4' && (nombreMenu === 'particular' || nombreMenu === 'conexionSalud' || nombreMenu === 'obraSocial') ){return 'DERMATOLOGÍA'}
    if(opcion === '5' && (nombreMenu === 'particular' || nombreMenu === 'conexionSalud' || nombreMenu === 'obraSocial') ){return 'DIAGNÓSTICO POR IMÁGENES'}
    if(opcion === '6' && (nombreMenu === 'particular' || nombreMenu === 'conexionSalud' || nombreMenu === 'obraSocial') ){return 'ENDOCRINOLOGÍA'}
    if(opcion === '7' && (nombreMenu === 'particular' || nombreMenu === 'conexionSalud' || nombreMenu === 'obraSocial') ){return 'FISIOTERAPIA Y REHABILITACIÓN'}
    if(opcion === '8' && (nombreMenu === 'particular' || nombreMenu === 'conexionSalud' || nombreMenu === 'obraSocial') ){return 'FLEBOLOGÍA'}
    if(opcion === '9' && (nombreMenu === 'particular' || nombreMenu === 'conexionSalud' || nombreMenu === 'obraSocial') ){return 'GASTROENTEROLOGÍA'}
    if(opcion === '10' && (nombreMenu === 'particular' || nombreMenu === 'conexionSalud' || nombreMenu === 'obraSocial') ){return 'LABORATORIO BIOQUÍMICO'}
    if(opcion === '11' && (nombreMenu === 'particular' || nombreMenu === 'conexionSalud' || nombreMenu === 'obraSocial') ){return 'NEUROLOGIA'}
    if(opcion === '12' && (nombreMenu === 'particular' || nombreMenu === 'conexionSalud' || nombreMenu === 'obraSocial') ){return 'NEUMONOLOGÍA'}
    if(opcion === '13' && (nombreMenu === 'particular' || nombreMenu === 'conexionSalud' || nombreMenu === 'obraSocial') ){return 'NEUROCIRUGÍA'}
    if(opcion === '14' && (nombreMenu === 'particular' || nombreMenu === 'conexionSalud' || nombreMenu === 'obraSocial') ){return 'NUTRICIÓN'}
    if(opcion === '15' && (nombreMenu === 'particular' || nombreMenu === 'conexionSalud' || nombreMenu === 'obraSocial') ){return 'OBSTETRICIA'}
    if(opcion === '16' && (nombreMenu === 'particular' || nombreMenu === 'conexionSalud' || nombreMenu === 'obraSocial') ){return 'OTORRINOLARINGOLOGÍA'}
    if(opcion === '17' && (nombreMenu === 'particular' || nombreMenu === 'conexionSalud' || nombreMenu === 'obraSocial') ){return 'INFECTOLOGIA'}
    if(opcion === '18' && (nombreMenu === 'particular' || nombreMenu === 'conexionSalud' || nombreMenu === 'obraSocial') ){return 'TOCOGINECOLOGÍA'}
    if(opcion === '19' && (nombreMenu === 'particular' || nombreMenu === 'conexionSalud' || nombreMenu === 'obraSocial') ){return 'TRAUMATOLOGÍA'}
    if(opcion === '20' && (nombreMenu === 'particular' || nombreMenu === 'conexionSalud' || nombreMenu === 'obraSocial') ){return 'UROLOGÍA'}
    if(opcion === '21' && (nombreMenu === 'particular' || nombreMenu === 'conexionSalud' || nombreMenu === 'obraSocial') ){return 'HEMATOLOGIA'}
    if(opcion === '22' && (nombreMenu === 'particular' || nombreMenu === 'conexionSalud' || nombreMenu === 'obraSocial') ){return 'ALERGISTA'}
    if(opcion === '23' && (nombreMenu === 'particular' || nombreMenu === 'conexionSalud' || nombreMenu === 'obraSocial') ){return 'ECOCARDIOGRAMA'}
    

    
    // if(opcion === '1' && nombreMenu === 'obraSocial'){return 'CARDIOLOGIA'}
    // if(opcion === '2' && nombreMenu === 'obraSocial'){return 'CARDIOLOGIA PEDIÁTRICA'}
    // if(opcion === '3' && nombreMenu === 'obraSocial'){return 'DERMATOLOGÍA'}
    // if(opcion === '4' && nombreMenu === 'obraSocial'){return 'DIAGNÓSTICO POR IMÁGENES'}
    // if(opcion === '5' && nombreMenu === 'obraSocial'){return 'ENDOCRINOLOGÍA'}
    // if(opcion === '6' && nombreMenu === 'obraSocial'){return 'FISIOTERAPIA Y REHABILITACIÓN'}
    // if(opcion === '7' && nombreMenu === 'obraSocial'){return 'FLEBOLOGÍA'}
    // if(opcion === '8' && nombreMenu === 'obraSocial'){return 'GASTROENTEROLOGÍA'}
    // if(opcion === '9' && nombreMenu === 'obraSocial'){return 'LABORATORIO BIOQUÍMICO'}
    // if(opcion === '10' && nombreMenu === 'obraSocial'){return 'MEDICINA FAMILIAR Y COMUNITARIA'}
    // if(opcion === '11' && nombreMenu === 'obraSocial'){return 'NEUMONOLOGÍA'}
    // if(opcion === '12' && nombreMenu === 'obraSocial'){return 'NEUROCIRUGÍA'}
    // if(opcion === '13' && nombreMenu === 'obraSocial'){return 'NUTRICIÓN'}
    // if(opcion === '14' && nombreMenu === 'obraSocial'){return 'OBSTETRICIA'}
    // if(opcion === '15' && nombreMenu === 'obraSocial'){return 'OTORRINOLARINGOLOGÍA'}
    // if(opcion === '16' && nombreMenu === 'obraSocial'){return 'PEDIATRÍA'}
    // if(opcion === '17' && nombreMenu === 'obraSocial'){return 'PSICOLOGÍA'}
    // if(opcion === '18' && nombreMenu === 'obraSocial'){return 'TOCOGINECOLOGÍA'}
    // if(opcion === '19' && nombreMenu === 'obraSocial'){return 'TRAUMATOLOGÍA'}
    // if(opcion === '20' && nombreMenu === 'obraSocial'){return 'UROLOGÍA'}
    
    //OBRA SOCIAL: PARTICULAR --- 
    // if(opcion === '1' && nombreMenu === 'particularCabezaYCuello'){return 'Con el/la profesional: AGRAMUNT DANIEL ANDRÉS'}

    if(opcion === '1' && nombreMenu === 'particularCardiologia'){return 'PRIMER TURNO DISPONIBLE'}
    if(opcion === '2' && nombreMenu === 'particularCardiologia'){return 'Estudio: MAPA'}
    if(opcion === '3' && nombreMenu === 'particularCardiologia'){return 'Estudio: HOLTER'}
    if(opcion === '4' && nombreMenu === 'particularCardiologia'){return 'Estudio: ERGOMETRÍA'}
    if(opcion === '5' && nombreMenu === 'particularCardiologia'){return 'Estudio: ECODOPPLER ARTERIO VENOSO'}
    if(opcion === '6' && nombreMenu === 'particularCardiologia'){return 'Estudio: ECODOPPLER CARDÍACO COLOR'}
    if(opcion === '7' && nombreMenu === 'particularCardiologia'){return 'Estudio: ECODOPPLER MIEMBROS INFERIORES'}
    if(opcion === '8' && nombreMenu === 'particularCardiologia'){return 'Estudio: ECODOPPLER MIEMBROS SUPERIORES'}
    if(opcion === '9' && nombreMenu === 'particularCardiologia'){return 'Estudio: ELECTROCARDIOGRAMA'}
    if(opcion === '10' && nombreMenu === 'particularCardiologia'){return 'Con el/la profesional: LUNA LUIS'}
    if(opcion === '11' && nombreMenu === 'particularCardiologia'){return 'Con el/la profesional: REYNA CORVALÁN JUAN CARLOS'}
    if(opcion === '12' && nombreMenu === 'particularCardiologia'){return 'Con el/la profesional: ROMERO SANDRA ESTHER'}
    
    if(opcion === '1' && nombreMenu === 'particularCardiologiaInfantil'){return 'Con el/la profesional: ROMERO SANDRA ESTHER'}

    if(opcion === '1' && nombreMenu === 'particularClinicaMedica'){return 'Con el/la profesional: SABER DIEGO'}
    if(opcion === '2' && nombreMenu === 'particularClinicaMedica'){return 'Con el/la profesional: CANDREVA RICARDO'}

    if(opcion === '1' && nombreMenu === 'particularDermatologia'){return 'Con el/la profesional: SOBREVILA MÓNICA BEATRIZ'}

    if(opcion === '1' && nombreMenu === 'particularDiagnosticoPorImagenes'){return 'Estudio: MAMOGRAFÍA'}
    if(opcion === '2' && nombreMenu === 'particularDiagnosticoPorImagenes'){return 'Estudio: ORTOPANTOMOGRAFIA COMÚN'}
    if(opcion === '3' && nombreMenu === 'particularDiagnosticoPorImagenes'){return 'Estudio: TELERADIOGRAFIA COMÚN'}
    if(opcion === '4' && nombreMenu === 'particularDiagnosticoPorImagenes'){return 'Estudio: CAFELOMETRÍA COMÚN'}
    if(opcion === '5' && nombreMenu === 'particularDiagnosticoPorImagenes'){return 'Estudio: TRAZADO DE CAFELOMETRIA (CADA UNO)'}
    if(opcion === '6' && nombreMenu === 'particularDiagnosticoPorImagenes'){return 'Estudio: TOMOGRAFÍA CONEBEAN (UN MAXILAR)'}
    if(opcion === '7' && nombreMenu === 'particularDiagnosticoPorImagenes'){return 'Estudio: TOMOGRAFIA CONEBEAN (AMBOS MAXILARES)'}
    if(opcion === '8' && nombreMenu === 'particularDiagnosticoPorImagenes'){return 'Estudio: TOMOGRAFÍA'}
    if(opcion === '9' && nombreMenu === 'particularDiagnosticoPorImagenes'){return 'Estudio: VIDEOCOLONOSCOPÍA'}
    if(opcion === '10' && nombreMenu === 'particularDiagnosticoPorImagenes'){return 'Estudio: ECOGRAFÍA ABDOMINAL'}
    if(opcion === '11' && nombreMenu === 'particularDiagnosticoPorImagenes'){return 'Estudio: ECOGRAFÍA TOCOGINECOLÓGICA'}
    if(opcion === '12' && nombreMenu === 'particularDiagnosticoPorImagenes'){return 'Estudio: ECOGRAFÍA MAMARIA'}
    if(opcion === '13' && nombreMenu === 'particularDiagnosticoPorImagenes'){return 'Estudio: ECOGRAFÍA PROSTÁTICA'}
    if(opcion === '14' && nombreMenu === 'particularDiagnosticoPorImagenes'){return 'Estudio: ECOGRAFÍA ARTICULACIONES'}
    if(opcion === '15' && nombreMenu === 'particularDiagnosticoPorImagenes'){return 'Estudio: ECOGRAFÍA RENAL'}
    if(opcion === '16' && nombreMenu === 'particularDiagnosticoPorImagenes'){return 'Estudio: ECOGRAFÍA BILIAR'}
    if(opcion === '17' && nombreMenu === 'particularDiagnosticoPorImagenes'){return 'Estudio: ECOGRAFÍA PARTES BLANDAS'}
    if(opcion === '18' && nombreMenu === 'particularDiagnosticoPorImagenes'){return 'Estudio: ECOGRAFÍA CUELLO'}
    if(opcion === '19' && nombreMenu === 'particularDiagnosticoPorImagenes'){return 'Estudio: ECOGRAFÍA 3D y 4D'}
    if(opcion === '20' && nombreMenu === 'particularDiagnosticoPorImagenes'){return 'Estudio: RADIOGRAFÍA DE TORAX'}
    if(opcion === '21' && nombreMenu === 'particularDiagnosticoPorImagenes'){return 'Estudio: RADIOGRAFÍA DE LUMBOSACRO'}
    if(opcion === '22' && nombreMenu === 'particularDiagnosticoPorImagenes'){return 'Estudio: RADIOGRAFÍA DE CABEZA'}
    if(opcion === '23' && nombreMenu === 'particularDiagnosticoPorImagenes'){return 'Estudio: RADIOGRAFÍA DE CUELLO'}
    if(opcion === '24' && nombreMenu === 'particularDiagnosticoPorImagenes'){return 'Estudio: RADIOGRAFÍA DE RODILLA'}
    if(opcion === '25' && nombreMenu === 'particularDiagnosticoPorImagenes'){return 'Estudio: RADIOGRAFÍA DE PIERNA'}
    if(opcion === '26' && nombreMenu === 'particularDiagnosticoPorImagenes'){return 'Estudio: RADIOGRAFÍA DE BRAZO'}
    if(opcion === '27' && nombreMenu === 'particularDiagnosticoPorImagenes'){return 'Estudio: RADIOGRAFÍA DE CODO'}
    if(opcion === '28' && nombreMenu === 'particularDiagnosticoPorImagenes'){return 'Estudio: RADIOGRAFÍA DE MANO'}
    if(opcion === '29' && nombreMenu === 'particularDiagnosticoPorImagenes'){return 'Estudio: RADIOGRAFÍA DE CADERA'}

    if(opcion === '1' && nombreMenu === 'particularEndocrinologia'){return 'Con el/la profesional: BINDI ANDRÉS PABLO'}

    if(opcion === '1' && nombreMenu === 'particularFisioterapiaYRehabilitacion'){return 'Estudio: SESIÓN DE FISIO-KINESIO'}
    if(opcion === '2' && nombreMenu === 'particularFisioterapiaYRehabilitacion'){return 'Estudio: REHABILITACIÓN NEUROCOGNITIVA'}
    if(opcion === '3' && nombreMenu === 'particularFisioterapiaYRehabilitacion'){return 'Con el/la profesional: NEGRI MAURICIO JAVIER'}

    if(opcion === '1' && nombreMenu === 'particularFlebologia'){return 'Con el/la profesional: BINDI CARLOS ALBERTO'}
    
    if(opcion === '1' && nombreMenu === 'particularGastroenterologia'){return 'Con el/la profesional: SANDOZ GASTÓN CARLOS ESTEBAN'}
    if(opcion === '2' && nombreMenu === 'particularGastroenterologia'){return 'Con el/la profesional: PAEZ MARIA'}

    if(opcion === '1' && nombreMenu === 'particularLaboratorioBioquimico'){return 'Con el/la profesional: GARCÍA HEREDIA ANDRÉS'}

    if(opcion === '1' && nombreMenu === 'particularNeurologia'){return 'Con el/la profesional: MENOYO FLORENCIA'}
    if(opcion === '2' && nombreMenu === 'particularNeurologia'){return 'Con el/la profesional: FLORES CASTILLO MARCOS'}


    if(opcion === '1' && nombreMenu === 'particularNeumonologia'){return 'Estudio: ESPIROMETRÍA'}
    if(opcion === '2' && nombreMenu === 'particularNeumonologia'){return 'Con el/la profesional: BESSO GUILLERMO'}

    if(opcion === '1' && nombreMenu === 'particularNeurocirugia'){return 'PRIMER TURNO DISPONIBLE'}
    if(opcion === '2' && nombreMenu === 'particularNeurocirugia'){return 'Estudio: ELECTROENCEFALOGRAMA'}
    if(opcion === '3' && nombreMenu === 'particularNeurocirugia'){return 'Con el/la profesional: FLORES CASTILLO MARCOS GABRIEL'}
    if(opcion === '4' && nombreMenu === 'particularNeurocirugia'){return 'Con el/la profesional: ROGANI CARLOS ALEJANDRO'}

    if(opcion === '1' && nombreMenu === 'particularNutricion'){return 'PRIMER TURNO DISPONIBLE'}
    if(opcion === '2' && nombreMenu === 'particularNutricion'){return 'Con el/la profesional: GURVICUIS NATALIA JUDITH'}
    if(opcion === '3' && nombreMenu === 'particularNutricion'){return 'Con el/la profesional: ANDRÉ VICTORIA'}
    if(opcion === '4' && nombreMenu === 'particularNutricion'){return 'Con el/la profesional: MOYANO JAVIER ANTONIO'}

    if(opcion === '1' && nombreMenu === 'particularObstetricia'){return 'Con el/la profesional: MINUET NIDIA BELÉN'}

    if(opcion === '1' && nombreMenu === 'particularOtorrinolaringologia'){return 'Con el/la profesional: NIEVA ALEJANDRO'}

    if(opcion === '1' && nombreMenu === 'particularInfectologia'){return 'Con el/la profesional: BRAVO GARCIA ANALIA'}

    // if(opcion === '1' && nombreMenu === 'particularPsicologia'){return 'PRIMER TURNO DISPONIBLE'}
    // if(opcion === '2' && nombreMenu === 'particularPsicologia'){return 'Con el/la profesional: AGAZI GRISELDA'}
    // if(opcion === '3' && nombreMenu === 'particularPsicologia'){return 'Con el/la profesional: GODOY FERNANDO'}

    if(opcion === '1' && nombreMenu === 'particularTocoginecologia'){return 'PRIMER TURNO DISPONIBLE'}
    if(opcion === '2' && nombreMenu === 'particularTocoginecologia'){return 'Estudio: PAP'}
    if(opcion === '3' && nombreMenu === 'particularTocoginecologia'){return 'Estudio: COLPOSCOPÍA'}
    if(opcion === '4' && nombreMenu === 'particularTocoginecologia'){return 'Con el/la profesional: HEREDIA ALEJANDRO GABRIEL'}
    if(opcion === '5' && nombreMenu === 'particularTocoginecologia'){return 'Con el/la profesional: MANA MARIO DANIEL'}

    if(opcion === '1' && nombreMenu === 'particularTraumatologia'){return 'PRIMER TURNO DISPONIBLE'}
    if(opcion === '2' && nombreMenu === 'particularTraumatologia'){return 'Con el/la profesional: ALMADA LAFRANCHI JUAN VALENTÍN'}
    if(opcion === '3' && nombreMenu === 'particularTraumatologia'){return 'Con el/la profesional: BARDARO ZUAZAGA MARÍA FIORELLA'}
    if(opcion === '4' && nombreMenu === 'particularTraumatologia'){return 'Con el/la profesional: SPIROPULOS JUAN VÍCTOR'}
    
    if(opcion === '1' && nombreMenu === 'particularUrologia'){return 'Con el/la profesional: GARCÍA JOSÉ LUIS'}
    if(opcion === '2' && nombreMenu === 'particularUrologia'){return 'Con el/la profesional: RIVOIRA MATIAS'}

    if(opcion === '1' && nombreMenu === 'particularHematologia'){return 'Con el/la profesional: YABETA VILLARROEL FRESIA DEL ROSARIO'}

    if(opcion === '1' && nombreMenu === 'particularAlergista'){return 'Con el/la profesional: JOHANSEN PAULA'}

    if(opcion === '1' && nombreMenu === 'particularEcocardiograma'){return 'Con el/la profesional: ZAPATA ALEJANDRA'}
    //fin particular


    //obras sociales
    

    if(opcion === '1' && nombreMenu === 'obraSocialCardiologia'){return 'PRIMER TURNO DISPONIBLE'}
    if(opcion === '2' && nombreMenu === 'obraSocialCardiologia'){return 'Estudio: MAPA'}
    if(opcion === '3' && nombreMenu === 'obraSocialCardiologia'){return 'Estudio: HOLTER'}
    if(opcion === '4' && nombreMenu === 'obraSocialCardiologia'){return 'Estudio: ERGOMETRÍA'}
    if(opcion === '5' && nombreMenu === 'obraSocialCardiologia'){return 'Estudio: ECODOPPLER ARTERIO VENOSO'}
    if(opcion === '6' && nombreMenu === 'obraSocialCardiologia'){return 'Estudio: ECODOPPLER CARDÍACO COLOR'}
    if(opcion === '7' && nombreMenu === 'obraSocialCardiologia'){return 'Estudio: ECODOPPLER MIEMBROS INFERIORES'}
    if(opcion === '8' && nombreMenu === 'obraSocialCardiologia'){return 'Estudio: ECODOPPLER MIEMBROS SUPERIORES'}
    if(opcion === '9' && nombreMenu === 'obraSocialCardiologia'){return 'Estudio: ELECTROCARDIOGRAMA'}
    if(opcion === '10' && nombreMenu === 'obraSocialCardiologia'){return 'Con el/la profesional: MARTORINA SALVADOR'}
    if(opcion === '11' && nombreMenu === 'obraSocialCardiologia'){return 'Con el/la profesional: REYNA CORVALÁN JUAN CARLOS'}
    if(opcion === '12' && nombreMenu === 'obraSocialCardiologia'){return 'Con el/la profesional: ROMERO SANDRA ESTHER'}
    
    if(opcion === '1' && nombreMenu === 'obraSocialCardiologiaInfantil'){return 'Con el/la profesional: ROMERO SANDRA ESTHER'}

    if(opcion === '1' && nombreMenu === 'obraSocialDermatologia'){return 'Con el/la profesional: SOBREVILA MÓNICA BEATRIZ'}

    if(opcion === '1' && nombreMenu === 'obraSocialDiagnosticoPorImagenes'){return 'Estudio: MAMOGRAFÍA'}
    if(opcion === '2' && nombreMenu === 'obraSocialDiagnosticoPorImagenes'){return 'Estudio: ORTOPANTOMOGRAFIA COMÚN'}
    if(opcion === '3' && nombreMenu === 'obraSocialDiagnosticoPorImagenes'){return 'Estudio: TELERADIOGRAFIA COMÚN'}
    if(opcion === '4' && nombreMenu === 'obraSocialDiagnosticoPorImagenes'){return 'Estudio: CAFELOMETRÍA COMÚN'}
    if(opcion === '5' && nombreMenu === 'obraSocialDiagnosticoPorImagenes'){return 'Estudio: TRAZADO DE CAFELOMETRIA (CADA UNO)'}
    if(opcion === '6' && nombreMenu === 'obraSocialDiagnosticoPorImagenes'){return 'Estudio: TOMOGRAFÍA CONEBEAN (UN MAXILAR)'}
    if(opcion === '7' && nombreMenu === 'obraSocialDiagnosticoPorImagenes'){return 'Estudio: TOMOGRAFIA CONEBEAN (AMBOS MAXILARES)'}
    if(opcion === '8' && nombreMenu === 'obraSocialDiagnosticoPorImagenes'){return 'Estudio: TOMOGRAFÍA'}
    if(opcion === '9' && nombreMenu === 'obraSocialDiagnosticoPorImagenes'){return 'Estudio: VIDEOCOLONOSCOPÍA'}
    if(opcion === '10' && nombreMenu === 'obraSocialDiagnosticoPorImagenes'){return 'Estudio: ECOGRAFÍA ABDOMINAL'}
    if(opcion === '11' && nombreMenu === 'obraSocialDiagnosticoPorImagenes'){return 'Estudio: ECOGRAFÍA TOCOGINECOLÓGICA'}
    if(opcion === '12' && nombreMenu === 'obraSocialDiagnosticoPorImagenes'){return 'Estudio: ECOGRAFÍA MAMARIA'}
    if(opcion === '13' && nombreMenu === 'obraSocialDiagnosticoPorImagenes'){return 'Estudio: ECOGRAFÍA PROSTÁTICA'}
    if(opcion === '14' && nombreMenu === 'obraSocialDiagnosticoPorImagenes'){return 'Estudio: ECOGRAFÍA ARTICULACIONES'}
    if(opcion === '15' && nombreMenu === 'obraSocialDiagnosticoPorImagenes'){return 'Estudio: ECOGRAFÍA RENAL'}
    if(opcion === '16' && nombreMenu === 'obraSocialDiagnosticoPorImagenes'){return 'Estudio: ECOGRAFÍA BILIAR'}
    if(opcion === '17' && nombreMenu === 'obraSocialDiagnosticoPorImagenes'){return 'Estudio: ECOGRAFÍA PARTES BLANDAS'}
    if(opcion === '18' && nombreMenu === 'obraSocialDiagnosticoPorImagenes'){return 'Estudio: ECOGRAFÍA CUELLO'}
    if(opcion === '19' && nombreMenu === 'obraSocialDiagnosticoPorImagenes'){return 'Estudio: ECOGRAFÍA 3D y 4D'}
    if(opcion === '20' && nombreMenu === 'obraSocialDiagnosticoPorImagenes'){return 'Estudio: RADIOGRAFÍA DE TORAX'}
    if(opcion === '21' && nombreMenu === 'obraSocialDiagnosticoPorImagenes'){return 'Estudio: RADIOGRAFÍA DE LUMBOSACRO'}
    if(opcion === '22' && nombreMenu === 'obraSocialDiagnosticoPorImagenes'){return 'Estudio: RADIOGRAFÍA DE CABEZA'}
    if(opcion === '23' && nombreMenu === 'obraSocialDiagnosticoPorImagenes'){return 'Estudio: RADIOGRAFÍA DE CUELLO'}
    if(opcion === '24' && nombreMenu === 'obraSocialDiagnosticoPorImagenes'){return 'Estudio: RADIOGRAFÍA DE RODILLA'}
    if(opcion === '25' && nombreMenu === 'obraSocialDiagnosticoPorImagenes'){return 'Estudio: RADIOGRAFÍA DE PIERNA'}
    if(opcion === '26' && nombreMenu === 'obraSocialDiagnosticoPorImagenes'){return 'Estudio: RADIOGRAFÍA DE BRAZO'}
    if(opcion === '27' && nombreMenu === 'obraSocialDiagnosticoPorImagenes'){return 'Estudio: RADIOGRAFÍA DE CODO'}
    if(opcion === '28' && nombreMenu === 'obraSocialDiagnosticoPorImagenes'){return 'Estudio: RADIOGRAFÍA DE MANO'}
    if(opcion === '29' && nombreMenu === 'obraSocialDiagnosticoPorImagenes'){return 'Estudio: RADIOGRAFÍA DE CADERA'}

    if(opcion === '1' && nombreMenu === 'obraSocialEndocrinologia'){return 'Con el/la profesional: BINDI ANDRÉS PABLO'}

    if(opcion === '1' && nombreMenu === 'obraSocialFisioterapiaYRehabilitacion'){return 'Estudio: SESIÓN DE FISIO-KINESIO'}
    if(opcion === '2' && nombreMenu === 'obraSocialFisioterapiaYRehabilitacion'){return 'Estudio: REHABILITACIÓN NEUROCOGNITIVA'}
    if(opcion === '3' && nombreMenu === 'obraSocialFisioterapiaYRehabilitacion'){return 'Con el/la profesional: NEGRI MAURICIO JAVIER'}

    if(opcion === '1' && nombreMenu === 'obraSocialFlebologia'){return 'Con el/la profesional: BINDI CARLOS ALBERTO'}
    
    if(opcion === '1' && nombreMenu === 'obraSocialGastroenterologia'){return 'Con el/la profesional: SANDOZ GASTÓN CARLOS ESTEBAN'}

    if(opcion === '1' && nombreMenu === 'obraSocialLaboratorioBioquimico'){return 'Con el/la profesional: GARCÍA HEREDIA ANDRÉS'}

    if(opcion === '1' && nombreMenu === 'obraSocialNeumonologia'){return 'Estudio: ESPIROMETRÍA'}
    if(opcion === '2' && nombreMenu === 'obraSocialNeumonologia'){return 'Con el/la profesional: BESSO GUILLERMO'}

    if(opcion === '1' && nombreMenu === 'obraSocialNeurocirugia'){return 'PRIMER TURNO DISPONIBLE'}
    if(opcion === '2' && nombreMenu === 'obraSocialNeurocirugia'){return 'Estudio: ELECTROENCEFALOGRAMA'}
    if(opcion === '3' && nombreMenu === 'obraSocialNeurocirugia'){return 'Con el/la profesional: FLORES CASTILLO MARCOS GABRIEL'}
    if(opcion === '4' && nombreMenu === 'obraSocialNeurocirugia'){return 'Con el/la profesional: ROGANI CARLOS ALEJANDRO'}

    if(opcion === '1' && nombreMenu === 'obraSocialNutricion'){return 'PRIMER TURNO DISPONIBLE'}
    if(opcion === '2' && nombreMenu === 'obraSocialNutricion'){return 'Con el/la profesional: GURVICUIS NATALIA JUDITH'}
    if(opcion === '3' && nombreMenu === 'obraSocialNutricion'){return 'Con el/la profesional: LUNA FLAVIA GIMENA'}
    if(opcion === '4' && nombreMenu === 'obraSocialNutricion'){return 'Con el/la profesional: MOYANO JAVIER ANTONIO'}

    if(opcion === '1' && nombreMenu === 'obraSocialObstetricia'){return 'Con el/la profesional: MINUET NIDIA BELÉN'}

    if(opcion === '1' && nombreMenu === 'obraSocialOtorrinolaringologia'){return 'Con el/la profesional: NIEVA ALEJANDRO'}

    if(opcion === '1' && nombreMenu === 'obraSocialPediatria'){return 'Con el/la profesional: DAYENOFF JULIO'}

    if(opcion === '1' && nombreMenu === 'obraSocialPsicologia'){return 'PRIMER TURNO DISPONIBLE'}
    if(opcion === '2' && nombreMenu === 'obraSocialPsicologia'){return 'Con el/la profesional: GODOY FERNANDO'}

    if(opcion === '1' && nombreMenu === 'obraSocialTocoginecologia'){return 'PRIMER TURNO DISPONIBLE'}
    if(opcion === '2' && nombreMenu === 'obraSocialTocoginecologia'){return 'Estudio: PAP'}
    if(opcion === '3' && nombreMenu === 'obraSocialTocoginecologia'){return 'Estudio: COLPOSCOPÍA'}
    if(opcion === '4' && nombreMenu === 'obraSocialTocoginecologia'){return 'Con el/la profesional: HEREDIA ALEJANDRO GABRIEL'}
    if(opcion === '5' && nombreMenu === 'obraSocialTocoginecologia'){return 'Con el/la profesional: MANA MARIO DANIEL'}

    if(opcion === '1' && nombreMenu === 'obraSocialTraumatologia'){return 'PRIMER TURNO DISPONIBLE'}
    if(opcion === '2' && nombreMenu === 'obraSocialTraumatologia'){return 'Con el/la profesional: ALMADA LAFRANCHI JUAN VALENTÍN'}
    if(opcion === '3' && nombreMenu === 'obraSocialTraumatologia'){return 'Con el/la profesional: BARDARO ZUAZAGA MARÍA FIORELLA'}
    if(opcion === '4' && nombreMenu === 'obraSocialTraumatologia'){return 'Con el/la profesional: SPIROPULOS JUAN VÍCTOR'}
    
    if(opcion === '1' && nombreMenu === 'obraSocialUrologia'){return 'Con el/la profesional: GARCÍA JOSÉ LUIS'}

}