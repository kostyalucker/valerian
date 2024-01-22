export const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // +1 потому что нумерация месяцев начинается с 0
  const day = date.getDate().toString().padStart(2, "0"); // Добавляем ведущий ноль, если нужно
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${year - month - day} ${hours + "" + minutes}`;
};
