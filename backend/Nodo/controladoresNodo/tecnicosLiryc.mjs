export const tecnicos = [
    { id: 519, name: 'Eduardo Maldonado', rol: 'Técnico', email: 'edu@gmail.com', documento: '37505981' },
    { id: 520, name: 'Ana López', rol: 'Técnico', email: 'ana@gmail.com', documento: '987654321' },
    { id: 521, name: 'Carlos Gómez', rol: 'Técnico', email: 'carlos@gmail.com', documento: '111222333' },
    { id: 522, name: 'Laura Martínez', rol: 'Técnico', email: 'laura@gmail.com', documento: '444555666' }
  ];
  export function verificarSiEsTecnico(documento) {
    return tecnicos.find(tecnico => tecnico.documento === documento);
  }
  