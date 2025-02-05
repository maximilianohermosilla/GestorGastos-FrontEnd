import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-header-banner',
  templateUrl: './header-banner.component.html',
  styleUrl: './header-banner.component.css'
})
export class HeaderBannerComponent {
  @Input() title: string = "";
  @Input() icon: string = "";

}
