export default (colors) => {
    const fecha = new Date();
    const hora = fecha.getHours();
    const minutos = fecha.getMinutes();
    const segundos = fecha.getSeconds();

    // Formatear los valores de hora, minutos y segundos para que siempre tengan 2 dígitos
    const horaFormateada = hora.toString().padStart(2, '0');
    const minutosFormateados = minutos.toString().padStart(2, '0');
    const segundosFormateados = segundos.toString().padStart(2, '0');

    console.log(colors.red(`${horaFormateada}:${minutosFormateados}:${segundosFormateados}`));
}