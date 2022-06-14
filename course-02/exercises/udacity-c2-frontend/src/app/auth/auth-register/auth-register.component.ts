import { Component, OnInit } from '@angular/core';
import { Validators, UntypedFormBuilder, UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user.model';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-auth-register',
  templateUrl: './auth-register.component.html',
  styleUrls: ['./auth-register.component.scss'],
})
export class AuthRegisterComponent implements OnInit {

  registerForm: UntypedFormGroup;
  error: string;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private auth: AuthService,
    private modal: ModalController
  ) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      password_confirm: new UntypedFormControl('', Validators.required),
      password: new UntypedFormControl('', Validators.required),
      email: new UntypedFormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      name: new UntypedFormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+$')
      ]))
    }, { validators: this.passwordsMatch });
  }

  onSubmit($event) {
    $event.preventDefault();

    if (!this.registerForm.valid) { return; }

    const newuser: User = {
      email: this.registerForm.controls.email.value,
      name: this.registerForm.controls.name.value
    };

    this.auth.register(newuser, this.registerForm.controls.password.value)
              .then((user) => {
                this.modal.dismiss();
              })
             .catch((e) => {
              this.error = e.statusText;
              throw e;
             });
  }

  passwordsMatch(group: UntypedFormGroup) {
    return group.controls.password.value === group.controls.password_confirm.value ? null : { passwordsMisMatch: true };
  }
}
