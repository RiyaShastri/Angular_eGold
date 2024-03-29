import * as moment from "moment";

export const TABLE_COLUMNS = [
  {
    columnDef: "select",
    header: "",
    cell: (element: any) => `${element.select}`,
  },
  {
    columnDef: "depositor",
    header: "Depositor",
    cell: (element: any) => `${element.depositor}`,
    controlType: "Label",
    isControlRequired: true,
    isValidationPattern: null,
    placeholder: "Depositor",
    isNotEditableCell: false,
  },
  {
    columnDef: "order_id",
    header: "Order ID",
    cell: (element: any) => `${element.order_id}`,
    controlType: "Label",
    isControlRequired: true,
    isValidationPattern: null,
    placeholder: "OrderID",
    isNotEditableCell: false,
  },
  {
    columnDef: "shop_order_id",
    header: "Shop Order ID",
    cell: (element: any) => `${element.shop_order_id}`,
    controlType: "Label",
    isControlRequired: true,
    isValidationPattern: null,
    placeholder: "Shop Order ID",
    isNotEditableCell: false,
  },
  {
    columnDef: "source",
    header: "Source",
    cell: (element: any) => `${element.source}`,
    controlType: "Label",
    isControlRequired: true,
    isValidationPattern: null,
    placeholder: "Source",
    optionskey: "order_source",
    isNotEditableCell: false,
  },
  {
    columnDef: "created",
    header: "Time",
    cell: (element: any) =>
      `${moment(element.created).format("YYYY-MM-DD HH:MM")}`,
    controlType: "Label",
    isControlRequired: true,
    isValidationPattern: null,
    placeholder: "Time",
    isNotEditableCell: false,
  },
  {
    columnDef: "status",
    header: "Status",
    cell: (element: any) => `${element.status}`,
    controlType: "select",
    isControlRequired: true,
    isValidationPattern: null,
    placeholder: "Status",
    optionsKey: "order_status",
    isNotEditableCell: false,
  },

  {
    columnDef: "shipping_type",
    header: "ShippingType",
    cell: (element: any) => `${element.shipping_type}`,
    controlType: "select",
    isControlRequired: true,
    isValidationPattern: null,
    placeholder: "ShippingType",
    optionsKey: "dim_shipping_types",
    isNotEditableCell: false,
  },
  {
    columnDef: "courier",
    header: "Courier",
    cell: (element: any) => `${element.courier}`,
    controlType: "select",
    isControlRequired: true,
    isValidationPattern: null,
    placeholder: "Courier",
    optionsKey: "dim_couriers",
    isNotEditableCell: false,
  },
  {
    columnDef: "city",
    header: "City",
    cell: (element: any) => `${element.city}`,
    controlType: "text",
    isControlRequired: true,
    isValidationPattern: null,
    placeholder: "City",
    isNotEditableCell: false,
  },
  {
    columnDef: "street",
    header: "Address",
    cell: (element: any) => `${element.street}`,
    controlType: "text",
    isControlRequired: true,
    isValidationPattern: null,
    placeholder: "Address",
    isNotEditableCell: false,
  },
  {
    columnDef: "house_num",
    header: "House No.",
    cell: (element: any) => `${element.house_num}`,
    controlType: "text",
    isControlRequired: true,
    isValidationPattern: null,
    placeholder: "House No.",
    isNotEditableCell: false,
  },
  {
    columnDef: "zip",
    header: "Zip",
    cell: (element: any) => `${element.zip}`,
    controlType: "text",
    isControlRequired: true,
    isValidationPattern: null,
    placeholder: "Zip",
    isNotEditableCell: false,
  },
  {
    columnDef: "recipient_name",
    header: "Recipient Name",
    cell: (element: any) => `${element.recipient_name}`,
    controlType: "text",
    isControlRequired: true,
    isValidationPattern: null,
    placeholder: "Recipient Name",
    isNotEditableCell: false,
  },
  {
    columnDef: "recipient_phone",
    header: "Recipient Phone",
    cell: (element: any) => `${element.recipient_phone}`,
    controlType: "text",
    isControlRequired: true,
    isValidationPattern: null,
    placeholder: "Recipient Phone",
    isNotEditableCell: false,
  },
  {
    columnDef: "user",
    header: "Updated By",
    cell: (element: any) => `${element.user}`,
    controlType: "Label",
    isControlRequired: false,
    isValidationPattern: null,
    placeholder: "Updated By",
    isNotEditableCell: false,
  },
  {
    columnDef: "editSelect",
    header: "Editable",
    cell: (element: any) => `${element.editSelect}`,
    controlType: "checkBox",
    isControlRequired: false,
    isValidationPattern: null,
    placeholder: "Editable",
    isNotEditableCell: true,
  },

  {
    columnDef: "action",
    header: "",
    cell: (element: any) => `${element.Action}`,
  },
];
