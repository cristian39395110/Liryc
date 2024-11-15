export default (data) => {
  //FUNCION PARA FORMATEAR EL TIEMPO
  let date = new Date(data * 1000);
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  // Hours part from the timestamp
  let hours = date.getHours();
  // Minutes part from the timestamp
  let minutes = "0" + date.getMinutes();
  // Seconds part from the timestamp
  let seconds = "0" + date.getSeconds();
  // Will display time in 10:30:23 format
  let formattedTime =
    day +
    "/" +
    month +
    "/" +
    year +
    " - " +
    hours +
    ":" +
    minutes.substr(-2) +
    ":" +
    seconds.substr(-2);
  return formattedTime;
};
