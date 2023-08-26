import React, { useState, useEffect } from "react";
import { db } from "../context/firebase";
import {
  getDoc,
  doc,
  query,
  where,
  getDocs,
  collection,
} from "firebase/firestore";
import Loading from "./Loading";

const DataFetcher = ({ userId, onDataLoaded }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user document from Users collection
        const userDocRef = doc(db, "Users", userId);
        const userDocSnap = await getDoc(userDocRef);

        const userData = userDocSnap.data();
        if (!userData) {
          console.error("User data not found for ID:", userId);
          return;
        }
        userData.id = userDocSnap.id;
        sessionStorage.setItem("user", JSON.stringify(userData));

        const companyRef = userData.Company; // This is a reference to a Company document

        if (!companyRef) {
          console.error("No company reference found for user");
          return;
        }

        // Fetch company data using the document reference
        const companyDocSnap = await getDoc(companyRef);
        let companyData = companyDocSnap.data();
        companyData.id = companyDocSnap.id;

        if (!companyDocSnap.exists()) {
          console.error("Company document referenced does not exist!");
          return;
        }

        const companyInfo = companyData;
        sessionStorage.setItem("company", JSON.stringify(companyInfo));

        // Query the nested Timesheet collection for the specific company
        const timesheetQuery = query(collection(companyRef, "Timesheet")); // Adjusted this line
        const timesheetQuerySnapshot = await getDocs(timesheetQuery);
        const timesheetData = timesheetQuerySnapshot.docs.map((doc) =>
          doc.data()
        );
        // Store timesheet data in session storage
        sessionStorage.setItem("timesheetData", JSON.stringify(timesheetData));

        const usersQuery = query(
          collection(db, "Users"),
          where("Company", "==", companyRef)
        );
        const users = [];
        const usersQuerySnapshot = await getDocs(usersQuery);
        const usersData = usersQuerySnapshot.docs.map((doc) => {
          let data = doc.data();
          data.id = doc.id;
          users.push(data);
        });

        // Store company users data in session storage
        sessionStorage.setItem("companyUsers", JSON.stringify(users));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setIsLoading(false); // Data fetching is complete
      onDataLoaded && onDataLoaded();
    };

    fetchUserData();
  }, [userId, onDataLoaded]);

  if (isLoading) {
    return <Loading />; // Render the loading component if data is still being fetched
  }

  return null; // This component doesn't render any UI after data is fetched
};

export default DataFetcher;
