import { Injectable } from '@angular/core';
import { AvakinItem } from './avakinitem';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Proposal } from './proposal';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  private baseApiUrl: string;

  constructor(private http: HttpClient) { 
    this.baseApiUrl = "http://localhost:8080/items";
  }

  search(title: string, category?: string, page?: number): Observable<any> {
    let params: any = {
      title: title
    };

    if (page) params.page = page;
    if (category) params.category = category;

    return this.http.get(`${this.baseApiUrl}`, {
      params: params
    });
  }

  
}

//   get(id: number): Observable<any> {
//     return this.http.get(`${this.baseApiUrl}/get/${id}`);
//   }

//   save(diostory: Diostory): Observable<any> {
//     let data: string = JSON.stringify({ "payload": diostory });
//     return this.http.post(`${this.baseApiUrl}/save`, data);
//   }

//   uploadImage(file: any): Observable<any> {
//     // Create form data
//     const formData = new FormData();
      
//     // Store form name as "file" with file data
//     formData.append("file", file, file.name);

//     let headers = new HttpHeaders();
//     headers.append("Content-Type", "multipart/form-data");
//     return this.http.post(`${this.baseApiUrl}/uploadImage`, formData, { headers: headers });
//   }
  
//   getAbsoluteImageUrl(relativeUrl: string): string {
//     return `${this.baseApiUrl}/img${relativeUrl}`;
//   }
// }
