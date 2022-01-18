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

  @Input() error: string = 'test';

  @Output() submitEM = new EventEmitter();

  constructor(private router: Router, private db: FirebaseDataProviderService) { }

  ngOnInit(): void {
  }

  submit() {
    console.clear();
    if (this.form.valid && this.form.value.username) {

      this.db.getUserByName(this.form.value.username).then(response => {

        this.submitEM.emit(this.form.value);
        let user = response;
        if (response)
          console.log(response)
        else
          console.log("not found")
        // console.log("Document data:", docSnap.data())
        // localStorage.setItem('user', JSON.stringify({ userName: this.form.value.username }));
        // this.router.navigate(['home']);

      })
    }
  }

}
