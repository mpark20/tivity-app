import {
    Chart,
    ChartTitle,
    ChartLegend,
    ChartSeries,
    ChartSeriesItem,
    ChartCategoryAxis,
    ChartCategoryAxisTitle,
    ChartCategoryAxisItem,
  } from "@progress/kendo-react-charts";
  import { COLORS } from "../constants";
  
  // Graph data
  
  
  const categories = ["total (min)", "average per session (min)", "# of sessions"];
  
  const seriesLabels = {
    visible: true,
    padding: 3,
    font: "normal 16px Arial, sans-serif",
    position: "center",
  };
  
  const Bar = props => {
    const series = [
      {
        status: "Total",
        data: [props.totalMin, props.avgMin, props.sessions],
        color: COLORS.total,
      },
      /*{
        status: "Average Session Duration",
        data: [props.avgMin],
        color: COLORS.average,
      },
      {
        status: "Number of Sessions",
        data: [props.sessions],
        color: COLORS.sessions,
      },*/
      
    ];
    return (
      <Chart>
        <ChartTitle text="Focus Timer Usage: All-Time" />
        <ChartLegend visible={false} />
        <ChartCategoryAxis>
          <ChartCategoryAxisItem categories={categories} >
            <ChartCategoryAxisTitle text='' />
          </ChartCategoryAxisItem>
        </ChartCategoryAxis>
        <ChartSeries>
          {series.map((item, idx) => (
            <ChartSeriesItem
              key={idx}
              type="column"
              gap={2}
              spacing={0.5}
              labels={seriesLabels}
              data={item.data}
              name={item.status}
              color={item.color}
            />
          ))}
        </ChartSeries>
        <p>(minutes)</p>
      </Chart>
    );
  };
  
  export default Bar;