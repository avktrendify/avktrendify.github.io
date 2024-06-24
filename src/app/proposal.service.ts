import { Injectable } from '@angular/core';
import { AvakinItem } from './avakinitem';
import { Proposal } from './proposal';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProposalService {

  private baseApiUrl: string;

  constructor(private http: HttpClient) { 
    this.baseApiUrl = "http://localhost:8080/proposals";
  }

  get(uuid: string): Observable<any> {
    return this.http.get(`${this.baseApiUrl}/` + uuid);
  }

  getAll(): Observable<any> {
    return this.http.get(`${this.baseApiUrl}/active`);
  }

  vote(proposal: Proposal, item: AvakinItem, username: string, password?: string): Observable<any> {
    let headers: HttpHeaders = new HttpHeaders({
      'Authorization': 'Basic ' + btoa(username + ':' + password),
      'Content-Type': 'application/json'
    });

    let params: any = {
      id: proposal.id,
      itemId: item.it_id
    };

    return this.http.get(`${this.baseApiUrl}/vote`, {params: params, headers: headers});
  }

  save(proposal: Proposal, username?: string, password?: string): Observable<any> {
    let headers: HttpHeaders = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'})
    headers = headers.set('Authorization',  `Basic ${btoa(username + ":" + password)}`);
    console.log(proposal);
    let data: string = JSON.stringify(proposal);
    console.log(data);
    return this.http.post(`${this.baseApiUrl}/save`, data, {headers: headers});
  }
}