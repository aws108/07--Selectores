import { Injectable } from '@angular/core';
import { Region } from '../interfaces/country.interfaces';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  private _regions: Region[] = [
    Region.Africa,
    Region.Americas,
    Region.Asia,
    Region.Europe,
    Region.Oceania
  ];

  constructor() { }

  get regions(): Region[]{
    return [...this._regions]; //1
  }

}


//1-> En este caso muta la relación que tiene con la propiedad original, para que nadie le mute los datos