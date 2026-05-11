import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

type HealthStatus = 'Healthy' | 'Deploying' | 'Pending';

interface StatusCard {
  label: string;
  value: string;
  hint: string;
}

interface ChecklistItem {
  title: string;
  description: string;
  done: boolean;
}

interface ActivityItem {
  title: string;
  detail: string;
  tone: 'success' | 'info' | 'warning';
}

interface ApiSummary {
  status: string;
  contentType: string;
  lastChecked: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  readonly appName = 'Azure Test UI';
  readonly deployTarget = 'Azure Web App';
  readonly region = 'Canada Central';
  readonly health: HealthStatus = 'Healthy';
  readonly deployedAt = new Date().toLocaleString();
  readonly releaseLabel = 'Revision C';
  readonly sampleEndpoint = 'https://your-container-app.region.azurecontainerapps.io/api/health';

  readonly statusCards: StatusCard[] = [
    {
      label: 'Frontend',
      value: 'Angular Standalone',
      hint: 'Fast smoke test for App Service'
    },
    {
      label: 'Serving Mode',
      value: 'Express + Static Build',
      hint: 'Uses the Azure-assigned PORT'
    },
    {
      label: 'Build Target',
      value: 'Production',
      hint: 'Ready for `npm run build`'
    }
  ];

  readonly checklist: ChecklistItem[] = [
    {
      title: 'Build app',
      description: 'Run `npm run build` before deployment.',
      done: true
    },
    {
      title: 'Deploy to Azure',
      description: 'Publish the project root to your Web App.',
      done: false
    },
    {
      title: 'Verify health',
      description: 'Open the site URL and confirm this dashboard loads.',
      done: false
    }
  ];

  readonly activityFeed: ActivityItem[] = [
    {
      title: 'Second UI update prepared',
      detail: 'This revision adds a live API test panel so you can call your Azure Container App from the UI.',
      tone: 'success'
    },
    {
      title: 'Azure validation ready',
      detail: 'Once pushed, you can verify whether your Web App can read data from your Container App endpoint.',
      tone: 'info'
    },
    {
      title: 'Next test idea',
      detail: 'Try committing this update with a message like `Add container app API test panel`.',
      tone: 'warning'
    }
  ];

  apiUrl = '';
  apiMethod = 'GET';
  apiLoading = false;
  apiError = '';
  apiResponse = 'No response loaded yet.';
  apiSummary: ApiSummary | null = null;

  async fetchContainerAppData(): Promise<void> {
    if (!this.apiUrl.trim()) {
      this.apiError = 'Enter your Azure Container App API URL before sending the request.';
      this.apiSummary = null;
      return;
    }

    this.apiLoading = true;
    this.apiError = '';
    this.apiResponse = 'Loading response...';

    try {
      const response = await fetch(this.apiUrl.trim(), {
        method: this.apiMethod,
        headers: {
          Accept: 'application/json, text/plain;q=0.9, */*;q=0.8'
        }
      });

      const contentType = response.headers.get('content-type') ?? 'unknown';
      const rawBody = await response.text();

      this.apiSummary = {
        status: `${response.status} ${response.statusText}`,
        contentType,
        lastChecked: new Date().toLocaleString()
      };

      this.apiResponse = this.formatApiBody(rawBody, contentType);

      if (!response.ok) {
        this.apiError = 'The API responded, but with a non-success status code.';
      }
    } catch (error) {
      this.apiSummary = null;
      this.apiResponse = 'No response loaded yet.';
      this.apiError = this.describeApiError(error);
    } finally {
      this.apiLoading = false;
    }
  }

  private formatApiBody(rawBody: string, contentType: string): string {
    if (!rawBody.trim()) {
      return 'Response body was empty.';
    }

    if (contentType.includes('application/json')) {
      try {
        return JSON.stringify(JSON.parse(rawBody), null, 2);
      } catch {
        return rawBody;
      }
    }

    return rawBody;
  }

  private describeApiError(error: unknown): string {
    if (error instanceof Error) {
      return `${error.message}. If this is your Azure Container App, check CORS, public ingress, and the route path.`;
    }

    return 'Request failed. Check CORS, public ingress, and whether the API URL is reachable from the browser.';
  }

  get healthTone(): string {
    switch (this.health) {
      case 'Healthy':
        return 'healthy';
      case 'Deploying':
        return 'deploying';
      default:
        return 'pending';
    }
  }
}
