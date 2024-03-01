import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountriesService } from '../../services/countries.service';
import { Region, SmallCountry } from '../../interfaces/country.interfaces';
import { filter, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styleUrls: ['./selector-page.component.css']
})
export class SelectorPageComponent implements OnInit {

  countriesByRegion: SmallCountry[] = [];
  bordersByCountry: SmallCountry[] = [];

  myForm: FormGroup = this.fb.group({
    region: ['', Validators.required],
    country: ['', Validators.required],
    border: ['', Validators.required],
  })

  constructor(private fb: FormBuilder,
              private countriesService: CountriesService){}

  ngOnInit(): void {
    this.onRegionChange();
    this.onCountryChange();
  }


  get regions(): Region[]{
    return this.countriesService.regions; //1
  }

  onRegionChange(): void {
    this.myForm.get('region')?.valueChanges.pipe(
      tap( () => this.myForm.get('country')!.setValue('')), //3
      tap( () => this.bordersByCountry = []), // cuando carga la región, los bordes se limpian
      switchMap(region => this.countriesService.getCountriesByRegion(region))).subscribe( countries => { //2
      this.countriesByRegion = countries;
    });
  }

  onCountryChange():void {
    this.myForm.get('country')?.valueChanges.pipe(
      tap( () => this.myForm.get('border')!.setValue('')), //3
      filter((value: string) => value.length>0), //4
      switchMap(alphaCode => this.countriesService.getCountryByAlphaCode(alphaCode)), 
      switchMap(country => this.countriesService.getCountryBordersByCodes(country.borders))).subscribe( countries => { //2
      this.bordersByCountry = countries;
    });
  }

}


//1 -> Al ser privado countriesService, hace un getter de las regiones que le vienen por el getter del servicio
//2 -> Si el valor del formulario en cuanto a region ha cambiado, se suscribe y devuelve la región
// switchmap recibes un observable y te suscribes a otro observable
// 2-> toma por argumento el campo del formulario, y si hay un cambio, emite un valor, que es tomado por switchMap, crea un nuevo observable.
// Por cada valor emitido, se llama a la función de la service, hace la solicitud http para obtener los países que pertenecen al continente
// y una vez obtenido, se suscribe a la obtención de estos datos.
// 3-> Si e valor cambió en región, country es un string vacío y se tiene que setear
// 4-> Si devuelve un true, continúa hacia el switchmap, sino se para la ejecución