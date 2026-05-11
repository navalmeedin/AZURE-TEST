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
  readonly releaseLabel = 'Revision B';

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
      detail: 'This revision adds a release banner and action panel so the Azure version change is easy to notice.',
      tone: 'success'
    },
    {
      title: 'Azure validation ready',
      detail: 'Once pushed, you can verify whether your deployment flow reflects the new revision automatically.',
      tone: 'info'
    },
    {
      title: 'Next test idea',
      detail: 'Try committing this update with a message like `Add revision B Azure UI`.',
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
