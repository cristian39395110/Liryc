export const tecnicos = [
    { id: 519, name: 'Eduardo Maldonado', rol: 'Tecnico', email: 'edu@gmail.com', documento: '37505981' },
    { id: 520, name: 'Ana López', rol: 'Tecnico', email: 'ana@gmail.com', documento: '987654321' },
    { id: 521, name: 'Carlos Gómez', rol: 'Tecnico', email: 'carlos@gmail.com', documento: '111222333' },
    { id: 522, name: 'Laura Martínez', rol: 'Tecnico', email: 'laura@gmail.com', documento: '444555666' }
  ];
  export function verificarSiEsTecnico(documento) {
    return tecnicos.find(tecnico => tecnico.documento === documento);
  }