export const sortedDateDesc = (data) => {
  return data.sort((a, b) => new Date(b.date) - new Date(a.date));
};

// Сортировка по дате от меньшей к большей
export const sortedDateAsc = (data) => {
  return data.sort((a, b) => new Date(a.date) - new Date(b.date));
};
