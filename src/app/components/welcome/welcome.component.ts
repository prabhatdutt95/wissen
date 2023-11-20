import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../interfaces/user';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
})
export class WelcomeComponent implements OnInit {
  user!: User;
  constructor(
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const userId = params.get('userId');
      if (userId) {
        this.authenticationService
          .getUserDetails(Number(userId))
          .subscribe((user) => {
            console.log('user data in welcome', user.data);
            this.user = user.data;
          });
      }
    });
  }

  ngOnDestroy() {}
}
