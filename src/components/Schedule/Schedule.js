import React, { useState } from "react";
import Day from "./Day";
import DayView from "./DayView";
import { AiOutlineCaretLeft, AiOutlineCaretRight } from "react-icons/ai";
import { db } from "../../context/firebase";
import { setDoc, doc, query, collection, getDocs } from "firebase/firestore";

const Schedule = ({ clickableUser, setModal, timesheet, updateTimesheet }) => {
  const [period, setPeriod] = useState("Weekly");
  const [startDate, setStartDate] = useState(new Date());

  const adjustToMonday = (date) => {
    const day = date.getDay();
    const difference = day === 0 ? -6 : 1 - day; // For Sunday, go back 6 days to get to Monday. For other days, 1 - day will give the correct difference.
    date.setDate(date.getDate() + difference);
    return new Date(date); // Return a new date object to avoid modifying the original date.
  };

  const mondayStartDate = adjustToMonday(new Date(startDate));

  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(mondayStartDate);
    date.setDate(date.getDate() + i);
    return date;
  });

  const handlePreviousWeek = () => {
    const newStartDate = new Date(startDate);
    newStartDate.setDate(startDate.getDate() - 7);
    setStartDate(newStartDate);
  };

  const handleNextWeek = () => {
    const newStartDate = new Date(startDate);
    newStartDate.setDate(startDate.getDate() + 7);
    setStartDate(newStartDate);
  };

  const handlePreviousDay = () => {
    const newStartDate = new Date(startDate);
    newStartDate.setDate(startDate.getDate() - 1);
    setStartDate(newStartDate);
  };

  const handleNextDay = () => {
    const newStartDate = new Date(startDate);
    newStartDate.setDate(startDate.getDate() + 1);
    setStartDate(newStartDate);
  };

  const handleToggleView = () => {
    if (period === "Weekly") {
      setPeriod("Daily");
    } else {
      setPeriod("Weekly");
    }
  };

  const handleSave = async () => {
    try {
      const storedTimesheet = JSON.parse(
        sessionStorage.getItem("timesheetData") || "[]"
      );
      const companyData = JSON.parse(sessionStorage.getItem("company") || "{}");
      const companyId = companyData.id;

      if (!companyId) {
        console.error(
          "Missing companyId from sessionStorage. Please ensure it's set correctly."
        );
        return;
      }

      for (let entry of storedTimesheet) {
        if (!entry.date) {
          console.error("Missing date for entry:", entry);
          continue;
        }

        const timesheetDocRef = doc(
          db,
          "Company",
          companyId,
          "Timesheet",
          entry.date
        );
        await setDoc(
          timesheetDocRef,
          { date: entry.date, shifts: entry.shifts },
          { merge: true }
        );
      }

      alert("Schedule saved successfully");
    } catch (error) {
      console.error("Error saving to Firestore:", error);
    }
  };

  const handleCancel = async () => {
    try {
      // 1. Clear the timesheetData from the session storage
      sessionStorage.removeItem("timesheetData");

      // 2. Fetch the original data from the Firestore database
      const companyData = JSON.parse(sessionStorage.getItem("company") || "{}");
      const companyId = companyData.id;

      const companyRef = doc(db, "Companies", companyId);
      const timesheetQuery = query(collection(companyRef, "Timesheet"));
      const timesheetQuerySnapshot = await getDocs(timesheetQuery);

      // 3. Store this fetched data back into the session storage
      const timesheetData = timesheetQuerySnapshot.docs.map((doc) => ({
        date: doc.id, // Remember the document's name is the date
        ...doc.data(),
      }));

      sessionStorage.setItem("timesheetData", JSON.stringify(timesheetData));
      window.location.reload();

      alert("Schedule cancelled and reverted to the original data.");
    } catch (error) {
      console.error("Failed to cancel and fetch original data:", error);
    }
  };

  return (
    <>
      <div className="schedule-title-container">
        {period === "Weekly" ? (
          <button className="button-pill" onClick={() => handleToggleView()}>
            Daily View
          </button>
        ) : (
          <button className="button-pill" onClick={() => handleToggleView()}>
            Weekly View
          </button>
        )}
        <h2 style={{ flex: 1, textAlign: "center" }}>
          {period === "Weekly" ? "Weekly Schedule" : "Daily Schedule"}
        </h2>
        <button className="button-pill" onClick={handleCancel}>
          Cancel
        </button>
        <button className="button-pill" onClick={handleSave}>
          Save
        </button>
      </div>
      <div
        className={
          period === "Weekly"
            ? "schedule-container"
            : "schedule-container-daily"
        }
      >
        <AiOutlineCaretLeft
          className={period === "Weekly" ? "arrow-icon" : "arrow-icon-daily"}
          onClick={period === "Weekly" ? handlePreviousWeek : handlePreviousDay}
        />
        {period === "Weekly" ? (
          weekDates.map((date, index) => (
            <Day
              period={period}
              key={index}
              day={`${date.toDateString().split(" ").slice(0, 3).join(" ")}`}
              notFormattedDate={date}
              shifts={timesheet[date.toDateString()] || []}
              updateTimesheet={updateTimesheet}
              timesheet={timesheet}
              clickableUser={clickableUser}
              setModal={setModal}
            />
          ))
        ) : (
          <DayView
            setModal={setModal}
            key={startDate.toString()}
            updateTimesheet={updateTimesheet}
            day={startDate}
            timesheet={timesheet}
          />
        )}
        <AiOutlineCaretRight
          className={period === "Weekly" ? "arrow-icon" : "arrow-icon-daily"}
          onClick={period === "Weekly" ? handleNextWeek : handleNextDay}
        />
      </div>
    </>
  );
};

export default Schedule;
