import { Component, ElementRef, ViewChild } from '@angular/core';

interface SubscriptionPlan {
  id: string;
  name: string;
  frequency: string;
  badge?: string;
  description: string;
  benefits: string[];
  shipping: string;
  bottleOptions: { count: number; price: string }[];
}

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss']
})
export class SubscriptionsComponent {
  @ViewChild('plansTrack') plansTrack?: ElementRef<HTMLDivElement>;
  currentPlanIndex = 0;

  readonly heroHighlights = [
    { icon: 'truck', text: 'Envío incluido en CABA y GBA' },
    { icon: 'sparkles', text: 'Etiquetas curadas por sommeliers' },
    { icon: 'calendar-clock', text: 'Entregas programadas cada mes' }
  ];

  readonly plans: SubscriptionPlan[] = [
    {
      id: 'malbec',
      name: 'Malbec Local',
      frequency: 'mes',
      badge: 'Best seller',
      description: 'Selección rotativa de Malbec argentinos con foco en bodegas de altura.',
      benefits: [
        '3 botellas + ficha de cata',
        'Acceso a catas virtuales',
        '10% off en vinos de la tienda'
      ],
      shipping: 'Entrega dentro de los primeros 7 días del mes',
      bottleOptions: [
        { count: 3, price: '$32.900' },
        { count: 6, price: '$59.900' }
      ]
    },
    {
      id: 'explorador',
      name: 'Explorador',
      frequency: 'mes',
      badge: 'Nuevo',
      description: 'Vinos de distintos terruños con estilos modernos, blancos y tintos.',
      benefits: [
        '4 etiquetas (blancos + tintos)',
        'Maridajes sugeridos por el equipo Tatú',
        '15% off en catas presenciales'
      ],
      shipping: 'Entrega a mitad de mes, coordinada por mail',
      bottleOptions: [
        { count: 3, price: '$45.500' },
        { count: 6, price: '$82.500' }
      ]
    },
    {
      id: 'alta-gama',
      name: 'Gran Reserva',
      frequency: 'bimestral',
      description: 'Botellas de guarda, ediciones limitadas y microvinificaciones.',
      benefits: [
        '3 vinos ícono o partidas limitadas',
        '20% off en compras adicionales',
        'Acceso anticipado a lanzamientos Tatú'
      ],
      shipping: 'Coordinamos entrega personalizada dentro de la semana 1',
      bottleOptions: [
        { count: 3, price: '$84.000' },
        { count: 6, price: '$158.000' }
      ]
    }
  ];

  selectedBottleOption: Partial<Record<string, number>> = {};

  readonly flowSteps = [
    { icon: 'sparkle', title: 'Elige tu plan', text: 'Selecciona la curaduría que mejor va con tu forma de tomar vino.' },
    { icon: 'calendar-check', title: 'Configura la entrega', text: 'Coordinamos el día y la franja horaria; podés pausar cuando quieras.' },
    { icon: 'wine', title: 'Disfruta y aprende', text: 'Cada envío incluye ficha de cata y maridajes sugeridos por el equipo Tatú.' }
  ];

  readonly clubPerks = [
    { icon: 'percent', title: 'Descuentos miembro', text: 'Hasta 20% off en compras adicionales y preventas.' },
    { icon: 'gift', title: 'Experiencias', text: 'Invitaciones a degustaciones privadas y eventos en bodega.' },
    { icon: 'sparkles', title: 'Curaduría consciente', text: 'Trabajamos con productores que cuidan la tierra y la comunidad.' }
  ];

  scrollToPlans(): void {
    const target = document.getElementById('planes');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  scrollPlans(direction: 'next' | 'prev'): void {
    const nextIndex = direction === 'next'
      ? Math.min(this.currentPlanIndex + 1, this.plans.length - 1)
      : Math.max(this.currentPlanIndex - 1, 0);
    this.scrollToPlan(nextIndex);
  }

  scrollToPlan(index: number): void {
    const track = this.plansTrack?.nativeElement;
    if (!track) return;

    const firstCard = track.querySelector('.plan-card') as HTMLElement | null;
    const styles = getComputedStyle(track);
    const cardWidth = firstCard?.offsetWidth ?? 320;
    const gap = parseFloat(styles.columnGap || styles.gap || '16');
    const offset = (cardWidth + gap) * index;

    this.currentPlanIndex = index;
    track.scrollTo({ left: offset, behavior: 'smooth' });
  }

  onPlansScroll(): void {
    const track = this.plansTrack?.nativeElement;
    if (!track) return;

    const firstCard = track.querySelector('.plan-card') as HTMLElement | null;
    const styles = getComputedStyle(track);
    const cardWidth = firstCard?.offsetWidth ?? 320;
    const gap = parseFloat(styles.columnGap || styles.gap || '16');
    const step = cardWidth + gap;
    const index = Math.round(track.scrollLeft / step);
    this.currentPlanIndex = Math.min(Math.max(index, 0), this.plans.length - 1);
  }

  selectBottleOption(planId: string, option: { count: number; price: string }): void {
    this.selectedBottleOption[planId] = option.count;
  }

  viewSelection(plan: SubscriptionPlan): void {
    // Reemplazar por navegación o modal con la selección de vinos del plan
    console.log('Ver selección del mes para', plan.id);
  }

  getDisplayPrice(plan: SubscriptionPlan): string {
    const selectedCount = this.selectedBottleOption[plan.id] ?? plan.bottleOptions[0]?.count;
    const match = plan.bottleOptions.find(o => o.count === selectedCount) || plan.bottleOptions[0];
    return match?.price || '';
  }
}
