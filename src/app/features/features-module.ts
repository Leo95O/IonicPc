import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeaturesRoutingModule } from './features-routing-module';
import { SharedModule } from '../shared/shared-module';
import { PageNotFound } from './page-not-found/page-not-found';

@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    FeaturesRoutingModule,
    SharedModule,

  ],
  exports: [


  ]
})
export class FeaturesModule { }
