import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Web3Service } from "./services/web3.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  contractAddress: string = '';
  contractName: string = '';
  walletAddress: string[] | undefined;
  chainId: string | undefined;
  walletBalance: string | undefined;
  tokenSymbol: string = '';
  tokenDecimal: number = 0;
  tokenBalance: number = 0;
  connected: boolean = false;
  mintForm: FormGroup;
  transferForm: FormGroup;

  constructor(
    private web3: Web3Service,
    private formBuilder: FormBuilder) {
    (window as any).ethereum.on('accountsChanged', () => {
      this.connected = false;
      this.connect();
    });

    (window as any).ethereum.on('chainChanged', () => {
      this.connected = false;
      this.connect();
    });

    this.mintForm = this.formBuilder.group({
      receiverAddress: ['', Validators.required],
      amount: [0, Validators.required]
    })

    this.transferForm = this.formBuilder.group({
      receiverAddress: ['', Validators.required],
      amount: [0, Validators.required]
    })
  }

  connect() {
    this.web3.connectAccount()
      .then(response => {
        console.log(response);
        this.walletAddress = response;

        if (this.walletAddress!.length > 0) {
          this.connected = true;
        }
      })
      .then(() => {
        this.web3.getChainId().then(response => {
          this.chainId = response;
        });
      })
      .then(() => {
        this.web3.connectContract();
      })
      .then(() => {
        this.web3.getContractName().then(response => {
          this.contractName = response;
        })
      })
      .then(() => {
        this.web3.getWalletBalance().then(response => {
          this.walletBalance = response;
        })
      })
      .then(() => {
        this.web3.getTokenSymbol().then(response => {
          this.tokenSymbol = response;
        })
      })
      .then(() => {
        this.web3.getTokenDecimal().then(response => {
          this.tokenDecimal = response;
        })
      })
      .then(() => {
        this.web3.getTokenBalance().then(response => {
          this.tokenBalance = response;
        })
      })
      .then(() => {
        this.contractAddress = this.web3.getContractAddress();
      });
  }

  // convenience getter for easy access to form fields
  get mintFormFormControls() {
    return this.mintForm.controls;
  }

  mint() {
    if (!this.connected) {
      alert('kindly connect');
      return;
    }

    if (this.mintForm.invalid) {
      alert('invalid input');
      return;
    }

    this.web3.mintToken(this.mintFormFormControls['receiverAddress'].value, this.mintFormFormControls['amount'].value).then(response => {
      console.log(response);
    })
  }

  // convenience getter for easy access to form fields
  get transferFormFormControls() {
    return this.transferForm.controls;
  }

  transfer() {
    if (!this.connected) {
      alert('kindly connect');
      return;
    }

    if (this.transferForm.invalid) {
      alert('invalid input');
      return;
    }

    this.web3.transferToken(this.transferFormFormControls['receiverAddress'].value, this.transferFormFormControls['amount'].value).then(response => {
      console.log(response);
      this.web3.getTokenBalance().then(response => {
        this.tokenBalance = response;
      })
    })
  }
}
