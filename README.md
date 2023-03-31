## MVP
- ввести тип станка и нормы для каждого типа из таблицы
- добавить все необходимые поля показателей
- сборка, ci/cd, деплой на хостинг
- завести 5 инженеров

## Доработки
- проблемные показатели(норма/терпимые/критические)
- индикация проблемных станков
- сортировка, фильтрация
- норма показателей для каждого станка
- обучающая часть?

## Идеи

machine: {
  machineNumber: String,
  model: String,
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department'
  },
  indicators: [{
    ph,
    concentration
  }],
  type: 'точильный',
  operations: [ // ref: type
    {
      id: 'freeze',
      name: 'фрезирование'
    }
  ],
  standards: {
    operation1: { // ref: operation
      ph: 1,
      concentration: 2
    },
    operation2: { // ref: operation
      ph: 2,
      concentration: 3
    },
  }
}