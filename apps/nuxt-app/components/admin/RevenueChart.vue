<template>
  <!-- Use ClientOnly to prevent SSR issues with chart library -->
  <ClientOnly>
    <!-- Re-render the component on theme change -->
    <AreaChart
      :key="`${theme}-${colorScheme}`"
      :data="chartData"
      :height="300"
      :categories="categories"
      :y-grid-line="true"
      :x-formatter="xFormatter"
      :curve-type="CurveType.MonotoneX"
      :legend-position="LegendPosition.Top"
      :hide-legend="false"
    />
    <template #fallback>
      <div class="h-[300px] flex items-center justify-center border rounded-lg bg-muted/50">
        <div class="text-muted-foreground">Loading chart...</div>
      </div>
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
// Interface for chart data structure
interface RevenueChartItem {
  month: string
  revenue: number
  orders: number
}

// Define props
interface Props {
  chartData?: RevenueChartItem[]
}

const props = withDefaults(defineProps<Props>(), {
  chartData: () => []
})

// Theme composable for theme switching
const { theme, colorScheme } = useTheme()

// Get chart colors from CSS custom properties (hex format for chart compatibility)
const getChartColor = (colorVar: string): string => {

  
  // Fallback colors for SSR
  return colorVar === 'chart-1' ? '#D97706' : '#009689'
}

// Define chart categories with CSS variable colors
const categories = computed(() => {
  const revenueColor = '#D97706'
  const ordersColor = '#009689'
  
  return {
    revenue: {
      name: 'Revenue',
      color: revenueColor, // Uses CSS variable --chart-1-hex
    },
    orders: {
      name: 'Orders', 
      color: ordersColor, // Uses CSS variable --chart-2-hex
    },
  }
})

// Use chartData from props, with fallback demo data
const chartData = computed(() => {
  if (props.chartData && props.chartData.length > 0) {
    return props.chartData
  }
  
  // Fallback demo data for development
  return [
    { month: 'Jan', revenue: 12000, orders: 4500 },
    { month: 'Feb', revenue: 15000, orders: 5200 },
    { month: 'Mar', revenue: 18000, orders: 6100 },
    { month: 'Apr', revenue: 22000, orders: 7300 },
    { month: 'May', revenue: 19000, orders: 6800 },
    { month: 'Jun', revenue: 25000, orders: 8400 },
  ]
})

// X-axis formatter function
const xFormatter = (i: number): string => {
  return chartData.value[i]?.month || ''
}
</script> 