import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { ItemService } from './item.service';
import { AvakinItem } from './avakinitem';
import { ItemMatchup, Proposal, User } from './proposal';
import { ProposalService } from './proposal.service';
import { UserService } from './user.service';
import { Router, RoutesRecognized } from '@angular/router';
import { Observable, catchError, EMPTY } from 'rxjs';
import { NameChangeProposalEditorComponent } from './namechangeproposaleditor/namechangeproposaleditor.component';
import { NameChangeProposalListComponent } from './name-change-proposal-list/name-change-proposal-list.component';
import { Utilities } from './utilities';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'avakinitemdb-ui';
  currentView = "list";

  proposal: Proposal;
  proposals: Proposal[];
  itemTitle: string;
  searchItemsResults: AvakinItem[];

  // Services
  itemService: ItemService;
  proposalService: ProposalService;
  userService: UserService;

  currentPage: number;
  totalPages: number;

  // User
  username?: string;
  password?: string;
  uuid?: string;
  canCreate?: boolean;

  showLoginModal: boolean;
  isLoginModal: boolean;
  showPassword: boolean;
  errorMessage?: string;
  loginModalNextView = "list";

  showUserModal: boolean;

  isDarkTheme: boolean;
  isSpanish: boolean;

  @ViewChild(NameChangeProposalEditorComponent) nameChangeProposalEditor: NameChangeProposalEditorComponent | undefined;
  @ViewChild(NameChangeProposalListComponent) nameChangeProposalList: NameChangeProposalListComponent | undefined;

  coinImageUrl = "https://avakindb.com/assets/coins.f95e991c.png";
  crownImageUrl = "https://avakindb.com/assets/crowns.1502a84a.png";

  constructor(
    service: ItemService,
    proposalService: ProposalService,
    userService: UserService,
    private router: Router) {

    this.itemTitle = "";
    this.searchItemsResults = [];

    this.itemService = service;
    this.proposalService = proposalService;
    this.userService = userService;

    this.currentPage = 1;
    this.totalPages = 1;
    this.proposals = [];
    this.proposal = new Proposal();

    // Dark theme
    this.isDarkTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.isSpanish = true;

    let userdataJson = localStorage.getItem("userdata");
    if (userdataJson) {
      const userdata = JSON.parse(userdataJson);
      const auth = (atob(userdata.auth) as string).split(":");
      this.username = auth[0];
      this.password = auth[1];
      this.userService.authenticate(this.username, this.password).subscribe((response: any) => {
        localStorage.setItem('userdata', JSON.stringify({auth: response.auth, canCreate: response.canCreate}));
        console.log(response);
        this.canCreate = response.canCreate;

        this.nameChangeProposalEditor!.user = {
          username: this.username,
          password: this.password
        };
    
        this.nameChangeProposalList!.user = {
          username: this.username,
          password: this.password
        };
      });
    }

    // Login modal properties
    this.showLoginModal = false;
    this.isLoginModal = true;
    this.showPassword = false;

    this.showUserModal = false;

    // Retrieve list of proposals
    this.router.events.subscribe(val => {
      if (val instanceof RoutesRecognized) {
        const params: any = val?.state?.root?.firstChild?.params;
        console.log(val);
        if (params && params.id) {
          console.log("Found ID: " + params?.id);
          this.proposalService.get(params?.id as string).subscribe((response: any) => {
            this.loadProposal(response, false);
          });
        }
        else if (val.url === '/register/admin') {
          // Open registration modal for admins
          this.isLoginModal = false;
          this.showPassword = true;
          this.showLoginModal = true;
          this.loginModalNextView = 'list';
        }
        else {
          console.log("Loading list");
          this.loadProposalList();
        } 
      }
    });
    
  }

  // List methods
  loadProposalList(): void {
    this.proposalService.getAll().subscribe((response: any) => {
      console.log(response);
      this.proposals = response;
      this.currentView = "list";
    });
  }

  createProposalClick(): void {
    console.log(this.canCreate);
    if (this.canCreate === undefined) {
      // Login
      this.showPassword = true;
      this.showLoginModal = true;
      this.loginModalNextView = 'editor';
    }
    else if (this.canCreate === false) {
      alert("Lo sentimos, no tienes permisos para crear una propuesta");
    }
    else {
      this.proposal = new Proposal();
      this.currentView = "editor";
    }
  }

  loadProposal(proposal: Proposal, edit: boolean): void {
    this.proposal = new Proposal(proposal);
    this.currentView = edit === true ? "editor" : "viewer";
  }

  // Registration methods
  loginClick(): void {
    if (this.isLoginModal) {
      if (this.username)
        this.userService.authenticate(this.username!, this.password)
          .pipe(
            catchError((error, g) => {
              console.log(error);
              return EMPTY;
            })
          )
          .subscribe((response: any) => {
            this.canCreate = response.canCreate;
            localStorage.setItem('userdata', JSON.stringify({auth: response.auth, canCreate: response.canCreate}));
            this.showLoginModal = false;

            switch (this.loginModalNextView) {
              case "list":
                this.loadProposalList();
                break;
              case "editor":
                this.proposal = new Proposal();
                this.proposal.createdBy = {username: this.username} as User;
                this.currentView = "editor";
                break;
              case "vote":
                break;
            }
        });
    }
    else {
      console.log("Registration for: " + this.username);
      this.userService.save({username: this.username, password: this.password, isAdmin: (this.password !== undefined && this.password !== "")})
      .pipe(
        catchError((error, _) => {
          console.log(error);
          this.errorMessage = error.error;
          return EMPTY;
        })
      )
      .subscribe((response: any) => {
        this.showLoginModal = false;
        this.isLoginModal = true;

        console.log(response);


        localStorage.setItem('userdata', JSON.stringify({auth: btoa(response.username + ":" + response.password), canCreate: response.isAdmin}));
        this.username = response.username;
        this.password = response.password;
        this.canCreate = response.canCreate;
        this.showPassword = false;

        this.loadProposalList();
      });
    }
  }

  cancelLoginClick(): void {
    this.showLoginModal = false;
  }

  logoutButtonClick(): void {
    this.username = undefined;
    this.password = undefined;
    this.canCreate = undefined;
    localStorage.removeItem('userdata');
    this.showUserModal = false;
  }

  // Editor methods
  searchItems(page?: number) {
    this.itemService.search(this.itemTitle, undefined, this.isSpanish ? "es" : "en", page).subscribe((response: any) => {
      console.log(response);
      if (response) {
        this.searchItemsResults = response.items;
        this.currentPage = response.page;
        this.totalPages = response.totalPages;
      }
    });
  }

  selectItem(item: AvakinItem) {
    const idx = this.proposal.matchups.findIndex(x => x.item === item);
    if (idx === -1) {
      this.proposal.addMatchup(item);
    }

    this.searchItemsResults = [];
    this.itemTitle = "";
    this.currentPage = 1;
    this.totalPages = 1;
  }

  getCurrencyIcon(currency: string): string {
    if (currency === 'Coins') return "&#x1FA99;";
    if (currency === 'Crowns') return "&#x1F451;";
    return "";
  }

  prevPageButtonClick() {
    this.searchItems(this.currentPage - 1);
    window.scroll({ 
      top: 0, 
      left: 0, 
      behavior: 'smooth' 
    });
  }

  nextPageButtonClick() {
    this.searchItems(this.currentPage + 1);
    window.scroll({ 
      top: 0, 
      left: 0, 
      behavior: 'smooth' 
    });
  }

  saveButtonClick() {
    console.log(this.username, this.password);
    this.proposalService.save(this.proposal, this.username, this.password).subscribe((response: any) => {
      console.log(response);
      this.proposal = new Proposal(response);
    });
  }

  cancelButtonClick() {
    this.loadProposalList();
  }

  deleteProposalButtonClick() {
    // TODO: Edit
    this.proposal.isActive = false;
    this.proposalService.save(this.proposal, this.username, this.password).subscribe((response: any) => {
      this.loadProposalList();
    });
  }

  removeButtonClick(item: AvakinItem) {
    let idx = this.proposal.matchups.findIndex(x => x.item.it_id === item.it_id);
    if (idx > -1) {
      this.proposal.matchups.splice(idx, 1);
    }
  }

  // Matchup
  voteButtonClick(item: AvakinItem) {
    if (this.username === undefined) {
      this.loginModalNextView = 'vote';
      this.showPassword = false;
      this.isLoginModal = true;
      this.showLoginModal = true;
    }
    else {
      this.proposalService.vote(this.proposal, item, this.username, this.password).subscribe((response: any) => {
        console.log(response);
        this.proposal = new Proposal(response);
      });
    }
  }

  userHasItem(matchup: ItemMatchup): boolean {
    return matchup.users.map(x => x.username).indexOf(this.username) > -1;
  }

  nameChangeSuggestionClick(matchup: ItemMatchup): void {
    this.nameChangeProposalEditor!.setItem(matchup.item);
    this.nameChangeProposalEditor!.show = true;
  }

  openLoginModal(nextView?: string): void {
    this.loginModalNextView = nextView ?? "view";
    this.isLoginModal = true;
    this.showPassword = false;
    this.showUserModal = false; // Close just in case
    this.showLoginModal = true;
  }

  openAdminLoginModal(nextView?: string): void {
    this.loginModalNextView = nextView ?? "view";
    this.isLoginModal = true;
    this.showPassword = true;
    this.showUserModal = false; // Close just in case
    this.showLoginModal = true;
  }

  openRegistrationModal(): void {
    this.isLoginModal = false;
    this.showPassword = false; // This is just in case
    this.showUserModal = false; // Close just in case
    this.showLoginModal = true;
  }

  getDateAsString(date: Date): string {
    return Utilities.getDateAsString(date);
  }
}
