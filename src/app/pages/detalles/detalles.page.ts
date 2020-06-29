import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Data } from 'src/app/interface/data';

@Component({
  selector: 'app-detalles',
  templateUrl: './detalles.page.html',
  styleUrls: ['./detalles.page.scss'],
})
export class DetallesPage implements OnInit {

  dataUser = {} as Data
  id: any;

  constructor(
    private firestore: AngularFirestore,
    private actRoute: ActivatedRoute,
    private loadingCtrl: LoadingController
  ) {
    this.id = this.actRoute.snapshot.paramMap.get("id");
  }

  ngOnInit() {
    this.getPostById(this.id);
  }

  async getPostById(id: string){
    let loader = this.loadingCtrl.create({
      message: 'Por favor espere...'
    });
    (await loader).present();

    this.firestore.doc("usuarios/"+id).valueChanges().subscribe( data => {
      this.dataUser.nombre = data["nombre"];
      this.dataUser.unidad = data["unidad"];
      this.dataUser.modelo = data["modelo"];
      this.dataUser.plataforma = data["plataforma"]
      this.dataUser.osversion = data["osversion"];
    });

    (await loader).dismiss();
  }


}
