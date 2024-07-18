import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NameChangeProposal } from './namechangeproposal';

@Injectable({
  providedIn: 'root'
})
export class NameChangeProposalService {

  private baseApiUrl: string;

  constructor(private http: HttpClient) { 
    this.baseApiUrl = "http://kat98radio.duckdns.org:8083/itemChanges";
  }

  get(uuid: string): Observable<any> {
    return this.http.get(`${this.baseApiUrl}/` + uuid);
  }

  getAll(username: string, password?: string): Observable<any> {
    let headers: HttpHeaders = new HttpHeaders({
      'Authorization': 'Basic ' + btoa(username + ':' + password),
      'Content-Type': 'application/json'
    });

    return this.http.get(`${this.baseApiUrl}/active`, {headers: headers});
  }

  create(changeProposal: NameChangeProposal, username: string, password?: string): Observable<any> {
    let headers: HttpHeaders = new HttpHeaders({
      'Authorization': 'Basic ' + btoa(username + ':' + password),
      'Content-Type': 'application/json'
    });

    let params: any = {
      newTitle: changeProposal.newTitle,
      itemId: changeProposal.item.it_id
    };

    return this.http.get(`${this.baseApiUrl}/new`, {params: params, headers: headers});
  }

  approve(changeProposal: NameChangeProposal, username?: string, password?: string): Observable<any> {
    let headers: HttpHeaders = new HttpHeaders({
      'Authorization': 'Basic ' + btoa(username + ':' + password),
      'Content-Type': 'application/json'
    });

    let params: any = {
      id: changeProposal.id,
      approve: changeProposal.approved
    };

    return this.http.get(`${this.baseApiUrl}/approve`, {params: params, headers: headers});
  }
}
