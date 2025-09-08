import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ElementRef,
  AfterViewInit
} from '@angular/core';
import { OrgChart } from 'd3-org-chart';

@Component({
  selector: 'app-org-chart',
  templateUrl: './org-chart.component.html',
  styleUrls: ['./org-chart.component.scss']
})
export class OrgChartComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;
  @Input() data: { id: number; name: string; parentId: number | null }[] = [];
  private chart!: OrgChart<any>;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initializeChart();
    this.updateChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && !changes['data'].firstChange) {
      this.updateChart();
    }
  }

  private initializeChart(): void {
    this.chart = new OrgChart()
      .container(this.chartContainer.nativeElement)
      .nodeWidth(() => 150) // Adjust node width for tournament layout
      .nodeHeight(() => 80) // Adjust node height
      .compact(true) // Keeps the layout compact
      .layout('right') // Rotates the chart to align like a tournament bracket
      .nodeContent((d: any) => `
        <div style="padding: 10px; 
                    text-align: center; 
                    background: lightblue; 
                    border-radius: 10px;">
          ${d.data.name}
        </div>
      `);
  }

  private updateChart(): void {
    if (this.chart && this.data.length) {
      this.chart.data(this.data).render().expandAll();;
    }
  }
}
