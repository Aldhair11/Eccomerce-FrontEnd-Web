import {Component, OnInit} from '@angular/core';
import {ReportService} from '../../core/services/reports/report.service';
import {UsersService} from '../../core/services/users/users.service';
import {AutoComplete} from 'primeng/autocomplete';
import {FormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';
import {UIChart} from 'primeng/chart';

@Component({
  selector: 'app-audit-admin',
  imports: [
    AutoComplete,
    FormsModule,
    NgIf,
    UIChart
  ],
  templateUrl: './audit-admin.component.html',
  styleUrl: './audit-admin.component.css'
})
export class AuditAdminComponent implements OnInit {
  selectedUser: any;
  filteredUsers: any[] = [];
  chartData: any;
  chartOptions: any;

  constructor(private reportService: ReportService, private userService: UsersService) {}

  ngOnInit(): void {
    this.setupChart();
  }

  searchUser(event: any): void {
    const searchTerm = event.query.trim().toLowerCase();

    this.userService.getAllUsers(0, 10).subscribe(
      (data) => {
        if (data && Array.isArray(data.content)) {
          this.filteredUsers = data.content
            .filter((user: any) => user.fullName.toLowerCase().includes(searchTerm))
            .map((user: any) => ({
              id: user.idUser,
              name: user.fullName,
              username: user.username,
              email: user.email,
              dni: user.dni,
              birthDate: user.birthDate,
              phoneNumber: user.phoneNumber,
              roleName: user.roleName
            }));
        } else {
          this.filteredUsers = [];
        }
      },
      (error) => {
        console.error("❌ Error al buscar usuarios:", error);
      }
    );
  }

  loadReports(userId: number): void {
    this.reportService.getReportsByUser(0, 100, userId).subscribe(
      (data) => {
        console.log('📊 Reportes cargados:', data.content);

        const auditData = {
          read: data.content.filter((log: any) => log.action === 'READ').length,
          create: data.content.filter((log: any) => log.action === 'CREATED').length,
          update: data.content.filter((log: any) => log.action === 'UPDATED').length,
          delete: data.content.filter((log: any) => log.action === 'DELETED').length,
        };

        this.chartData = {
          labels: ['READ', 'CREATE', 'UPDATE', 'DELETE'],
          datasets: [
            {
              data: [
                auditData.read,
                auditData.create,
                auditData.update,
                auditData.delete
              ],
              backgroundColor: ['#36A2EB', '#4CAF50', '#FFC107', '#F44336'],
              hoverBackgroundColor: ['#62B4F9', '#66BB6A', '#FFD54F', '#E57373']
            }
          ]
        };

        this.setupChart();
      },
      (error) => {
        console.error('❌ Error al cargar reportes:', error);
      }
    );
  }


  updateChart(auditData: any): void {
    this.chartData = auditData;
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: true }
      },
      scales: {
        x: { stacked: true },
        y: { stacked: true }
      }
    };
  }


  setupChart(): void {
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top'
        },
        tooltip: {
          callbacks: {
            label: function (tooltipItem: any) {
              return `${tooltipItem.label}: ${tooltipItem.raw}`;
            }
          }
        }
      }
    };
  }

}
