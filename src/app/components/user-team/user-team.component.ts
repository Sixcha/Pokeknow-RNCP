import { Component, OnInit } from '@angular/core';
import { TeamService } from '../../services/team.service';

@Component({
  selector: 'app-user-team',
  templateUrl: './user-team.component.html',
})
export class UserTeamComponent implements OnInit {
  team: any[] = [];

  constructor(private teamService: TeamService) {}

  ngOnInit(): void {
    this.loadTeam();
  }

  loadTeam(): void {
    this.teamService.getTeam().subscribe((data: any[]) => {
      this.team = data;
    });
  }
}