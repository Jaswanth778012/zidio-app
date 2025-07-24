import { Component } from '@angular/core';
import { TeamMember } from '../_model/TeamMember.model';
import { UserService } from '../_services/user.service';
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {
  team: TeamMember[] =[];

  clientsCount = 0;
  projectsCount = 0;
  teamCount = 0;
  broadbandCount = 0;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadTeamMembers();
    this.animateCount('clientsCount', 480);
    this.animateCount('projectsCount', 520);
    this.animateCount('teamCount', 50);
    this.animateCount('broadbandCount', 25);
  }
  loadTeamMembers(): void {
    this.userService.getTeam().subscribe({
      next: (team) => {
        this.team = team;
      },
      error: (err) => {
        console.error('Failed to load team members', err);
      }
    });
  }

 animateCount(
  field: 'clientsCount' | 'projectsCount' | 'teamCount' | 'broadbandCount',
  target: number
): void {
  let count = 0;
  let speed = 20; // default speed in ms

  // Set slower speed for specific fields
  if (field === 'teamCount' || field === 'broadbandCount') {
    speed = 50; // slower speed for these
  }

  const interval = setInterval(() => {
    if (count < target) {
      count++;
      this[field] = count;
    } else {
      clearInterval(interval);
    }
  }, speed);
}

}
