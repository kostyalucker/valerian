## MVP
- protected routes
- почистить бд и завести пользователей
- завести 2 владельца по 2 цеха, с 4 станками
- добавить оставшиеся показатели
- протестировать

### Подготовка к тестированию MVP
- завести 5 инженеров
- завести заказчиков, привязать к ним их заводы
- завести цеха для каждого завода
- завести станки для каждого цеха
- проверить доступность данных 
- записать вводный скринкаст для онбоардинга

## Доработки
- проблемные показатели(норма/терпимые/критические)
- индикация проблемных станков
- сортировка, фильтрация
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