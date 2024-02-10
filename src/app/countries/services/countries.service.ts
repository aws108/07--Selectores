import { Injectable } from '@angular/core';
import { Region, smallCountry } from '../interfaces/country.interfaces';
import { Observable, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  private baseUrl= 'https://restcountries.com/v3.1';

  private _regions: Region[] = [
    Region.Africa,
    Region.Americas,
    Region.Asia,
    Region.Europe,
    Region.Oceania
  ];

  constructor(private http: HttpClient) { } // este es el servicio de http., para tener el modulo, hay que colocarlo en app.module

  get regions(): Region[]{
    return [...this._regions]; //1
  }

  getCountriesByRegion(region: Region): Observable<smallCountry[]>{
    if (!region) return of ([]); //con el of, devuelves un observable, devuelves un array vacío

    const url: string = `${ this.baseUrl}/region/${region}?fields=cca3,name,borders`;
    
    return this.http.get<smallCountry[]>(url).pipe(tap (response => console.log('respuesta',response)))
  }

}


//1-> En este caso muta la relación que tiene con la propiedad original, para que nadie le mute los datos