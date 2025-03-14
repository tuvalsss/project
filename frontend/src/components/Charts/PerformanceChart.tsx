import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Box, Select, HStack, Text } from '@chakra-ui/react'
import { CampaignHistoryData } from '../../client'

interface PerformanceChartProps {
  data: CampaignHistoryData[]
  onTimeRangeChange: (range: string) => void
}

export const PerformanceChart: React.FC<PerformanceChartProps> = ({ data, onTimeRangeChange }) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('he-IL', {
      day: '2-digit',
      month: '2-digit',
    })
  }

  const formatCurrency = (value: number) => {
    return `₪${value.toLocaleString()}`
  }

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(2)}%`
  }

  return (
    <Box width="100%" height={400}>
      <HStack mb={4} justify="space-between">
        <Text fontSize="lg" fontWeight="bold">
          ביצועי קמפיינים
        </Text>
        <Select
          width="200px"
          onChange={(e) => onTimeRangeChange(e.target.value)}
          defaultValue="7d"
        >
          <option value="7d">7 ימים אחרונים</option>
          <option value="30d">30 ימים אחרונים</option>
          <option value="90d">90 ימים אחרונים</option>
        </Select>
      </HStack>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            yAxisId="left"
            tickFormatter={formatCurrency}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tickFormatter={formatPercentage}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            formatter={(value: number, name: string) => {
              if (name === 'CTR' || name === 'CPC') {
                return formatPercentage(value)
              }
              return formatCurrency(value)
            }}
            labelFormatter={formatDate}
          />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="spent"
            name="הוצאה"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
            dot={false}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="conversions"
            name="המרות"
            stroke="#82ca9d"
            dot={false}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="ctr"
            name="CTR"
            stroke="#ffc658"
            dot={false}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="cpc"
            name="CPC"
            stroke="#ff7300"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  )
} 