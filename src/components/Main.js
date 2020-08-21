import React from "react";
import Semester from "./semester/semester";
import { useSelector, useDispatch } from "react-redux";
import AddSemesterButton from "./semester/AddSemesterButton";
import { db } from "../firebase";
import Loader from "./Loader";
import { setReduxStoreData } from "../redux/actions/asyncFetching";

const Main = () => {
  const {
    semesters,
    activeLevel,
    authenticated,
    uid,
    levels,
    componentActivity,
  } = useSelector((state) => {
    return {
      authenticated: state.auth.authenticated,
      uid: state.auth.userDetails.uid,
      activeLevel: state.componentActivity.activeLevel,
      semesters: state.levels[state.componentActivity.activeLevel],
      levels: state.levels,
      componentActivity: state.componentActivity,
    };
  });

  const dispatch = useDispatch();

  const [isFetching, setFetching] = React.useState(true);

  React.useEffect(() => {
    if (authenticated) {
      const userRef = db.collection("users").doc(uid);
      userRef.get().then((doc) => {
        if (!doc.exists) {
          setFetching(false);
          const usersRef = db.collection("users");
          usersRef.doc(uid).set({ levels, componentActivity });
        }
      });
    }
    // }, []);
  }, [authenticated, uid, levels, componentActivity, dispatch]);

  React.useEffect(() => {
    if (authenticated) {
      const userRef = db.collection("users").doc(uid);
      userRef.get().then((doc) => {
        if (doc.exists) {
          setFetching(false);
          // Currently: ["levels", "componentActivity"]
          dispatch(setReduxStoreData(doc.data()));
        }
      });
    }
  }, [authenticated, dispatch, uid]);

  return isFetching ? (
    <Loader />
  ) : (
    <main>
      {Object.keys(semesters).map((semester) => {
        return (
          <React.Fragment key={`${semester}${Math.random()}`}>
            <Semester
              level={activeLevel}
              name={semester}
              courses={semesters[semester].courses}
            />
            <AddSemesterButton level={activeLevel} />
          </React.Fragment>
        );
      })}
    </main>
  );
};

export default Main;
