import { Component, Input, OnInit } from '@angular/core';
import { Person } from 'src/app/models/users/Person';
import { LayoutComponent } from 'src/app/modules/layout/layout/layout.component';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { UsersService } from '../../shared/users.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {
  @Input() person: Person;
  name: string;
  constructor(_authService: AuthService, _usersService: UsersService, public app: LayoutComponent) {
    this.name = _authService.entityName;
  }

ngOnInit(): void {
}

}
