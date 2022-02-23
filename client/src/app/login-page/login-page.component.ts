import { Component, OnDestroy, OnInit } from '@angular/core';
import { Form, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})

export class LoginPageComponent implements OnInit, OnDestroy {

  
  

  constructor(private auth: AuthService, private router: Router, private route: ActivatedRoute) { } 

  form!: FormGroup
  aSub!: Subscription 

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl(null,[Validators.required, Validators.email]),
      password: new FormControl(null,[Validators.required, Validators.minLength(6)])
    })
    this.route.queryParams.subscribe((params:Params)=>{
      if(params['registered']){
        //теперь вы можете зайти в систему используя свои данные
      }  else if (params['accessDenied']) {
        // для начала авторизуйтесь в системе
      }
    })
  }
  ngOnDestroy() {
    if(this.aSub){this.aSub.unsubscribe()}
  }

  onSubmit(){
    this.form.disable()
 
    this.aSub = this.auth.login(this.form.value).subscribe(
      ()=> this.router.navigate(['/overview']),
      error => {
        console.warn(error)
        this.form.enable()
      }
    )
  }

}
