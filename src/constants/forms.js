export const createUserFields = () => {
  return [
    {
      name: "firstName",
      label: "Имя",
      required: true,
      defaultValue: "",
      component: "input",
      type: "text",
      dependentExist: null,
    },
    {
      name: "lastName",
      label: "Фамилия",
      required: true,
      defaultValue: "",
      component: "input",
      type: "text",
      dependentExist: null,
    },
    {
      name: "patronomyc",
      label: "Отчество",
      required: true,
      defaultValue: "",
      component: "input",
      type: "text",
      dependentExist: null,
    },
    {
      name: "inn",
      label: "ИНН",
      defaultValue: "",
      component: "input",
      dependentExist: ["role"],
    },
    {
      name: "region",
      label: "Регион",
      defaultValue: "",
      component: "input",
      required: true,
      type: "text",
    },
    {
      name: "city",
      label: "Город",
      defaultValue: "",
      component: "input",
      required: true,
      type: "text",
    },
    {
      name: "address",
      label: "Улица, дом",
      defaultValue: "",
      component: "input",
      required: true,
      type: "text",
    },
    {
      name: "email",
      label: "Email",
      required: true,
      defaultValue: "",
      component: "input",
      dependentExist: null,
      type: "email",
    },
    {
      name: "password",
      label: "Пароль",
      required: true,
      defaultValue: "",
      component: "input",
      dependentExist: null,
      type: "password",
    },
    {
      name: "role",
      label: "Роль",
      required: true,
      defaultValue: "ADMIN",
      component: "select",
      dependentExist: null,
      options: [
        {
          value: "ADMIN",
          label: "Администратор",
        },
        {
          value: "ENGINEER",
          label: "Инженер",
        },
        {
          value: "MANAGER",
          label: "Менеджер",
        },
        {
          value: "CUSTOMER",
          label: "Заказчик",
        },
      ],
    },
  ];
};

export const createUserFieldsCustomer = () => {
  return [
    {
      name: "companyName",
      label: "Имя компании",
      required: true,
      defaultValue: "",
      component: "input",
      type: "text",
      dependentExist: null,
    },
    {
      name: "inn",
      label: "ИНН",
      defaultValue: "",
      component: "input",
      dependentExist: ["role"],
    },
    {
      name: "region",
      label: "Регион",
      defaultValue: "",
      component: "input",
      required: true,
      type: "text",
    },
    {
      name: "city",
      label: "Город",
      defaultValue: "",
      component: "input",
      required: true,
      type: "text",
    },
    {
      name: "address",
      label: "Улица, дом",
      defaultValue: "",
      component: "input",
      required: true,
      type: "text",
    },
    {
      name: "email",
      label: "Email",
      required: true,
      defaultValue: "",
      component: "input",
      dependentExist: null,
      type: "email",
    },
    {
      name: "password",
      label: "Пароль",
      required: true,
      defaultValue: "",
      component: "input",
      dependentExist: null,
      type: "password",
    },
    {
      name: "role",
      label: "Роль",
      required: true,
      defaultValue: "ADMIN",
      component: "select",
      dependentExist: null,
      options: [
        {
          value: "CUSTOMER",
          label: "Заказчик",
        },
      ],
    },
  ];
};

export const createMachineFields = () => {
  return [
    {
      name: "machineNumber",
      label: "Номер станка",
      required: true,
      defaultValue: "",
      component: "input",
      type: "text",
    },
    {
      name: "model",
      label: "Модель",
      required: true,
      defaultValue: "",
      component: "input",
      type: "text",
    },
    {
      name: "machineCapacity",
      label: "Емкость системы",
      required: true,
      defaultValue: "",
      component: "input",
      type: "number",
    },
  ];
};

export const createDepartmentFields = () => {
  return [
    {
      name: "departmentNumber",
      label: "Название цеха",
      required: true,
      defaultValue: "",
      component: "input",
      type: "text",
    },
  ];
};
