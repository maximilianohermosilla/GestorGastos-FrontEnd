import { Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { Banco } from 'src/app/models/banco';
import { Empresa } from 'src/app/models/empresa';
import { ObjetoNombre } from 'src/app/models/objeto-nombre';
import { TipoCuenta } from 'src/app/models/tipoCuenta';
import { TipoTarjeta } from 'src/app/models/tipoTarjeta';
import { BancoService } from 'src/app/services/banco.service';
import { EmpresaService } from 'src/app/services/empresa.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { TipoCuentaService } from 'src/app/services/tipocuenta.service';
import { TipoTarjetaService } from 'src/app/services/tipotarjeta.service';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-abm-nombre',
  templateUrl: './abm-nombre.component.html',
  styleUrls: ['./abm-nombre.component.css']
})
export class AbmNombreComponent {
  @ViewChild(MatTable, { static: true }) table!: MatTable<any>;
  dataSource: any;
  nombreColumnas: string[] = ["nombre", "acciones"];
  formGroup: FormGroup;
  datos: ObjetoNombre = {id: 0, nombre: "", clase: ""};
  title = "";
  clase = "";

  constructor(private bancoService: BancoService, private empresaService: EmpresaService, private tipoCuentaService: TipoCuentaService, private tipoTarjetaService: TipoTarjetaService,
     private formBuilder: FormBuilder, public spinnerService: SpinnerService, public refDialog: MatDialogRef<AbmNombreComponent>, public dialogoConfirmacion: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: { clase: string; element: any; }) {
    
    this.title = "Nuevo " + data.clase;
    this.clase = data.clase;

    if (data.element != undefined) {
      this.datos = data.element;
      this.title = data.clase;
    }

    this.formGroup = this.formBuilder.group({
      nombre: ['',[Validators.required]],  
    })
  }
  
  ngOnInit(): void {
    
  }

  save(){    
    let _edit: ObjetoNombre = {id: this.datos.id, nombre: this.datos.nombre, clase: this.clase};   
        
    if (this.datos.id > 0){
      this.bancoService.actualizar(_edit).subscribe(
        result =>
        {
          this.refDialog.close(this.formGroup.value);                
          this.dialogoConfirmacion.open(DialogComponent, {
            width: '400px', data: {
              titulo: "Confirmación",
              mensaje: this.clase + " actualizada con éxito",
              icono: "check_circle",
              clase: "class-success"
            }
          });
          this.spinnerService.hide();
        },
        error => 
        {
          if (error.status == 401 || error.status == 403){
            error.error = "Usuario no autorizado";
          }
          this.dialogoConfirmacion.open(DialogComponent, {
            data: {
              titulo: "Error",
              mensaje: error.error,
              icono: "warning",
              clase: "class-error"
            }
          })
          this.refDialog.close();
          console.log(error);
          this.spinnerService.hide();
        }          
      );
    }
    else{     
      this.bancoService.nuevo(_edit).subscribe(
        result =>
        {
          this.refDialog.close(this.formGroup.value);
          this.dialogoConfirmacion.open(DialogComponent, {
            data: {
              titulo: "Confirmación",
              mensaje: this.clase + " ingresada con éxito",
              icono: "check_circle",
              clase: "class-success"
            }
          });
          this.spinnerService.hide();
        },
        error => {
          if (error.status == 401 || error.status == 403){
            error.error = "Usuario no autorizado";
          }
          this.dialogoConfirmacion.open(DialogComponent, {
            data: {
              titulo: "Error",
              mensaje: error.error,
              icono: "warning",
              clase: "class-error"
            }
          })
          this.refDialog.close();
          console.log(error);
          this.spinnerService.hide();
        }
      );
    }
  }

}