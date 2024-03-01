import { Injectable } from '@angular/core';
import { Country, Region, SmallCountry } from '../interfaces/country.interfaces';
import { Observable, combineLatest, map, of, tap } from 'rxjs';
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

  getCountriesByRegion(region: Region): Observable<any[]>{
    if (!region) return of ([]); //con el of, devuelves un observable, devuelves un array vacío

    const url: string = `${ this.baseUrl}/region/${region}?fields=cca3,name,borders`;
    
    return this.http.get<Country[]>(url).pipe(
      map ( countries => countries.map(country => ({
        name: country.name.common,
        cca3: country.cca3,
        borders: country.borders ?? []
      })) ), //2
      )
  }

  getCountryByAlphaCode(alphaCode: string): Observable<SmallCountry>{
    console.log({alphaCode})

    const url = `${ this.baseUrl}/alpha/${alphaCode}?fields=cca3,name,borders`;
    return this.http.get<Country>(url).pipe(map( country => ({ //3
      name: country.name.common,
      cca3: country.cca3,
      borders: country.borders ?? []
    })));
  }

  getCountryBordersByCodes(borders: string[]): Observable<SmallCountry[]>{
    if (!borders || borders.length===0) return of([]);

    const countriesRequest: Observable<SmallCountry>[] = []; //almacena observables

    borders.forEach(code =>{
      const request = this.getCountryByAlphaCode(code);
      countriesRequest.push(request); 
      console.log('countryRequest', countriesRequest)
    });
    return combineLatest(countriesRequest); //4
  }

}


//1-> En este caso muta la relación que tiene con la propiedad original, para que nadie le mute los datos
//2-> El primer map es una función de RXJS para transformar datos y elsegundo, es el que te hace un nuevo array
// Crea un nuevo array cuyo contenido es un objeto con los datos de name, cca3 y borders
//3 -> Tranforma la respuesta de tipo Country en algo como SmallCountry
//4 -> combineLatest cuando sea llamado mediante subscribe, va a emitir hasta que todos los observables que hay en countriesRequest emitas y se disparen de manera simultánea