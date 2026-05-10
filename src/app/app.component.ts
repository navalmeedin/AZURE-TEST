import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

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

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  readonly appName = 'Azure Test UI';
  readonly deployTarget = 'Azure Web App';
  readonly region = 'Canada Central';
  readonly health: HealthStatus = 'Healthy';
  readonly deployedAt = new Date().toLocaleString();

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
      title: 'Git change prepared',
      detail: 'This refreshed layout gives you a clear visual diff for commit and push testing.',
      tone: 'success'
    },
    {
      title: 'Azure validation ready',
      detail: 'Once pushed, you can redeploy and confirm the new UI version appears in App Service.',
      tone: 'info'
    },
    {
      title: 'Next test idea',
      detail: 'Try committing this update with a message like `Update Azure smoke test UI`.',
      tone: 'warning'
    }
  ];

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
