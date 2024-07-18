import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NameChangeProposalEditorComponent } from './namechangeproposaleditor/namechangeproposaleditor.component';
import { NameChangeProposalListComponent } from './name-change-proposal-list/name-change-proposal-list.component';
import { AvakinItemViewerComponent } from './avakin-item-viewer/avakin-item-viewer.component';

@NgModule({
  declarations: [
    AppComponent,
    NameChangeProposalEditorComponent,
    NameChangeProposalListComponent,
    AvakinItemViewerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
