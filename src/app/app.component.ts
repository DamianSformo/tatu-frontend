import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'mi-tienda-de-vinos';

  isSidebarOpen: boolean = false;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

   onCategorySelected(category: { key: string; name: string }) {
    console.log('Categoría emitida por sidebar:', category);

    sessionStorage.setItem('selectedCategory', JSON.stringify(category));
  }
}