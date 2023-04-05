export const createUserFields = () => {
  return [
    {
      name: 'firstName',
      label: 'Имя',
      required: true,
      defaultValue: '',
      component: 'input',
      type: 'text',
    },
    {
      name: 'lastName',
      label: 'Фамилия',
      required: true,
      defaultValue: '',
      component: 'input',
      type: 'text',
    },
    {
      name: 'patronomyc',
      label: 'Отчество',
      required: true,
      defaultValue: '',
      component: 'input',
      type: 'text',
    },
    {
      name: 'email',
      label: 'Email',
      required: true,
      defaultValue: '',
      component: 'input',
      type: 'email',
    },
    {
      name: 'password',
      label: 'Пароль',
      required: true,
      defaultValue: '',
      component: 'input',
      type: 'password',
    },
    {
      name: 'role',
      label: 'Роль',
      required: true,
      defaultValue: 'ADMIN',
      component: 'select',
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
        name: 'department',
        label: 'Цех',
        required: true,
        defaultValue: defaultDepartmentValue,
        component: 'select',
        options: departments
      }
    ]
  };