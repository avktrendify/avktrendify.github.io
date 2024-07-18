import { Component, Input } from '@angular/core';
import { AvakinItem } from '../avakinitem';
import { NameChangeProposal } from '../namechangeproposal';
import { NameChangeProposalService } from '../namechangeproposal.service';

import { User } from '../proposal';

@Component({
  selector: 'app-name-change-proposal-editor',
  templateUrl: './namechangeproposaleditor.component.html',
  styleUrls: ['./namechangeproposaleditor.component.css']
})
export class NameChangeProposalEditorComponent {

  @Input() show: boolean;
  @Input() user!: User;

  changeProposal!: NameChangeProposal;
  changeProposalService: NameChangeProposalService;

  showSuccess: boolean;

  constructor(changeProposalService: NameChangeProposalService) {
    this.show = false;
    this.showSuccess = false;

    this.changeProposalService = changeProposalService;

    this.changeProposal = this.getEmptyProposal();
  }

  setItem(item: AvakinItem) {
    this.changeProposal.item = item;
  }

  createChangeProposalClick(): void {
    this.changeProposalService.create(this.changeProposal, this.user!.username!, this.user!.password).subscribe(response => {
      console.log(response);
      this.showSuccess = true;
      setInterval(() => {
        this.showSuccess = false;
      }, 5000);
    });
  }

  closeButtonClick(): void {
    this.show = false;
    this.changeProposal = this.getEmptyProposal();
  }

  private getEmptyProposal(): NameChangeProposal {
    return {
      newTitle: "",
      item: new AvakinItem()
    };
  }
}
