import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './proposal';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseApiUrl: string;

  constructor(private http: HttpClient) { 
    this.baseApiUrl = "http://localhost:8080/users";
  }

  authenticate(username: string, password?: string): Observable<any> {
    console.log(username, password);
    
    let headers: HttpHeaders = new HttpHeaders({
      'Authorization': 'Basic ' + btoa(username + ':' + password),
      'Content-Type': 'application/json'
    });

    // let body = new URLSearchParams();
    // body.set('username', username);
    // body.set('password', password!);
    
    return this.http.get(`${this.baseApiUrl}/getUser`, {headers: headers});
  }

  save(user: User): Observable<any> {
    let headers: HttpHeaders = new HttpHeaders({
      //'Authorization': 'Basic ' + btoa(user.username + ':' + user.password),
      'Content-Type': 'application/json'
    });

    // let body = new URLSearchParams();
    // body.set('username', username);
    // body.set('password', password!);
    
    return this.http.post(`${this.baseApiUrl}/save`, user, {headers: headers});
  }
}
