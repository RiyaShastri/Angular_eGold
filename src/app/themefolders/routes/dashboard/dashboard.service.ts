import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class DashboardService {
  stats = [
    {
      title: "Total",
      subText: "Orders",
      amount: "0000",
    },
    {
      title: "Completed",
      subText: "Orders",
      amount: "0000",
    },
    {
      title: "In-progress",
      subText: "Orders",
      amount: "0000",
    },
    {
      title: "Pending",
      subText: "Orders",
      amount: "0000",
    },
    {
      title: "Canceled",
      subText: "Orders",
      amount: "0000",
    },
    {
      title: "Failed",
      subText: "Orders",
      amount: "0000",
    },
    {
      title: "Returned",
      subText: "Orders",
      amount: "0000",
    },
  ];

  inver = [
    {
      title: "Total",
      subText: "Items",
      amount: "0000",
    },
    {
      title: "In",
      subText: "Items",
      amount: "0000",
    },
    {
      title: "Out",
      subText: "Items",
      amount: "0000",
    },
  ];

  constructor(private http: HttpClient) {}

  getStats() {
    return this.stats;
  }
  getInver() {
    return this.inver;
  }
}
