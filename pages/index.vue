<template>
  <div>
    <ag-grid-vue
      style="width: 1000px; height: 500px;"
      v-bind="aggrid"
      class="ag-theme-alpine"
      :modules="modules"
      @grid-ready="events.onGridReady"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { getAgGridModules } from '~/config/ag-grid'
import useAgGrid from '@/composable/useAgGrid'
import records from '@/config/records.json'
import view from '@/config/view.json'

export default defineComponent({
  name: 'IndexPage',
  setup () {
    const { aggrid, events } = useAgGrid({ records, view, onChangeView: () => {} })
    return {
      aggrid,
      events,
      modules: getAgGridModules()
    }
  }
})
</script>

<style>
div[col-id="index"].ag-cell.non-editable {
  background-image: none !important;
}

.ag-pinned-right-cols-container .ag-row, .ag-pinned-right-cols-container .ag-cell {
  background: transparent !important;
}

/* Hide right header and spacer */
.ag-pinned-right-header,
.ag-horizontal-right-spacer {

  width: 0 !important;
  min-width: 0 !important;
}

/* Add absolute position so that action buttons column will appear on top of other columns. pointer-events: none to pass on mousemove event to behind columns */
.ag-pinned-right-cols-container {
  position: absolute !important;
  right: 10px;
  pointer-events: none;
}
/* Reset pointer-events so that click can happen on action buttons */
.ag-pinned-right-cols-container * {
  pointer-events: initial;
}

/* Hide border of right-cols-container */
.ag-pinned-right-cols-container .ag-cell {
  border: none !important;
}

/* Show action buttons only for row that is being hovered. For rows which are not being hovered, hide them by setting their width and padding to 0.*/
.ag-pinned-right-cols-container .ag-row:not(.ag-row-hover),
.ag-pinned-right-cols-container .ag-row:not(.ag-row-hover) .ag-cell {
  width: 0 !important;
  padding: 0 !important;
}

.ag-pinned-left-cols-container {
  border-right: 1px solid rgb(231, 240, 254);
}

.ag-horizontal-left-spacer {
  border-right: 1px solid rgb(231, 240, 254) !important;
}
.ag-status-bar {
 border-top: 1px solid rgb(231, 240, 254) !important;
}
</style>
<style lang="scss">
  @import "@ag-grid-community/core/dist/styles/ag-grid.css";
  @import "@ag-grid-community/core/dist/styles/ag-theme-alpine.css";
</style>
