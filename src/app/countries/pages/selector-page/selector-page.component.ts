import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountriesService } from '../../services/countries.service';
import { Region } from '../../interfaces/country.interfaces';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styleUrls: ['./selector-page.component.css']
})
export class SelectorPageComponent {

  myForm: FormGroup = this.fb.group({
    region: ['', Validators.required],
    country: ['', Validators.required],
    borders: ['', Validators.required],
  })

  constructor(private fb: FormBuilder,
              private countriesService: CountriesService){}


  get regions(): Region[]{
    return this.countriesService.regions; //1
  }

}


//1 -> Al ser privado countriesService, hace un getter de las regiones que le vienen por el getter del servicio