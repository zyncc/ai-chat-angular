import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GeminiService {
  private apiUrl = 'http://localhost:3000/api/gemini';

  constructor(private http: HttpClient) {}

  getChatResponse(query: string): Observable<string> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { query };

    const res = this.http
      .post<{ response: string }>(this.apiUrl, body, { headers })
      .pipe(
        map((res) => res.response), // Extracting just the response string
        catchError((error) => {
          console.error('Error from API:', error);
          return throwError(() => new Error('Failed to fetch data from API'));
        })
      );
    console.log('RESPONSE:', res);
    return res;
  }
}
