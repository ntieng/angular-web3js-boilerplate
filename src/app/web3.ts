import { InjectionToken } from '@angular/core';
import Web3 from 'web3';

export const web3 = new InjectionToken<Web3>('web3', {
  providedIn: 'root',
  factory: () => new Web3(Web3.givenProvider)
});
