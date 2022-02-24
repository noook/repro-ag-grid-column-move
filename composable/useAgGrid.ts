/* eslint-disable */
import {
  AgGridEvent,
  ColDef,
  GridApi,
  GridOptions
} from '@ag-grid-community/core'
import { ref, Ref } from '@nuxtjs/composition-api'
import { CTAColumnDef, hiddenIdColumnDefs, rowNumberColDef } from '@/config/ag-grid'

export type CustomColDef = {
  options: any[];
  headerLabels: Record<'fr'|'en', string>;
  optionsMap: Record<string, any>;
} & ColDef

function asGridOptions (gridOptions: GridOptions): GridOptions {
  return gridOptions
}

function defaultFormatter (params: any) {
  return params.value
}

function generateColumnDefFromView (column: any): CustomColDef {
  return {
    field: column.field,
    headerLabels: column.labels,
    hide: column.hidden,
    suppressMenu: true,
    sortable: false,
    lockPosition: false,
    editable: column.isEditable,
    options: column.options,
    // fieldType: column.type,
    optionsMap: column.options && Object.fromEntries(column.options?.map((option: any) => [option.id, option])),
    ...(column.width ? { width: column.width } : { flex: 1 }),
    valueFormatter: defaultFormatter
    // valueGetter: getter,
    // valueSetter: setter,
  }
}

export function generateColumnDefsFromView (
  view: any
): ColDef[] {
  return view.columns.map((column: any) => generateColumnDefFromView(column))
}

export function getOptions (): GridOptions {
  return {
    getDataPath: (data) => {
      return data.__path
    },
    columnTypes: {
      number: {
        cellRenderer: 'DefaultCellRenderer',
        cellEditor: 'NumberCellEditor',
        cellEditorParams: {
          useFormatter: true
        }
      },
      string: {
        cellRenderer: 'DefaultCellRenderer'
      }

    },
    groupDisplayType: 'groupRows',
    groupRowRendererParams: {
      suppressMovable: true,
      innerRenderer: 'GroupCellRenderer',
      suppressCount: false
    },

    groupDefaultExpanded: -1, // expand all groups by default
    suppressPropertyNamesCheck: true,
    suppressContextMenu: true,
    suppressRowClickSelection: true,
    suppressDragLeaveHidesColumns: true,
    suppressCopyRowsToClipboard: true,
    suppressMultiRangeSelection: true,
    enableRangeSelection: true,
    enableRangeHandle: true,
    enableFillHandle: true,
    enableCharts: false,
    rowSelection: 'multiple',
    undoRedoCellEditing: true,
    undoRedoCellEditingLimit: 5,
    rowBuffer: 15,
    rowHeight: 50,
    defaultColDef: {
      cellClass: (params) => {
        const shouldHide = [
          !params.colDef.editable,
          !['logo', 'products'].includes(params.colDef.field!),
          params.colDef.colId !== 'cta'
        ].every(condition => condition === true)

        if (shouldHide) {
          return 'non-editable'
        }
      },
      resizable: true,
      editable: true,
      sortable: true,
      filter: true
    },
    statusBar: {
      statusPanels: [
        {
          statusPanel: 'agTotalRowCountComponent',
          align: 'left'
        }
      ]
    }
  }
}

function getUpdateViewFromAgGridEvent (
  event: AgGridEvent,
  view: any
): Partial<any>|null {
  switch (event.type) {
    case 'columnMoved': {
      const aggridCols = event.columnApi.getAllDisplayedColumns()
      return {
        columnOrders: aggridCols.map(aggridCol => aggridCol.getColId())
      }
    };
    case 'columnResized': {
      const aggridCols = event.columnApi.getAllDisplayedColumns()
      const aggridColsMap = new Map(aggridCols.filter(col => col).map(col => [col.getColId(), col]))
      return {
        columns: view.columns.map((col: any) => {
          const aggridCol = aggridColsMap.get(col.field)
          return {
            ...col,
            width: aggridCol?.getActualWidth() || col.width || null
          }
        })
      }
    };
    default:
      return null
  }
}

function getEvents ({
  view,
  onChangeView,
  skipNextRerender
}: Pick<any, 'view' | 'onChangeView'> & {skipNextRerender: Ref<boolean>; }): GridOptions {
  const updateViewFn = (event: any) => {
    debouncedAgGridEvent(() => {
      const updatedView = getUpdateViewFromAgGridEvent(event, view)
      if (updatedView) {
        skipNextRerender.value = true
        onChangeView({ ...view, ...updatedView })
      }
    })
  }
  return {
    onColumnResized: updateViewFn,
    onColumnMoved: updateViewFn
  }
}

function getColumnDefs (view: any): ColDef[] {
  return [
    rowNumberColDef,
    ...hiddenIdColumnDefs,
    ...generateColumnDefsFromView(view),
    CTAColumnDef
  ]
}

export default function useAgGrid ({
  records,
  view,
  onChangeView
}: any) {
  // LicenseManager.setLicenseKey(context.$config.aggridLicenseKey)
  const needRefreshLoading = ref(false)
  const skipNextRerender = ref(false)

  const getAgGridInit = () => {
    return asGridOptions({
      treeData: view.group !== null,
      ...getOptions(),
      context: {
        view
      }
    })
  }

  const aggrid = ref(getAgGridInit())

  const agGridApi = ref<GridApi>()

  const turnOnBeamyLoader = () => {
    needRefreshLoading.value = true
  }
  const turnOffBeamyLoader = () => {
    setTimeout(() => {
      needRefreshLoading.value = false
    }, 20)
  }

  const updateRecords = ({ showLoader = false }: {showLoader: boolean}) => {
    showLoader && turnOnBeamyLoader()
    aggrid.value.treeData = view.group != null
    aggrid.value.api?.setRowData(records)
    showLoader && turnOffBeamyLoader()
  }

  return {
    aggrid,
    needRefreshLoading,
    events: {
      onGridReady: (params: AgGridEvent) => {
        agGridApi.value = params.api

        agGridApi.value.setRowData(records)
        agGridApi.value.setColumnDefs(getColumnDefs(view))
      }
    }
  }
}

const debouncedAgGridEvent = (fn: any) => fn()
