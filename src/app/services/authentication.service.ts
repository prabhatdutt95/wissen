import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private apiUrl = 'https://reqres.in/api';
  private logoutTimer: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService
  ) {}

  login(email: string, password: string): Observable<any> {
    const body = { email, password };
    return this.http.post(`${this.apiUrl}/login`, body);
  }

  getHeaders(): HttpHeaders {
    // Retrieving token
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-type': 'application/json',
    });
    return headers;
  }

  getUsersList(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${this.apiUrl}/users`, { headers });
  }

  getUserDetails(userId: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${this.apiUrl}/users/${userId}`, { headers });
  }

  // Method to reset the timeout
  resetTimeout() {
    clearTimeout(this.logoutTimer);
    this.logoutTimer = setTimeout(() => {
      this.logout();
    }, 1 * 60 * 1000); // 5 minutes in milliseconds
  }

  // Call this method whenever there's user activity
  onUserActivity() {
    this.resetTimeout();
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    this.router.navigate(['/login']);
    this.toastr.error('Logging out due to inactivity', 'Logout', {
      timeOut: 3000,
    });
  }
}
