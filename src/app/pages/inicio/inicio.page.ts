import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { NavController, LoadingController, AlertController, ToastController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  email: string = '';
  data: any;
  numdat: number = 0;

  constructor(
    private afAuth: AngularFireAuth,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private firestore: AngularFirestore
  ) { }

  ngOnInit() {
    this.getInfoUser();
  }

  ionViewWillEnter(){
    this.getUsers();
  }

  async singOut(){
    let loader = this.loadingCtrl.create({
      message: 'Cerrando sesión'
    });
    (await loader).present();
    this.afAuth.signOut().then( exit => {
      console.log('Se ha cerrado la sesión');
      this.navCtrl.navigateRoot('login');
    }).catch( exit => {
      console.log(exit);
    });
    (await loader).dismiss();
  }

  getInfoUser(){
    this.afAuth.onAuthStateChanged( data => {
      if (data) {
        this.email = data.email
      }
      else {
        console.log('Usuario ha cerrado sesión');
      }
    })
  }

  async getUsers(){
    let loader = await this.loadingCtrl.create({
      message: 'Obteniendo usuarios, espere...'
    });
    loader.present();
    try{
      this.firestore.collection("usuarios").snapshotChanges().subscribe( data => {
        this.numdat = data.length;
        this.data = data.map( e => {
          return{
            id: e.payload.doc.id,
            nombre: e.payload.doc.data()["nombre"],
            unidad: e.payload.doc.data()["unidad"],
            osversion: e.payload.doc.data()["osversion"],
            modelo: e.payload.doc.data()["modelo"]
          };
        });
        loader.dismiss();
      });
    }
    catch(e){
      this.showToast('Error: '+e);
    }
  }

  async exitConfirm(){
    const alert = await this.alertCtrl.create({
      header: 'Cerrar sesión',
      message: 'Estas a punto de salir de la sesión, ¿desea continuar?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Salir',
          handler: () => {
            this.singOut();
          }
        }
      ]
    });
    await alert.present();
  }

  async delete(id: string){
    let loader = this.loadingCtrl.create({
      message: 'Eliminando usuario'
    });
    (await loader).present();

    await this.firestore.doc("usuarios/"+id).delete();
    
    (await loader).dismiss();
  }

  async deleteConfirm(id: string){
    let alert = this.alertCtrl.create({
      header: 'Eliminar registro',
      message: 'Estas a punto de eliminar este registro <br> ¿Estás seguro?',
      buttons: [
        {
          text: 'Confirmar',
          handler: () => {
            this.delete(id);
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'danger'
        }
      ]
    });
    (await alert).present();
  }

  showToast(message: string){
    this.toastCtrl.create({
      message: message,
      duration: 3000
    }).then( toasData => toasData.present());
  }

}
