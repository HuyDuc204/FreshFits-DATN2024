import React, { useEffect, useState } from "react";
import { Line, Pie, Bar } from "react-chartjs-2";
import DatePicker from "react-datepicker";
import moment from "moment";
import {
  getCountCardStatistic,
  getCountStatusOrder,
  getStatisticByMonth,
  getStatisticByDay,
} from "../../services/userService";
import "react-datepicker/dist/react-datepicker.css";
import "chart.js/auto";

const Home = () => {
  const [countCard, setCountCard] = useState({});
  const [countStatusOrder, setCountStatusOrder] = useState({});
  const [statisticByMonth, setStatisticByMonth] = useState({});
  const [statisticByDay, setStatisticByDay] = useState({});
  const [dateRange, setDateRange] = useState([null, null]);
  const [type, setType] = useState("month");
  const [year, setYear] = useState(new Date());

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    const resCard = await getCountCardStatistic();
    if (resCard?.errCode === 0) setCountCard(resCard.data);

    const resStatusOrder = await getCountStatusOrder({
      oneDate: type === "day" ? dateRange[0] : new Date(),
      twoDate: dateRange[1],
      type,
    });
    if (resStatusOrder?.errCode === 0) setCountStatusOrder(resStatusOrder.data);

    const resMonth = await getStatisticByMonth(moment(year).format("YYYY"));
    if (resMonth?.errCode === 0) setStatisticByMonth(resMonth.data);

    const resDay = await getStatisticByDay({
      year: moment(year).format("YYYY"),
      month: moment(new Date()).format("M"),
    });
    if (resDay?.errCode === 0) setStatisticByDay(resDay.data);
  };

  const chartData = {
    pie: {
      labels: countStatusOrder?.arrayLable || [],
      datasets: [
        {
          data: countStatusOrder?.arrayValue || [],
          backgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "#4bc0c0", "#9966ff"],
        },
      ],
    },
    line: {
      labels: statisticByMonth?.arrayMonthLable || [],
      datasets: [
        {
          label: "Doanh thu",
          data: statisticByMonth?.arrayMonthValue || [],
          borderColor: "#36a2eb",
          backgroundColor: "rgba(53, 162, 235, 0.5)",
        },
      ],
    },
    bar: {
      labels: statisticByDay?.arrayDayLable || [],
      datasets: [
        {
          label: "Doanh thu",
          data: statisticByDay?.arrayDayValue || [],
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
      ],
    },
  };

  return (
    <div className="container-fluid px-4">
      <h1 className="mt-4">THỐNG KÊ</h1>
      <Line data={chartData.line} options={{ responsive: true }} />
      <Pie data={chartData.pie} options={{ responsive: true }} />
      <Bar data={chartData.bar} options={{ responsive: true }} />
    </div>
  );
};

export default Home;
