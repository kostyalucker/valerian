export const createUserFields = () => {
  return [
    {
      name: 'firstName',
      label: 'Имя',
      required: true,
      defaultValue: '',
      component: 'input',
      type: 'text',
      dependentExist: null,
    },
    {
      name: 'lastName',
      label: 'Фамилия',
      required: true,
      defaultValue: '',
      component: 'input',
      type: 'text',
      dependentExist: null,
    },
    {
      name: 'patronomyc',
      label: 'Отчество',
      required: true,
      defaultValue: '',
      component: 'input',
      type: 'text',
      dependentExist: null,
    },
    {
      name: 'email',
      label: 'Email',
      required: true,
      defaultValue: '',
      component: 'input',
      dependentExist: null,
      type: 'email',
    },
    {
      name: 'password',
      label: 'Пароль',
      required: true,
      defaultValue: '',
      component: 'input',
      dependentExist: null,
      type: 'password',
    },
    {
      name: 'role',
      label: 'Роль',
      required: true,
      defaultValue: 'ADMIN',
      component: 'select',
      dependentExist: null,
      options: [
        {
          value: 'ADMIN',
          label: 'Администратор',
        },
        {
          value: 'ENGINEER',
          label: 'Инженер',
        },
        {
          value: 'MANAGER',
          label: 'Менеджер',
        },
        {
          value: 'CUSTOMER',
          label: 'Заказчик',
        },
      ]
    },
    {
      name: 'inn',
      label: 'ИНН',
      defaultValue: '',
      component: 'input',
      dependentExist: ['role']
    }
  ]
}

  export const createMachineFields = (types, departments) => {
    if (!types.length || !departments.length) {
      return [];
    }

    const defaultTypeValue= types[0].value;
    const defaultDepartmentValue = departments[0].value;

    return [
      {
        name: 'machineNumber',
        label: 'Номер станка',
        required: true,
        defaultValue: '',
        component: 'input',
        type: 'text',
      },
      {
        name: 'model',
        label: 'Модель',
        required: true,
        defaultValue: '',
        component: 'input',
        type: 'text',
      },
      {
        name: 'machineType',
        label: 'Тип станка',
        required: true,
        defaultValue: defaultTypeValue,
        component: 'select',
        options: types
      },
      {
        name: 'emulsionFillingDate',
        label: 'Дата заливки эмульсии',
        required: true,
        defaultValue: '',
        component: 'input',
        type: 'date',
      },
      {
        name: 'machineCapacity',
        label: 'Емкость системы',
        required: true,
        defaultValue: '',
        component: 'input',
        type: 'number',
      },
      {
        name: 'department',
        label: 'Цех',
        required: true,
        defaultValue: defaultDepartmentValue,
        component: 'select',
        options: departments
      }
    ]
  };