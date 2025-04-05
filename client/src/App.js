import "./App.css";
import Header from "./Components/Header";
import FloatImage from "./Components/FloatImage";

const imageStyle = {
  marginRight: "10%",
  marginLeft: "10%",
};

const floatStyle = {
  float: "left",
  marginRight: "15px",
  width: "200px",
  height: "auto",
};

function App() {
  return (
    <div className="App">
      <Header />
      <FloatImage
        imgSrc="/landingpage.jpeg"
        content="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
      />
    </div>
  );
}

export default App;
