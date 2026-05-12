import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  readonly title = 'My Container App';
  readonly subtitle = 'A simple app that returns a response when you call it.';

  loading = false;
  error = '';
  response = 'Click "Call App" to test the API.';

  async callApp(): Promise<void> {
    this.loading = true;
    this.error = '';
    this.response = 'Loading...';

    try {
      const result = await fetch('/api/hello');
      const body = await result.json();
      this.response = JSON.stringify(body, null, 2);
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Request failed.';
      this.response = 'Unable to call the app.';
    } finally {
      this.loading = false;
    }
  }
}
