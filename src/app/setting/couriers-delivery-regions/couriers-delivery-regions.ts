export const TABLE_COLUMNS = [
  {
    columnDef: "idx",
    header: "Id",
    cell: (element: any) => `${element?.idx}`,
    controlType: "Label",
  },
  {
    columnDef: "name",
    header: "Name",
    cell: (element: any) => `${element?.name}`,
    controlType: "text",
    isControlRequired: true,
    placeholder: "Name",
  },
  {
    columnDef: "shippings_daily_limit",
    header: "Daily Limit",
    cell: (element: any) => `${element?.shippings_daily_limit}`,
    controlType: "number",
    isControlRequired: true,
    placeholder: "Shippings Detail Limit",
  },
  {
    columnDef: "daily_count",
    header: "Daily Count",
    cell: (element: any) => `${element?.daily_count}`,
    controlType: "Label",
    placeholder: "Shippings Detail Limit",
  },
  {
    columnDef: "action",
    header: "",
    cell: (element: any) => `${element?.Action}`,
  }
];
