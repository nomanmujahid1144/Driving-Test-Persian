
import DashboardHeroSection from "./components/major-components/DashboardHeroSection";
import { Signup } from "./screen/Signup";
import { Login } from "./screen/Login";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { SideAndNavbar } from "./components/major-components/SideAndNavbar";
import { Users } from "./components/major-components/Users";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { adminLogin } from "./redux/Actions/ProfileActions";
import { useJsApiLoader } from "@react-google-maps/api";



import "./components/fontawesomeIcons"
import { WebsitePages } from "./components/major-components/WebsitePages";
import { AddQuestions } from "./components/major-components/AddQuestions";
import { AddBlogs } from "./components/major-components/AddBlogs";
import { Videos } from "./components/major-components/Videos";
import { AddUsefulTips } from "./components/major-components/AddUsefulTips";
import { TestQuestionWebSitePages } from "./components/major-components/TestQuestionWebSitePages";
import { AddTestQuestions } from "./components/major-components/AddTestQuestions";
import { ResultofEachDevice } from "./components/major-components/ResultofEachDevice";
import { AddStatisticsBanner } from "./components/major-components/AddStatisticsBanner";

const places = ["places"]
function App() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyASE7MqDo7TNZ_4fmORznk_JMBFm0d_pKY',
    libraries: places,
  });
  const dispatch = useDispatch();
  const token = useSelector(
    (state) => state.ProfileReducer
  );
  useEffect(() => {
    getToken()
  })
  const getToken = async () => {
    console.log(localStorage.getItem('token'), 'TOKENS')
    const token = localStorage.getItem('token')
    if (token) {
      dispatch(adminLogin(token))
    }
  }


  return (
    <>
      <Router>       
        <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/' element={localStorage.getItem('token') ? <SideAndNavbar /> : <Login />} >
              <Route index element={<DashboardHeroSection />} />
              <Route path='/users' element={<Users />} />
              <Route path='/categories' element={<AddBlogs />} />
              <Route path='/questions' element={<WebsitePages />} />
              <Route path='/questions/:id/english' element={<AddQuestions />} />
              <Route path='/test-questions' element={<TestQuestionWebSitePages />} />
              <Route path='/results' element={<ResultofEachDevice />} />
              <Route path='/videos' element={<Videos />} />
              <Route path='/useful-tips' element={<AddUsefulTips />} />
              <Route path='/add-banner' element={<AddStatisticsBanner />} />
            </Route>
          </Routes>
      </Router>

    </>
  );
}

export default App;
