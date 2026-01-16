import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

import { PollutionNavbar } from './pollution_managment';
import { UserNavbar } from './user_managment';

import { FavoritePollutionsTag } from './pollution_managment/components/favorite-pollutions-tag/favorite-pollutions-tag';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet, 
    RouterLink, 
    PollutionNavbar, 
    UserNavbar
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('TP07-Alix-MIEHE');
}
