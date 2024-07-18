import { Component, Input } from '@angular/core';
import { NameChangeProposal } from '../namechangeproposal';
import { NameChangeProposalService } from '../namechangeproposal.service';
import { User } from '../proposal';
import { Utilities } from '../utilities';

@Component({
  selector: 'app-name-change-proposal-list',
  templateUrl: './name-change-proposal-list.component.html',
  styleUrls: ['./name-change-proposal-list.component.css']
})
export class NameChangeProposalListComponent {

  changeProposals: NameChangeProposal[];
  service: NameChangeProposalService;

  @Input() user!: User;
  @Input() set show(value: boolean) {
    if (value === true) {
      this.service.getAll(this.user!.username!, this.user.password).subscribe(response => {
        for (var proposal of response.items) {
          this.changeProposals.push(proposal);
          this.changeProposals[this.changeProposals.length - 1].createdOn = new Date(proposal.createdOn);
          this.changeProposals[this.changeProposals.length - 1].actionedOn = new Date(proposal.actionedOn);
        }
        this.changeProposals = response.items;
      });
    }
    else {
      this.changeProposals = [];
    }
  }

  constructor(nameChangeProposalService: NameChangeProposalService) {
    this.show = false;

    this.service = nameChangeProposalService;
    this.changeProposals = [];
  }

  actionButtonClick(proposal: NameChangeProposal, approve: boolean): void {
    proposal.approved = approve;
    this.service.approve(proposal, this.user!.username, this.user.password).subscribe(response => {
      console.log(response);
      proposal.approved = response.approved;
      proposal.actionedBy = response.actionedBy;
      proposal.actionedOn = new Date(response.actionedOn);
    });
  }

  getDateAsString(date: Date): string {
    return Utilities.getDateAsString(date);
  }
}
