import { Component, OnInit } from '@angular/core';
import { User } from '../../interface/user'
import { AngularFireAuth } from '@angular/fire/auth';
import { ToastController, LoadingController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  usuario = {} as User;

  constructor(
    private afAuth: AngularFireAuth,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    
  }

  async login( us: User ){
    let loader = this.loadingCtrl.create({
      message: 'Por favor espere...'
    });
    (await loader).present();

    try{
      await this.afAuth.signInWithEmailAndPassword(us.email, us.pass).then(data => {
        console.log(data);
        this.navCtrl.navigateRoot("inicio");
      })
    } catch(e){
      this.showToast("Error "+e)
    }
    (await loader).dismiss();
  }

  showToast(message: string){
    this.toastCtrl.create({
      message: message,
      duration: 3000
    }).then( toasData => toasData.present());
  }

}
