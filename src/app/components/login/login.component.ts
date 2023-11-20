import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  submitted = false;
  passwordVisible = false;
  termsAndCondition: any;
  @ViewChild('passwordInput') passwordInput!: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthenticationService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    const authToken = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');

    if (authToken !== null && userId !== null) {
      this.autoLogin();
    } else {
      // setup the loginform and validators
      this.loginForm = this.formBuilder.group({
        email: ['', [Validators.required, Validators.min(6)]],
        password: [
          '',
          [
            // Min 1 uppercase, 1 lower case and a digit. Total length >= 8
            Validators.required,
            Validators.min(8),
            // Please uncomment below line for adding the required pattern validation.
            // Line `51` has been commented since there was a user with password: cityslicka;
            // This password doesnot fulfil the required parameters.
            // Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/),
          ],
        ],
        termsAndCondition: ['', Validators.required],
      });
    }
  }

  // Create a getter for easy access to form controls
  get formControls() {
    return this.loginForm.controls;
  }

  ngOnDestroy() {}

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe(
        (response) => {
          // Successful login
          const token = response.token;
          localStorage.setItem('authToken', token);

          this.authService.getUsersList().subscribe(
            (usersListResponse) => {
              console.log('List of users:', usersListResponse);
              const userId = usersListResponse.data.find(
                (user: any) => user.email === email
              ).id;

              localStorage.setItem('userId', userId);

              // There is no property called `username` in the response. So, replaced by `userId`
              // Navigate to 'welcome/:userId'
              this.router.navigate(['welcome', userId]);
            },
            (error) => console.error('Error fetching user list:', error)
          );
          // Show a success message (e.g., toast, popup)
          this.toastr.success('Successfully Logged In!', 'Login');
        },
        (error) => {
          // Handle login error
          console.error('Login error:', error);
          // Show an error message (e.g., toast, popup)
          this.toastr.error('Invalid username or password', 'Login', {
            timeOut: 3000,
          });
        }
      );
    }
  }

  // implement the username validator. Min 6 characters and no digits, special chars
  usernameValidator: ValidatorFn = (control: AbstractControl) => {
    const value: string = control.value;

    // Check if the username has at least 6 characters and does not contain digits or special characters
    const valid = value && value.length >= 6 && /^[a-zA-Z]+$/.test(value);

    return valid ? null : { invalidUsername: true };
  };

  togglePasswordVisibility() {
    const passwordInput = this.passwordInput.nativeElement;
    passwordInput.type =
      passwordInput.type === 'password' ? 'text' : 'password';
    this.passwordVisible = !this.passwordVisible;
  }

  autoLogin() {
    const userId = localStorage.getItem('userId');
    this.router.navigate(['welcome', userId]);
  }
}
