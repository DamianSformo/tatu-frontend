import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';

interface MenuItem {
  key?: string;
  name: string;
  path?: string;
  subItems?: MenuItem[];
  imageUrl?: string;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnChanges {
  @Input() isOpen: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() categorySelected = new EventEmitter<{ key: string; name: string }>();

  readonly menuTienda: MenuItem[] = [
    { 
      name: 'Bebidas', 
      subItems: [
        { key: 'wine', name: 'Vinos', path: '/bebidas/vinos', imageUrl: 'assets/vino.png' },
        { key: 'beer', name: 'Cervezas', path: '/bebidas/cervezas', imageUrl: 'assets/cerveza.png' },
        { key: 'whisky', name: 'Whisky', path: '/productos/whisky', imageUrl: 'assets/whisky.png' },
      ]
    },
    { 
      name: 'Almacén', 
      subItems: [
        { key: 'oil', name: 'Aceites', path: '/productos/aceites' },
        { key: 'pasta', name: 'Pastas', path: '/productos/pastas' },
      ] 
    },
    { key: 'accessories', name: 'Accesorios', path: '/productos/accesorios' },
  ];

  readonly menuData: MenuItem[] = [
    { name: 'Mi cuenta', path: '/cuenta' },
    { name: 'Degustaciones', path: '/degustaciones' },
    { name: 'Local', path: '/local' },
  ];
  
  currentView: MenuItem[] = [];
  history: MenuItem[][] = [];
  selectedItem?: MenuItem;

  constructor(private router: Router) {}

  ngOnInit() {
    this.resetMenu();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && this.isOpen) {
      this.resetMenu();
    }
  }

  private resetMenu(): void {
    this.history = [];
    this.currentView = [...this.menuTienda, ...this.menuData];
  }

  navigateForward(item: MenuItem) {
    if (item.subItems && item.subItems.length > 0) {
      this.history.push(this.currentView);
      this.currentView = item.subItems;
      this.selectedItem = item;
    } else if (item.path) {
      this.categorySelected.emit({ key: item.key || '', name: item.name });
      this.router.navigate([item.path]);
      this.closeSidebar();
    }
  }

  navigateBack() {
    if (this.history.length > 0) {
      this.currentView = this.history.pop()!;
    }
  }

  closeSidebar() {
    this.close.emit();
    this.resetMenu();
  }
}
