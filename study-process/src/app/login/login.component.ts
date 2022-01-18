import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseDataProviderService } from '../services/firebaseDataProvider.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup = new FormGroup({
    username: new FormControl('',
      Validators.required)
  });

  message: string | undefined;

  @Input() error: string = 'test';

  @Output() submitEM = new EventEmitter();

  constructor(private router: Router, private db: FirebaseDataProviderService) { }

  ngOnInit(): void {
    if (localStorage.getItem('user') !== undefined) {
      this.router.navigate(['home']);
      return;
    }

    this.form.valueChanges.subscribe(x => {
      this.message = undefined;
    })
  }

  submit() {
    

    if (this.form.valid && this.form.value.username) {

      this.db.getUserByName(this.form.value.username).then(response => {
        this.submitEM.emit(this.form.value);

        if (!response) {
          this.message = "User not found!"
          return;
        }

        console.log(response)
        localStorage.setItem('user', JSON.stringify(response));
        this.router.navigate(['home']);

        // console.log("Document data:", docSnap.data())

      })
    }
  }

}
