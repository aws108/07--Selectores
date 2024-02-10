import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountriesService } from '../../services/countries.service';
import { Region } from '../../interfaces/country.interfaces';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styleUrls: ['./selector-page.component.css']
})
export class SelectorPageComponent implements OnInit {

  myForm: FormGroup = this.fb.group({
    region: ['', Validators.required],
    country: ['', Validators.required],
    borders: ['', Validators.required],
  })

  constructor(private fb: FormBuilder,
              private countriesService: CountriesService){}

  ngOnInit(): void {
    this.onRegionChange();
  }


  get regions(): Region[]{
    return this.countriesService.regions; //1
  }

  onRegionChange(): void {
    this.myForm.get('region')?.valueChanges.pipe(switchMap(region => this.countriesService.getCountriesByRegion(region))).subscribe( region => { //2
      console.log('region - onRegionChange', region)
    });
  }

}


//1 -> Al ser privado countriesService, hace un getter de las regiones que le vienen por el getter del servicio
//2 -> Si el valor del formulario en cuanto a region ha cambiado, se suscribe y devuelve la región
// switchmap recibes un observable y te suscribes a otro observable
// 2-> toma por argumento el campo del formulario, y si hay un cambio, emite un valor, que es tomado por switchMap, crea un nuevo observable.
// Por cada valor emitido, se llama a la función de la service, hace la solicitud http para obtener los países que pertenecen al continente
// y una vez obtenido, se suscribe a la obtención de estos datos.