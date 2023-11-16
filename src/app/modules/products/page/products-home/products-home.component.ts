import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { EventAction } from 'src/app/models/interfaces/products/event/EventAction';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';
import { ProductsService } from 'src/app/services/products/products.service';
import { ProductsDataTransferService } from 'src/app/shared/services/products-data-transfer.service';

@Component({
  selector: 'app-products-home',
  templateUrl: './products-home.component.html',
  styleUrls: []
})
export class ProductsHomeComponent implements OnInit, OnDestroy {

  private readonly destroy$: Subject<void> = new Subject();
  public productsDatas: Array<GetAllProductsResponse> = [];

  constructor(
    private productsService: ProductsService,
    private productsDtService: ProductsDataTransferService,
    private router: Router,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.getServiceProductsDatas();
  }

  public getServiceProductsDatas() {
    const productsLoaded = this.productsDtService.getProductsDatas();
    if (productsLoaded.length > 0) {
      this.productsDatas = productsLoaded;
    } else this.getAPIProductsDatas();

    console.log('DADOS DE PRODUTOS: ', this.productsDatas);
  }

  public getAPIProductsDatas() {
    this.productsService.getAllProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.productsDatas = response;
          }
        },
        error: (error) => {
          console.log(error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Erro ao carregar produtos',
            life: 2500
          });
          this.router.navigate(['/dashboard']);
        },
      });
  }

  public handleProductAction(event: EventAction): void {
    if (event) {
      console.log('DADOS DO EVENTO RECEBIDO', event);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
