export const createUserFields = () => {
  return [
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
      dependentExist: "role",
    },
    {
      name: "patronomyc",
      label: "Отчество",
      required: true,
      defaultValue: "",
      component: "input",
      type: "text",
      dependentExist: "role",
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
  ];
};

export const createUserFieldsCustomer = () => {
  return [
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
      name: "type",
      label: "Тип оборудования",
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
      label: "Емкость системы СОЖ (л)",
      required: true,
      defaultValue: "",
      component: "input",
      type: "number",
    },
    {
      name: "oilName",
      label: "Название СОЖ",
      required: true,
      defaultValue: "",
      component: "input",
      type: "text",
    },
    {
      name: "recommendeConcentration",
      label: "Рекомендуемая концентрация",
      required: true,
      defaultValue: "",
      component: "input",
      type: "number",
    },
    {
      name: "fillingDate",
      label: "Дата заливки",
      required: true,
      defaultValue: "",
      component: "input",
      type: "date",
    },
    {
      name: "refractionCoefficient",
      label: "Коэф. рефракции",
      required: true,
      defaultValue: "",
      component: "input",
      type: "number",
    },
    {
      name: "phMin",
      label: "pH Мин/Значение",
      required: true,
      defaultValue: "",
      component: "input",
      type: "number",
    },
    {
      name: "phMax",
      label: "pH Макс/Значение",
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
      name: "name",
      label: "Укажите номер/название цеха:",
      required: true,
      defaultValue: "",
      component: "input",
      type: "text",
    },
    {
      name: "contactName",
      label: "Ф.И.О.",
      required: true,
      defaultValue: "",
      component: "input",
      type: "text",
    },
    {
      name: "position",
      label: "Должность",
      required: true,
      defaultValue: "",
      component: "input",
      type: "text",
    },
    {
      name: "contactPhone",
      label: "Телефон",
      required: true,
      defaultValue: "",
      component: "input",
      type: "text",
    },
    {
      name: "contactEmail",
      label: "E-mail",
      required: true,
      defaultValue: "",
      component: "input",
      type: "text",
    },
  ];
};
