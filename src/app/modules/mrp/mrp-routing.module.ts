import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DerivatesRoomsListComponent } from './derivates-room/derivates-rooms-list/derivates-rooms-list.component';

const routes: Routes = [
  { path: 'derivates-rooms', component: DerivatesRoomsListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MrpRoutingModule { }
