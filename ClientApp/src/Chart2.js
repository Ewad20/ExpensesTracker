import React, { useState, useEffect } from "react";
import Chart from "chart.js/auto";

const Chart2 = () => {
  const [chart2, setChart2] = useState([]);

  useEffect(() => {
    const fetchChart2 = async () => {
      try {
        const response = await fetch("api/chart/getChart2", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (response.ok) {
          const chart2Data = await response.json();

          setChart2(chart2Data);
        } else {
          console.error(response);
          setChart2([]);
        }
      } catch (error) {
        console.error("Error Chart2", error);
      }
    };

    fetchChart2();
  }, []);

  useEffect(() => {
    if (chart2 && Object.keys(chart2).length > 0) {
      const ctx2 = document.getElementById("myChart2").getContext("2d");
      const xValues = Object.keys(chart2);

      const yValues = Object.values(chart2);

      const myChart2 = new Chart(ctx2, {
        type: "bar",
        data: {
          labels: xValues,
          datasets: [
            {
              fill: false,
              lineTension: 0,
              backgroundColor: ["pink", "lightblue", "cyan", "grey"],
              borderColor: "6C698D",
              data: yValues,
            },
          ],
        },
        options: {
          legend: { display: false },
        },
      });

    }
  }, [chart2]);

  return (
    <div className="card mx-auto my-5 h-auto background-my w-75">
      <p style={{ fontWeight: "bold", fontSize: "18px" }}>Expense Categories</p>
      <canvas id="myChart2" width="520" height="520"></canvas>
    </div>
  );
};

export default Chart2;
