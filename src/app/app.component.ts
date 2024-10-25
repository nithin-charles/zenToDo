import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'zen-to-do';
  /**
   *
   */
  constructor(private responsive: BreakpointObserver) {}

  ngOnInit(): void {
    // To Change the Layout to support Landscape Mode
    this.responsive
      .observe([
        Breakpoints.HandsetLandscape,
        Breakpoints.TabletLandscape,
        Breakpoints.WebLandscape,
      ])
      .subscribe((result) => {
        if (result.matches) {
          console.log('ZenToDo is now in Landscape Mode');
        }
      });

    this.responsive
      .observe([
        Breakpoints.HandsetPortrait,
        Breakpoints.TabletPortrait,
        Breakpoints.WebPortrait,
      ])
      .subscribe((result) => {
        if (result.matches) {
          console.log('ZenToDo is now in Landscape Mode');
        }
      });
  }
}
