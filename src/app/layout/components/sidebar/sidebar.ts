import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  navItems = [
    {
      label: 'Inventory',
      icon: 'fa-solid fa-cubes-stacked',
      route: '/inventory',
    },
    {
      label: 'Billing / POS',
      icon: 'fa-solid fa-cash-register',
      route: '/billing',
    },
    {
      label: 'Sales History',
      icon: 'fa-solid fa-receipt',
      route: '/sales',
    },
    {
      label: 'Reports',
      icon: 'fa-solid fa-chart-line',
      route: '/reports',
    },
  ];
}
