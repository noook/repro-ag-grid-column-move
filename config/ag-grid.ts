import { CsvExportModule } from '@ag-grid-community/csv-export'
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model'
import { RowGroupingModule } from '@ag-grid-enterprise/row-grouping'
import { RangeSelectionModule } from '@ag-grid-enterprise/range-selection'
import { ClipboardModule } from '@ag-grid-enterprise/clipboard'
import { ColDef, Module } from '@ag-grid-community/core'

const agGridModulesMap = {
  csv: CsvExportModule,
  clientSideRowModel: ClientSideRowModelModule,
  rangeSelection: RangeSelectionModule,
  clipboard: ClipboardModule,
  rowGrouping: RowGroupingModule
} as const

type ModuleKey = keyof typeof agGridModulesMap

export function getAgGridModules (modules: ModuleKey[] = []): Module[] {
  if (!modules.length) {
    return Object.values(agGridModulesMap)
  }

  return modules.map(moduleKey => agGridModulesMap[moduleKey])
}

export const CTAColumnDef: ColDef = {
  headerName: 'CTA',
  headerComponent: 'agColumnHeader',
  colId: 'cta',
  lockPosition: true,
  lockVisible: true,
  suppressNavigable: true,
  suppressMovable: true,
  editable: false,
  resizable: false,
  suppressMenu: true,
  sortable: false,
  width: 70,
  pinned: 'right'
}

export const rowNumberColDef: ColDef = {
  field: 'index',
  headerName: '',
  headerComponent: 'agColumnHeader',
  lockPosition: true,
  lockVisible: true,
  suppressMovable: true,
  editable: false,
  resizable: false,
  suppressMenu: true,
  sortable: false,
  width: 50,
  pinned: 'left'
}

export const hiddenIdColumnDefs: ColDef[] = [
  {
    // field: idKeys.implementationKey,
    hide: true,
    valueGetter: ({ data }) => {
      return data.implementationKey
    }
  },
  {
    // field: idKeys.productId,
    hide: true,
    valueGetter: ({ data }) => {
      return data.productId
    }
  },
  {
    // field: idKeys.publisherId,
    hide: true,
    valueGetter: ({ data }) => {
      return data.companyId
    }
  }
]
